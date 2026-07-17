import time
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from sqlalchemy.orm import Session
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from agents import get_agent_instance
from app.database.connection import get_db
from app.database.models import Organization, Policy
from app.core.rag import index_policy

router = APIRouter()

@router.get("/")
async def get_documents(db: Session = Depends(get_db)):
    try:
        policies = db.query(Policy).all()
        results = []
        for p in policies:
            # Format realistic sizes and chunk estimations
            size_kb = max(1, len(p.content) // 1024)
            chunks = max(1, len(p.content) // 500)
            results.append({
                "id": p.id,
                "name": p.title,
                "size": f"{size_kb} KB",
                "uploaded": "Activated via Seed" if p.version_tag == "1.4.0" or p.version_tag == "1.0.0" else "Just now",
                "status": "SYNCHRONIZED",
                "chunks": chunks
            })
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("General"),
    db: Session = Depends(get_db)
):
    doc_agent = get_agent_instance("document_agent")
    if not doc_agent:
        raise HTTPException(status_code=500, detail="DocumentAgent not available.")
        
    try:
        org = db.query(Organization).first()
        if not org:
            from app.database.seed import seed_database
            seed_database()
            org = db.query(Organization).first()
        if not org:
            raise HTTPException(status_code=500, detail="Organization not seeded.")

        # Read actual bytes from upload stream
        file_bytes = await file.read()
        
        # Run document agent parsing and DB save
        state = {
            "file_content": file_bytes,
            "file_name": file.filename,
            "organization_id": org.id,
            "db": db
        }
        result = doc_agent.process(state)
        
        policy_id = result.get("policy_id")
        policy_title = result.get("policy_title", file.filename)
        cleaned_markdown = result.get("cleaned_markdown", "")
        
        # Add to RAG vector database indexing
        if policy_id and cleaned_markdown:
            index_policy(policy_id, policy_title, cleaned_markdown)

        new_doc = {
            "id": policy_id,
            "name": policy_title,
            "size": f"{round(len(file_bytes) / 1024, 1)} KB",
            "uploaded": "Just now",
            "status": "SYNCHRONIZED",
            "chunks": max(1, len(cleaned_markdown) // 500)
        }
        
        return {
            "status": "success",
            "document": new_doc,
            "entities": result.get("extracted_entities", []),
            "metadata": result.get("metadata", {}),
            "markdown": cleaned_markdown
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")
