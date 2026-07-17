from typing import List, Dict, Any

def get_planner_tools() -> List[Dict[str, Any]]:
    """
    Returns the list of tools available to the Planner Agent.
    """
    return [
        {
            "name": "delegate_to_agent",
            "description": "Delegates a specific sub-goal to a downstream specialized compliance agent.",
            "parameters": {
                "type": "object",
                "properties": {
                    "agent_name": {"type": "string", "description": "Name of the agent to spawn"},
                    "task": {"type": "string", "description": "Specific instruction for the sub-agent"}
                },
                "required": ["agent_name", "task"]
            }
        },
        {
            "name": "aggregate_results",
            "description": "Combines compliance verdicts, risk scores, and checklists into a unified report.",
            "parameters": {
                "type": "object",
                "properties": {
                    "verdicts": {"type": "array", "items": {"type": "string"}}
                }
            }
        }
    ]
