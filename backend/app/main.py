import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router

app = FastAPI(
    title="RIO Agent API",
    description="Regulatory Intelligence Operating System API - Starter Architecture",
    version="1.0.0"
)

# CORS Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Welcome to RIO Agent API Portal",
        "docs_url": "/docs",
        "status": "active"
    }
