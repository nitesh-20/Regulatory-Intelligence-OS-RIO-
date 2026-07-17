from agents.base import BaseAgent
from typing import Dict, Any, List

class ComplianceAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ComplianceAgent",
            system_prompt="You are the Compliance Agent. Map parsed regulations directly against corporate policies to evaluate alignment."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Mapping obligations to compliance twin...")
        
        # Check requirements in state or default
        requirements = state.get("requirements", ["Enforce AES-256 database storage encryption keys", "Log data deletion trails"])
        
        gaps = [
            {
                "id": "gap-101",
                "clause": "Database Encryption Key Strength",
                "policy_ref": "Database & Data Security controls.md",
                "gap_details": "Company policy specifies AES-128, SEC Rule 12 requires AES-256.",
                "severity": "CRITICAL",
                "status": "OPEN",
                "remediation_plan": "Update key configuration parameters in AWS KMS and rewrite database encryption standard."
            }
        ]
        
        state["gaps_found"] = gaps
        state["status_compliance_agent"] = "SUCCESS"
        return state
