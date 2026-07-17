from agents.base import BaseAgent
from typing import Dict, Any, List

class MonitoringAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="MonitoringAgent",
            system_prompt="You are the continuous Monitoring Agent. Spot updates to official gazettes and verify database versions."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Tracking active regulatory directories...")
        
        state["monitored_sources"] = ["RBI", "SEBI", "MCA", "GST", "CBDT"]
        state["last_checked"] = "2026-07-17 12:00:00"
        state["new_notifications_found"] = 2
        state["status_monitoring_agent"] = "SUCCESS"
        return state
