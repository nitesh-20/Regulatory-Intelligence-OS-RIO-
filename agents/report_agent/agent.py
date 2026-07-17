from agents.base import BaseAgent
from typing import Dict, Any, List

class ReportAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ReportAgent",
            system_prompt="You are an executive compliance reporter. Construct weekly, monthly, and event-based summaries."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        print(f"[{self.name}] Compiling executive compliance briefing...")
        
        goal = state.get("goal", "Generate an enterprise compliance report.")
        
        prompt = (
            f"You are a McKinsey/Bain compliance consultant. Generate a highly professional executive report for the following context:\n"
            f"Goal: {goal}\n"
            f"Risk Score: {state.get('risk_score', 'N/A')}\n"
            f"Gaps Found: {len(state.get('gaps_found', []))}\n\n"
            f"You MUST format the report exactly with these sections (using Markdown headers):\n"
            f"### Executive Summary\n"
            f"### Findings\n"
            f"### Business Impact\n"
            f"### Risk Analysis\n"
            f"### Recommendations\n"
            f"### Action Plan\n"
            f"### Appendix\n"
        )
        
        report_text = self.call_llm(prompt)
        
        state["generated_report_markdown"] = report_text
        state["status_report_agent"] = "SUCCESS"
        return state
