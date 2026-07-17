import time
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from agents import get_agent_instance

router = APIRouter()

MOCK_MONITORED_SOURCES = [
    {"source": "RBI (Reserve Bank of India)", "type": "Circulars & Guidelines", "frequency": "Every 2 hours", "status": "ACTIVE", "last_checked": "10 mins ago"},
    {"source": "SEBI (Securities and Exchange Board of India)", "type": "Consultations & Circulars", "frequency": "Every 3 hours", "status": "ACTIVE", "last_checked": "35 mins ago"},
    {"source": "MCA (Ministry of Corporate Affairs)", "type": "Gazette Notifications", "frequency": "Every 6 hours", "status": "ACTIVE", "last_checked": "1 hour ago"},
    {"source": "GST Council & CBDT", "type": "Tax Amendments", "frequency": "Every 12 hours", "status": "ACTIVE", "last_checked": "2 hours ago"}
]

MOCK_RUN_LOGS = [
    {"time": "2026-07-17 12:45:00", "source": "SEBI", "status": "SUCCESS", "event": "Checked consultations feed. No changes found."},
    {"time": "2026-07-17 12:00:00", "source": "RBI", "status": "UPDATED", "event": "Detected new Consent Manager amendment. Initiated Document Ingestion & Compliance Twin mapping."},
    {"time": "2026-07-17 11:30:00", "source": "MCA", "status": "SUCCESS", "event": "Checked registries. Deduplicated 3 files."}
]

@router.get("/sources")
async def get_sources():
    return MOCK_MONITORED_SOURCES

@router.get("/logs")
async def get_logs():
    return MOCK_RUN_LOGS

@router.post("/run")
async def run_monitoring():
    mon_agent = get_agent_instance("monitoring_agent")
    if not mon_agent:
        raise HTTPException(status_code=500, detail="MonitoringAgent not available.")
        
    try:
        state = {}
        result = mon_agent.process(state)
        
        # Append run log
        log_entry = {
            "time": "Just now",
            "source": "Manual Trigger",
            "status": "SUCCESS",
            "event": f"Active scan of regulatory indexes completed. Found {result.get('new_notifications_found', 0)} circular updates."
        }
        MOCK_RUN_LOGS.insert(0, log_entry)
        
        return {
            "status": "success",
            "monitored_sources": result.get("monitored_sources", []),
            "last_checked": result.get("last_checked", ""),
            "new_notifications": result.get("new_notifications_found", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scanning error: {str(e)}")
