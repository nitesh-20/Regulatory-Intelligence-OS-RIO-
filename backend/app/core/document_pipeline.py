import os
import uuid
# pyrefly: ignore [missing-import]
from langchain_text_splitters import RecursiveCharacterTextSplitter
# pyrefly: ignore [missing-import]
from google import genai
# pyrefly: ignore [missing-import]
from qdrant_client.http.models import PointStruct
from app.database.vector_store import get_vector_store

class DocumentPipeline:
    def __init__(self):
        self.qdrant_client = get_vector_store()
        self.collection_name = "rio_documents"
        # Using Gemini via google-genai
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        if self.gemini_api_key:
            self.genai_client = genai.Client(api_key=self.gemini_api_key)
        else:
            self.genai_client = None

        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
            is_separator_regex=False,
        )

    def process_and_index(self, document_metadata: dict) -> dict:
        """
        Takes raw document dict (from crawler), chunks it, generates embeddings,
        and indexes it into Qdrant.
        """
        print(f"[DocumentPipeline] Processing document: {document_metadata.get('title', 'Unknown')}")
        
        raw_text = document_metadata.get("raw_text", "")
        if not raw_text:
            return {"status": "skipped", "reason": "No raw_text provided"}

        chunks = self.text_splitter.create_documents([raw_text])
        print(f"[DocumentPipeline] Created {len(chunks)} chunks.")

        if not self.genai_client:
            print("[DocumentPipeline] WARNING: No GEMINI_API_KEY found. Skipping embedding generation.")
            return {"status": "skipped", "reason": "Missing GEMINI API KEY"}

        points = []
        for i, chunk in enumerate(chunks):
            # Generate embedding using Gemini
            try:
                response = self.genai_client.models.embed_content(
                    model='text-embedding-004',
                    contents=chunk.page_content,
                )
                embedding = response.embeddings[0].values
                
                # Prepare payload
                payload = {
                    "doc_id": document_metadata.get("id"),
                    "title": document_metadata.get("title"),
                    "authority": document_metadata.get("authority"),
                    "category": document_metadata.get("category"),
                    "chunk_index": i,
                    "text": chunk.page_content
                }
                
                point_id = str(uuid.uuid4())
                points.append(
                    PointStruct(
                        id=point_id,
                        vector=embedding,
                        payload=payload
                    )
                )
            except Exception as e:
                print(f"[DocumentPipeline] Error generating embedding for chunk {i}: {e}")

        if points:
            try:
                self.qdrant_client.upsert(
                    collection_name=self.collection_name,
                    points=points
                )
                print(f"[DocumentPipeline] Successfully indexed {len(points)} vectors into Qdrant.")
                return {"status": "success", "chunks_indexed": len(points)}
            except Exception as e:
                print(f"[DocumentPipeline] Qdrant upsert failed: {e}")
                return {"status": "error", "reason": str(e)}
        else:
            return {"status": "skipped", "reason": "No embeddings generated"}
