from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from app.schemas.schemas import RegulationCreate, RegulationResponse, WatchlistCreate, ComplianceGapResponse

router = APIRouter()

# In-memory storage mock for startup scaffolding
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

MOCK_GAPS = [
    {
        "id": "g1",
        "regulation_id": "2",
        "policy_id": "p2",
        "gap_description": "Database Encryption Key Strength: Policy mandates AES-128, SEC Rule 12 requires AES-256.",
        "severity": "CRITICAL",
        "status": "OPEN",
        "remediation_plan": "Migrate database clusters and configuration credentials to use AES-256 keys."
    }
]

# --- Health check ---
@router.get("/health", tags=["System"])
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "vector_store": "connected",
        "cache": "connected"
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

# --- Compliance Twin & Gaps ---
@router.get("/compliance/gaps", response_model=List[ComplianceGapResponse], tags=["Compliance Twin"])
async def get_compliance_gaps():
    return MOCK_GAPS
