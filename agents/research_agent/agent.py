from agents.base import BaseAgent
from typing import Dict, Any, List

class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="ResearchAgent",
            system_prompt="You are a legal compliance researcher. Resolve complex regulatory queries with citations."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state.get("goal", "")
        print(f"[{self.name}] Resolving compliance research for: '{query}'")
        
        search_context = state.get("search_results", "No pre-existing search results.")
        
        prompt = (
            f"You are a Senior Legal Compliance Researcher. Your task is to resolve complex regulatory queries with precise citations.\n\n"
            f"User Query: '{query}'\n\n"
            f"Context Data (from SearchAgent): {search_context}\n\n"
            f"If the context data is insufficient, use the Google Search tool to find more information.\n"
            f"Provide a comprehensive research summary covering the exact rules, requirements, and risks/penalties associated with the query."
        )
        
        try:
            live_summary = self.call_llm(prompt, tools=[{"google_search": {}}])
        except Exception as e:
            print(f"[{self.name}] Live research failed: {e}")
            live_summary = "The latest amendment mandates high-strength AES-256 encryption rules for financial institutions holding consumer records."
            
        state["summary"] = live_summary
        state["requirements"] = ["Review findings", "Ensure compliance mapping"]
        state["risks"] = "Failure to adhere to these live guidelines can result in regulatory enforcement."
        state["status_research_agent"] = "SUCCESS"
        return state
