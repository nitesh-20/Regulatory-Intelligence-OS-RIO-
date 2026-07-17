from agents.base import BaseAgent
from typing import Dict, Any, List

class RiskAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RiskAgent",
            system_prompt="You are a compliance risk assessment officer. Calculate risk exposure scores and affected teams."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Conducting compliance impact risk analysis...")
        
        # Calculate scores
        gaps = state.get("gaps_found", [])
        risk_score = 45 + (len(gaps) * 15)
        risk_score = min(100, max(0, risk_score))
        
        state["risk_score"] = risk_score
        state["affected_teams"] = ["DevOps", "Legal", "Information Security"]
        state["risk_consequences"] = "Potential SEC audit failures leading to fines up to $500,000 or license revocation."
        state["status_risk_agent"] = "SUCCESS"
        return state
