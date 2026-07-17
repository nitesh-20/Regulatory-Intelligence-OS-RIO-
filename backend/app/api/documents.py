import time
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from agents import get_agent_instance

router = APIRouter()

# Global memory simulation store for uploaded documents
MOCK_INDEXED_POLICIES = [
    {"name": "Corporate Privacy Policy v1.4.pdf", "size": "2.4 MB", "uploaded": "2 days ago", "status": "SYNCHRONIZED", "chunks": 142},
    {"name": "Database & Data Security controls.md", "size": "18 KB", "uploaded": "3 days ago", "status": "SYNCHRONIZED", "chunks": 24}
]

@router.get("/")
async def get_documents():
    return MOCK_INDEXED_POLICIES

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    category: str = Form("General")
):
    doc_agent = get_agent_instance("document_agent")
    if not doc_agent:
        raise HTTPException(status_code=500, detail="DocumentAgent not available.")
        
    try:
        # Run document parsing pipeline
        state = {"document_path": file.filename}
        result = doc_agent.process(state)
        
        # Append to memory database
        new_doc = {
            "name": file.filename,
            "size": f"{round(file.size / 1024, 1)} KB" if file.size else "150 KB",
            "uploaded": "Just now",
            "status": "SYNCHRONIZED",
            "chunks": 42
        }
        MOCK_INDEXED_POLICIES.append(new_doc)
        
        return {
            "status": "success",
            "document": new_doc,
            "entities": result.get("extracted_entities", []),
            "metadata": result.get("metadata", {}),
            "markdown": result.get("cleaned_markdown", "")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")
