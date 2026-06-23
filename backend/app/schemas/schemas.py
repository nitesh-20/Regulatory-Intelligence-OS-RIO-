from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class RegulationCreate(BaseModel):
    title: str
    authority: str
    country_code: str
    category: str
    source_url: str

class RegulationResponse(BaseModel):
    id: str
    title: str
    authority: str
    country_code: str
    category: str
    source_url: str
    severity: str
    summary: str

    class Config:
        from_attributes = True

class WatchlistCreate(BaseModel):
    name: str
    categories: List[str]
    countries: List[str]

class ComplianceGapResponse(BaseModel):
    id: str
    regulation_id: str
    policy_id: Optional[str] = None
    gap_description: str
    severity: str
    status: str
    remediation_plan: Optional[str] = None

    class Config:
        from_attributes = True
