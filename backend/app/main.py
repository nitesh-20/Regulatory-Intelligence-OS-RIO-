import os
import sys
# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware

# Ensure the parent folders are in the python path to load the multi-agent system correctly
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.api.endpoints import router as api_router
from app.api.planner import router as planner_router
from app.api.documents import router as documents_router
from app.api.monitoring import router as monitoring_router
from app.api.reports import router as reports_router

app = FastAPI(
    title="RIO (Regulatory Intelligence Operating System) API",
    description="Enterprise Multi-Agent Regulatory intelligence & Compliance OS Backend Gateway",
    version="2.0.0"
)

@app.on_event("startup")
def startup_event():
    print("[API] Initiating startup database migration and seeding verification...")
    try:
        from app.database.seed import seed_database
        seed_database()
    except Exception as e:
        print(f"[API] Startup seeding failed: {e}")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(api_router, prefix="/api/v1")
app.include_router(planner_router, prefix="/api/v1/planner", tags=["Planner"])
app.include_router(documents_router, prefix="/api/v1/documents", tags=["Documents"])
app.include_router(monitoring_router, prefix="/api/v1/monitoring", tags=["Monitoring"])
app.include_router(reports_router, prefix="/api/v1/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to RIO (Regulatory Intelligence Operating System) API Gateway",
        "docs_url": "/docs",
        "status": "active"
    }
