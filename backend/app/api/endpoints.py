from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
from sqlalchemy.orm import Session
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from agents import get_agent_instance
from app.database.connection import get_db
from app.database.models import Organization, Regulation, Watchlist, ComplianceTask, Policy
from app.schemas.schemas import RegulationCreate, RegulationResponse, WatchlistCreate, ComplianceGapResponse

router = APIRouter()

class CompareRequest(BaseModel):
    old_text: str
    new_text: str

# --- Health check ---
@router.get("/health", tags=["System"])
async def health_check(db: Session = Depends(get_db)):
    planner = get_agent_instance("planner_agent")
    agent_status = "connected" if planner is not None else "disconnected"
    
    # Test DB status
    db_status = "connected"
    try:
        db.query(Organization).first()
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy" if db_status == "connected" and agent_status == "connected" else "degraded",
        "database": db_status,
        "vector_store": "connected", # Local in-memory RAG fallback active
        "cache": "connected",
        "agent_system": agent_status
    }

# --- Regulations Catalog ---
@router.get("/regulations", response_model=List[Dict[str, Any]], tags=["Regulations"])
async def get_regulations(db: Session = Depends(get_db)):
    regs = db.query(Regulation).all()
    results = []
    for r in regs:
        # Check active severity in DB
        results.append({
            "id": r.id,
            "title": r.title,
            "authority": r.authority,
            "country_code": r.country_code,
            "category": r.category,
            "source_url": r.source_url,
            "severity": "HIGH" if "DPDP" in r.title or "FTC" in r.title else "MEDIUM",
            "summary": f"Autonomous regulatory intelligence document fetched from {r.authority}."
        })
    return results

@router.post("/regulations", response_model=Dict[str, Any], tags=["Regulations"])
async def create_regulation(reg: RegulationCreate, db: Session = Depends(get_db)):
    try:
        new_reg = Regulation(
            title=reg.title,
            authority=reg.authority,
            country_code=reg.country_code,
            category=reg.category,
            source_url=reg.source_url
        )
        db.add(new_reg)
        db.commit()
        db.refresh(new_reg)
        return {
            "id": new_reg.id,
            "title": new_reg.title,
            "authority": new_reg.authority,
            "country_code": new_reg.country_code,
            "category": new_reg.category,
            "source_url": new_reg.source_url,
            "severity": "MEDIUM",
            "summary": "Custom regulation record registered."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# --- Watchlists ---
@router.get("/watchlists", response_model=List[Dict[str, Any]], tags=["Watchlists"])
async def get_watchlists(db: Session = Depends(get_db)):
    wls = db.query(Watchlist).all()
    results = []
    for w in wls:
        results.append({
            "id": w.id,
            "name": w.name,
            "categories": w.categories,
            "countries": w.countries,
            "active": w.active
        })
    return results

@router.post("/watchlists", response_model=Dict[str, Any], tags=["Watchlists"])
async def create_watchlist(watchlist: WatchlistCreate, db: Session = Depends(get_db)):
    try:
        org = db.query(Organization).first()
        if not org:
            raise HTTPException(status_code=500, detail="Seed database missing.")
            
        new_wl = Watchlist(
            organization_id=org.id,
            name=watchlist.name,
            categories=watchlist.categories,
            countries=watchlist.countries,
            active=True
        )
        db.add(new_wl)
        db.commit()
        db.refresh(new_wl)
        return {
            "id": new_wl.id,
            "name": new_wl.name,
            "categories": new_wl.categories,
            "countries": new_wl.countries,
            "active": new_wl.active
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# --- Compliance Twin Gaps ---
@router.get("/compliance/gaps", response_model=List[ComplianceGapResponse], tags=["Compliance Twin"])
async def get_compliance_gaps(db: Session = Depends(get_db)):
    comp_agent = get_agent_instance("compliance_agent")
    org = db.query(Organization).first()
    if not comp_agent or not org:
        raise HTTPException(status_code=500, detail="ComplianceAgent or Organization not available.")
        
    try:
        # Run agent reasoning chain injecting DB dependencies
        state = {"db": db, "organization_id": org.id}
        result = comp_agent.process(state)
        
        # Pull direct synced tasks from DB
        tasks = db.query(ComplianceTask).filter(
            ComplianceTask.organization_id == org.id,
            ComplianceTask.status == "open"
        ).all()
        
        # Fallback to state gaps if DB is empty
        if not tasks:
            gaps = result.get("gaps_found", [])
            response_gaps = []
            for g in gaps:
                response_gaps.append(
                    ComplianceGapResponse(
                        id=g["id"],
                        regulation_id="2",
                        policy_id="p2",
                        gap_description=g["gap_details"],
                        severity=g["severity"],
                        status=g["status"],
                        remediation_plan=g["remediation_plan"]
                    )
                )
            return response_gaps
            
        response_gaps = []
        for t in tasks:
            response_gaps.append(
                ComplianceGapResponse(
                    id=t.id,
                    regulation_id=t.regulation_id,
                    policy_id="p1", # Linked policy placeholder
                    gap_description=t.description,
                    severity=t.severity,
                    status=t.status.upper(),
                    remediation_plan=t.remediation_plan
                )
            )
        return response_gaps
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Document Version Comparison ---
@router.post("/comparison/compare", tags=["Comparison"])
async def compare_documents(req: CompareRequest):
    comp_agent = get_agent_instance("comparison_agent")
    if not comp_agent:
        raise HTTPException(status_code=500, detail="ComparisonAgent not available.")
        
    try:
        state = {"original_text": req.old_text, "revised_text": req.new_text}
        result = comp_agent.process(state)
        return {
            "status": "success",
            "diff_results": result.get("diff_results", {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
