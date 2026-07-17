from typing import Dict, Any, List

class PlannerMemory:
    """
    Manages session and execution plan memory state for RIO Planner.
    """
    def __init__(self):
        self.history: List[Dict[str, Any]] = []
        self.session_variables: Dict[str, Any] = {}

    def log_step(self, step_name: str, input_data: Any, output_data: Any):
        self.history.append({
            "step": step_name,
            "input": input_data,
            "output": output_data
        })

    def get_history(self) -> List[Dict[str, Any]]:
        return self.history

    def clear(self):
        self.history.clear()
        self.session_variables.clear()
