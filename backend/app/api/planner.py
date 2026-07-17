import time
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List
from sqlalchemy.orm import Session
import sys
import os

# Ensure shared folders are in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from agents import get_agent_instance
from app.database.connection import get_db
from app.database.models import Organization

router = APIRouter()

class PlanRequest(BaseModel):
    goal: str

@router.post("/execute")
async def execute_plan(req: PlanRequest, db: Session = Depends(get_db)):
    planner = get_agent_instance("planner_agent")
    if not planner:
        raise HTTPException(status_code=500, detail="Failed to load PlannerAgent instance.")
        
    try:
        # Fetch the active organization (Fintech Sandbox Org seeded earlier)
        org = db.query(Organization).first()
        if not org:
            raise HTTPException(status_code=500, detail="Database has not been initialized or seeded.")

        # Inject DB session and organization ID for real agent execution
        initial_state = {
            "goal": req.goal,
            "db": db,
            "organization_id": org.id
        }
        
        result_state = planner.process(initial_state)
        return {
            "status": "success",
            "goal": req.goal,
            "planner_decisions": result_state.get("planner_decisions", {}),
            "execution_graph": result_state.get("execution_graph", {}),
            "agent_chain": result_state.get("agent_chain", []),
            "steps": result_state.get("steps", []),
            "final_response": result_state.get("final_response", ""),
            "time_taken": result_state.get("time_taken", 0.0),
            "tokens": result_state.get("tokens", 0)
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Execution error: {str(e)}")
