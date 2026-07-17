from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from pydantic import BaseModel
from app.schemas.schemas import RegulationCreate, RegulationResponse, WatchlistCreate, ComplianceGapResponse
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from agents import get_agent_instance

router = APIRouter()

# In-memory storage mock for regulations and watchlists
MOCK_REGULATIONS = [
    {
        "id": "1",
        "title": "DPDP Data Consent Architecture Framework",
        "authority": "RBI / MEITY",
        "country_code": "IN",
        "category": "Privacy",
        "source_url": "https://meity.gov.in/dpdp",
        "severity": "HIGH",
        "summary": "Framework laying down operational parameters for consent managers handling digital personal data."
    },
    {
        "id": "2",
        "title": "FTC Safeguards Rule on Consumer Data Security",
        "authority": "FTC",
        "country_code": "US",
        "category": "Cybersecurity",
        "source_url": "https://ftc.gov/safeguards",
        "severity": "CRITICAL",
        "summary": "Amended rule adding notification rules for security events affecting 500+ consumers."
    }
]

MOCK_WATCHLISTS = [
    {
        "id": "w1",
        "name": "Global Data Privacy Laws",
        "categories": ["Privacy"],
        "countries": ["IN", "EU", "US"],
        "active": True
    }
]

class CompareRequest(BaseModel):
    old_text: str
    new_text: str

# --- Health check ---
@router.get("/health", tags=["System"])
async def health_check():
    # Perform quick checks to verify agent pipeline connectivity
    planner = get_agent_instance("planner_agent")
    agent_status = "connected" if planner is not None else "disconnected"
    return {
        "status": "healthy",
        "database": "connected",
        "vector_store": "connected",
        "cache": "connected",
        "agent_system": agent_status
    }

# --- Regulations Catalog ---
@router.get("/regulations", response_model=List[Dict[str, Any]], tags=["Regulations"])
async def get_regulations():
    return MOCK_REGULATIONS

@router.post("/regulations", response_model=Dict[str, Any], tags=["Regulations"])
async def create_regulation(reg: RegulationCreate):
    new_reg = {
        "id": str(len(MOCK_REGULATIONS) + 1),
        "title": reg.title,
        "authority": reg.authority,
        "country_code": reg.country_code,
        "category": reg.category,
        "source_url": reg.source_url,
        "severity": "MEDIUM",
        "summary": "Auto-scaffolded regulation stub."
    }
    MOCK_REGULATIONS.append(new_reg)
    return new_reg

# --- Watchlists ---
@router.get("/watchlists", response_model=List[Dict[str, Any]], tags=["Watchlists"])
async def get_watchlists():
    return MOCK_WATCHLISTS

@router.post("/watchlists", response_model=Dict[str, Any], tags=["Watchlists"])
async def create_watchlist(watchlist: WatchlistCreate):
    new_wl = {
        "id": f"w{len(MOCK_WATCHLISTS) + 1}",
        "name": watchlist.name,
        "categories": watchlist.categories,
        "countries": watchlist.countries,
        "active": True
    }
    MOCK_WATCHLISTS.append(new_wl)
    return new_wl

# --- Compliance Twin Gaps ---
@router.get("/compliance/gaps", response_model=List[ComplianceGapResponse], tags=["Compliance Twin"])
async def get_compliance_gaps():
    comp_agent = get_agent_instance("compliance_agent")
    if not comp_agent:
        raise HTTPException(status_code=500, detail="ComplianceAgent not available.")
        
    try:
        state = {}
        result = comp_agent.process(state)
        gaps = result.get("gaps_found", [])
        
        # Map state gaps to schema
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Document Version Comparison ---
@router.post("/comparison/compare", tags=["Comparison"])
async def compare_documents(req: CompareRequest):
    comp_agent = get_agent_instance("comparison_agent")
    if not comp_agent:
        raise HTTPException(status_code=500, detail="ComparisonAgent not available.")
        
    try:
        state = {"old_text": req.old_text, "new_text": req.new_text}
        result = comp_agent.process(state)
        return {
            "status": "success",
            "diff_results": result.get("diff_results", {})
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
