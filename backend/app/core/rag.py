import os
import re
import numpy as np
from typing import List, Dict, Any
from google import genai
from app.database.connection import SessionLocal
from app.database.models import Policy

# Initialize Google GenAI client
# It will load GEMINI_API_KEY from environment automatically
api_key = os.getenv("GEMINI_API_KEY")
client = None
if api_key:
    client = genai.Client()

# Thread-safe in-memory vector database fallback
_vector_db: List[Dict[str, Any]] = []

def cosine_similarity(a: List[float], b: List[float]) -> float:
    arr_a = np.array(a, dtype=np.float32)
    arr_b = np.array(b, dtype=np.float32)
    norm_a = np.linalg.norm(arr_a)
    norm_b = np.linalg.norm(arr_b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(arr_a, arr_b) / (norm_a * norm_b))

def split_into_chunks(text: str, chunk_size: int = 600, overlap: int = 150) -> List[str]:
    """Chunks text into small paragraphs for indexing."""
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunks.append(" ".join(chunk_words))
        i += chunk_size - overlap
    return [c.strip() for c in chunks if c.strip()]

def get_embedding(text: str) -> List[float]:
    """Calculates embedding using official google-genai SDK."""
    if not client:
        # Static semantic mock fallback if no API key is present
        print("[RAG] Warning: GEMINI_API_KEY missing. Generating mock embedding.")
        # Make a pseudo-random embedding based on characters
        h = hash(text) % 1000
        np.random.seed(h)
        return np.random.randn(768).tolist()
        
    try:
        response = client.models.embed_content(
            model="text-embedding-004",
            contents=text
        )
        return response.embeddings[0].values
    except Exception as e:
        print(f"[RAG] Error calling Google GenAI embeddings API: {e}")
        # Pseudo-random fallback
        h = hash(text) % 1000
        np.random.seed(h)
        return np.random.randn(768).tolist()

def index_policy(policy_id: str, title: str, content: str):
    """Chunks and indexes policy into the vector database."""
    global _vector_db
    print(f"[RAG] Indexing policy '{title}' (ID: {policy_id})")
    
    # Remove existing chunks for this policy if any (to support updates)
    _vector_db = [chunk for chunk in _vector_db if chunk["policy_id"] != policy_id]
    
    chunks = split_into_chunks(content)
    for idx, chunk_text in enumerate(chunks):
        embedding = get_embedding(chunk_text)
        _vector_db.append({
            "policy_id": policy_id,
            "title": title,
            "chunk_index": idx,
            "text": chunk_text,
            "embedding": embedding
        })
    print(f"[RAG] Successfully indexed {len(chunks)} chunks for policy '{title}'.")

def search_rag(query: str, limit: int = 3) -> List[Dict[str, Any]]:
    """Calculates query embedding and returns top matching chunks using Cosine Similarity."""
    global _vector_db
    
    # Ensure vector store is populated from DB if empty
    if not _vector_db:
        print("[RAG] Vector store empty. Syncing from database policies...")
        db = SessionLocal()
        try:
            policies = db.query(Policy).all()
            for p in policies:
                index_policy(p.id, p.title, p.content)
        except Exception as e:
            print(f"[RAG] Sync from DB failed: {e}")
        finally:
            db.close()
            
    if not _vector_db:
        print("[RAG] No policies currently indexed.")
        return []
        
    query_emb = get_embedding(query)
    results = []
    
    for chunk in _vector_db:
        sim = cosine_similarity(query_emb, chunk["embedding"])
        results.append({
            "policy_id": chunk["policy_id"],
            "title": chunk["title"],
            "chunk_index": chunk["chunk_index"],
            "text": chunk["text"],
            "score": sim
        })
        
    # Sort descending by similarity score
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:limit]
