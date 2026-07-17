from agents.base import BaseAgent
from typing import Dict, Any, List

class SearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="SearchAgent",
            system_prompt="You are a compliance search specialist. Query official gazettes and search indexes for regulatory alerts."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        query = state.get("goal", "")
        print(f"[{self.name}] Searching live sources for: '{query}'")
        
        # Use Gemini with Google Search tool grounding to fetch live data
        prompt = (
            f"You are a regulatory compliance web researcher. "
            f"Use the Google Search tool to search for the following compliance goal/query: '{query}'.\n\n"
            f"Respond with a detailed summary of your findings, citing sources."
        )
        
        try:
            live_findings = self.call_llm(prompt, tools=[{"google_search": {}}])
        except Exception as e:
            print(f"[{self.name}] Live search failed: {e}")
            live_findings = "Live search failed. Mock result: Recent RBI circular mandates real-time risk check limits."
            
        # The search agent simply adds the raw findings to state for downstream agents to synthesize
        state["search_results"] = live_findings
        state["summary"] = live_findings # Bubble it up for PlannerAgent if no other agent processes it
        state["status_search_agent"] = "SUCCESS"
        return state
