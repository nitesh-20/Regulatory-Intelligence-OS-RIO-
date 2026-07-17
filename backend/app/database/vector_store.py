import os
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from pydantic_settings import BaseSettings

class VectorSettings(BaseSettings):
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "ignore"

v_settings = VectorSettings()

class QdrantStore:
    _client: QdrantClient = None
    _collection_name = "rio_documents"

    @classmethod
    def get_client(cls) -> QdrantClient:
        if cls._client is None:
            print(f"[VectorStore] Connecting to Qdrant at {v_settings.QDRANT_URL}...")
            cls._client = QdrantClient(
                url=v_settings.QDRANT_URL,
                api_key=v_settings.QDRANT_API_KEY if v_settings.QDRANT_API_KEY else None
            )
            cls._ensure_collection()
        return cls._client

    @classmethod
    def _ensure_collection(cls):
        try:
            collections = cls._client.get_collections().collections
            if not any(c.name == cls._collection_name for c in collections):
                print(f"[VectorStore] Creating collection '{cls._collection_name}'...")
                # Assuming Gemini embeddings which are typically 768 dimensions
                cls._client.create_collection(
                    collection_name=cls._collection_name,
                    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
                )
        except Exception as e:
            print(f"[VectorStore] Failed to connect or create collection: {e}")

def get_vector_store() -> QdrantClient:
    return QdrantStore.get_client()
