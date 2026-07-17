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
        print(f"[{self.name}] Searching sources for: '{query}'")
        
        # Simulate Tavily/Google Search
        results = [
            {
                "title": "SEBI Consultation Paper on Algorithmic Trading",
                "url": "https://sebi.gov.in/consultation/algo-trading-2026",
                "snippet": "New guidelines require real-time risk check limits on institutional algorithmic trade logs."
            }
        ]
        
        state["search_results"] = results
        state["status_search_agent"] = "SUCCESS"
        return state
