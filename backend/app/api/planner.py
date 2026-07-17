import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, List
import sys
import os

# Ensure shared folders are in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..")))
from agents import get_agent_instance

router = APIRouter()

class PlanRequest(BaseModel):
    goal: str

@router.post("/execute")
async def execute_plan(req: PlanRequest):
    planner = get_agent_instance("planner_agent")
    if not planner:
        raise HTTPException(status_code=500, detail="Failed to load PlannerAgent instance.")
        
    try:
        # Run agent reasoning chain
        initial_state = {"goal": req.goal}
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
        raise HTTPException(status_code=500, detail=f"Execution error: {str(e)}")
