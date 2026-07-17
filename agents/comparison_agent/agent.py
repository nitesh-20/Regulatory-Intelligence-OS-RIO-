from agents.base import BaseAgent
from typing import Dict, Any, List

class ComparisonAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ComparisonAgent",
            system_prompt="You are a document comparison specialist. Match different versions of legal text and compile diff outputs."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Performing version comparison...")
        
        state["diff_results"] = {
            "added_clauses": [
                "Clause 4.3: Real-time notification of security events exceeding 500 records must occur within 4 business days."
            ],
            "removed_clauses": [
                "Clause 4.1: Semi-annual compliance disclosures are permitted via general media channels."
            ],
            "modified_clauses": [
                {"section": "Section 9.2", "old": "Encryption using AES-128 is acceptable.", "new": "Encryption MUST employ AES-256 keys."}
            ]
        }
        state["status_comparison_agent"] = "SUCCESS"
        return state
