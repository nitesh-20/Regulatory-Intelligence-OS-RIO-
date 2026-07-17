import json
from agents.base import BaseAgent
from typing import Dict, Any, List
from app.database.models import ComplianceTask

class RiskAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="RiskAgent",
            system_prompt=(
                "You are an expert compliance risk assessment officer. Calculate risk exposure scores "
                "and evaluate potential corporate consequences of compliance discrepancies."
            )
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Dynamically computes a risk score and compiles consequences using Gemini,
        by querying actual active open compliance tasks in the database.
        """
        print(f"[{self.name}] Initiating dynamic risk exposure calculations...")
        
        db = state.get("db")
        org_id = state.get("organization_id")
        
        open_tasks = []
        if db and org_id:
            try:
                open_tasks = db.query(ComplianceTask).filter(
                    ComplianceTask.organization_id == org_id,
                    ComplianceTask.status == "open"
                ).all()
            except Exception as e:
                print(f"[{self.name}] Error loading tasks from DB: {e}")
                
        # If database is offline or empty, use state gaps
        if not open_tasks:
            gaps = state.get("gaps_found", [])
            # Map state gaps to look like DB models
            class MockTask:
                def __init__(self, title, description, severity):
                    self.title = title
                    self.description = description
                    self.severity = severity
            open_tasks = [MockTask(g["clause"], g["gap_details"], g["severity"]) for g in gaps]
            
        # 1. Base Score calculation
        base_score = 15
        severity_map = {
            "CRITICAL": 35,
            "HIGH": 20,
            "MEDIUM": 10,
            "LOW": 5
        }
        
        total_risk = base_score
        for task in open_tasks:
            total_risk += severity_map.get(task.severity.upper(), 10)
            
        final_score = min(100, max(0, total_risk))
        print(f"[{self.name}] Calculated Risk Exposure Score: {final_score}/100 based on {len(open_tasks)} open issues.")

        # 2. Use Gemini to draft Consequences and Affected Teams
        task_summaries = []
        for idx, t in enumerate(open_tasks):
            task_summaries.append(f"{idx+1}. Requirement: {t.title} (Severity: {t.severity})\nDiscrepancy: {t.description}")
            
        tasks_text = "\n\n".join(task_summaries) if task_summaries else "No active compliance discrepancies."

        prompt = (
            f"You are a corporate risk analyst. Review this list of compliance gaps at a Fintech firm:\n\n"
            f"Gaps:\n{tasks_text}\n\n"
            f"Analyze this and return a JSON object with:\n"
            f"1. \"risk_consequences\": A 1-2 sentence executive assessment of the financial, legal, and operational penalties.\n"
            f"2. \"affected_teams\": List of corporate departments affected (e.g., DevOps, Security, Compliance, Engineering, Legal).\n"
            f"Do not include markdown tags like ```json, return raw JSON string only."
        )

        consequences = "Potential audit failures leading to general warning flags."
        affected_teams = ["Compliance"]

        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            raw_text = response.text.strip()
            if raw_text.startswith("```"):
                lines = raw_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()
                
            parsed = json.loads(raw_text)
            consequences = parsed.get("risk_consequences", consequences)
            affected_teams = parsed.get("affected_teams", affected_teams)
        except Exception as e:
            print(f"[{self.name}] Gemini risk assessment failed: {e}")
            if open_tasks:
                consequences = "Potential regulator warnings leading to compliance reviews or minor penalties."
                affected_teams = ["Engineering", "Legal", "Security"]

        state["risk_score"] = final_score
        state["affected_teams"] = affected_teams
        state["risk_consequences"] = consequences
        state["status_risk_agent"] = "SUCCESS"
        return state
