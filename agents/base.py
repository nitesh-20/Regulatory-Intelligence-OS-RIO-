import os
from typing import Dict, Any, List

class BaseAgent:
    """
    Base abstraction for RIO Agent multi-agent network.
    Integrates Gemini LLM clients, memory state, and vector retrieval hooks.
    """
    def __init__(
        self, 
        name: str, 
        system_prompt: str,
        gemini_api_key: str = None
    ):
        self.name = name
        self.system_prompt = system_prompt
        self.api_key = gemini_api_key or os.getenv("GEMINI_API_KEY")
        
        # Initialize LLM Client
        self.client = None
        if self.api_key:
            # Placeholder for Google GenAI SDK client
            # self.client = genai.Client(api_key=self.api_key)
            pass

    def retrieve_context(self, query: str, collection: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Mock Vector retrieval helper from Qdrant vector database.
        """
        print(f"[{self.name}] Querying Qdrant collection '{collection}' for: {query[:40]}...")
        return [{"score": 0.89, "payload": {"text": "Retrieved regulation or policy text block."}}]

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute core agent logical reasoning. Override this in child classes.
        """
        print(f"[{self.name}] Running reasoning logic...")
        return state
