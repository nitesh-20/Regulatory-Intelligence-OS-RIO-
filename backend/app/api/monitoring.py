import datetime
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from agents import get_agent_instance
from app.database.connection import get_db
from app.database.models import Regulation, RegulationVersion, Organization

router = APIRouter()

@router.get("/sources")
async def get_sources(db: Session = Depends(get_db)):
    try:
        # Generate sources dynamically based on authority catalog in database
        regs = db.query(Regulation).all()
        authorities = {}
        for r in regs:
            if r.authority not in authorities:
                authorities[r.authority] = {
                    "source": f"{r.authority} ({r.country_code})",
                    "type": f"{r.category} Regulatory Guidelines",
                    "frequency": "Every 4 hours",
                    "status": "ACTIVE",
                    "last_checked": "Checked just now"
                }
        
        # Default fallbacks if no database records
        if not authorities:
            return [
                {"source": "RBI (Reserve Bank of India)", "type": "Circulars & Guidelines", "frequency": "Every 2 hours", "status": "ACTIVE", "last_checked": "10 mins ago"},
                {"source": "SEBI (Securities and Exchange Board of India)", "type": "Consultations & Circulars", "frequency": "Every 3 hours", "status": "ACTIVE", "last_checked": "35 mins ago"}
            ]
            
        return list(authorities.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/logs")
async def get_logs(db: Session = Depends(get_db)):
    try:
        # Load logs from actual regulation version updates in DB
        versions = db.query(RegulationVersion).join(Regulation).order_by(RegulationVersion.created_at.desc()).all()
        results = []
        for v in versions:
            results.append({
                "time": v.created_at.strftime("%Y-%m-%d %H:%M:%S") if v.created_at else "Just now",
                "source": v.regulation.authority,
                "status": "UPDATED" if v.is_active else "SUCCESS",
                "event": f"Version {v.version_tag} commit: {v.commit_summary}"
            })
            
        # Fallback default logs if empty
        if not results:
            return [
                {"time": "2026-07-17 12:45:00", "source": "SEBI", "status": "SUCCESS", "event": "Checked consultations feed. No changes found."},
                {"time": "2026-07-17 12:00:00", "source": "RBI", "status": "UPDATED", "event": "Detected new Consent Manager amendment. Initiated Document Ingestion."}
            ]
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.api_route("/run", methods=["GET", "POST"])
async def run_monitoring(db: Session = Depends(get_db)):
    mon_agent = get_agent_instance("monitoring_agent")
    org = db.query(Organization).first()
    if not org:
        from app.database.seed import seed_database
        seed_database()
        org = db.query(Organization).first()
    if not mon_agent or not org:
        raise HTTPException(status_code=500, detail="MonitoringAgent or Organization not available.")
        
    try:
        state = {"db": db, "organization_id": org.id}
        result = mon_agent.process(state)
        
        return {
            "status": "success",
            "monitored_sources": result.get("monitored_sources", []),
            "last_checked": result.get("last_checked", ""),
            "new_notifications": result.get("new_notifications_found", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scanning error: {str(e)}")
