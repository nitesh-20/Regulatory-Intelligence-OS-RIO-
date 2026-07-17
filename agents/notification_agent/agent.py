from agents.base import BaseAgent
from typing import Dict, Any, List

class NotificationAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="NotificationAgent",
            system_prompt="You are an alert notification router. Dispatch warnings across Slack, email, and Webhooks."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Emitting notifications to connected systems...")
        state["notifications_sent"] = ["Slack (#compliance-alerts)", "Email (CISO List)", "Discord Gateway"]
        state["status_notification_agent"] = "SUCCESS"
        return state
