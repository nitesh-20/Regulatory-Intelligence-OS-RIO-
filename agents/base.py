import os
import time
from typing import Dict, Any, List
# pyrefly: ignore [missing-import]
from google import genai
# pyrefly: ignore [missing-import]
from google.genai.errors import APIError

class BaseAgent:
    """
    Base abstraction for RIO Agent multi-agent network.
    Integrates Gemini LLM clients using the official google-genai SDK,
    local agent memory, and vector retrieval hooks.
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
        self.memory: Dict[str, Any] = {}
        
        # Check if we have a real key or a placeholder
        self.is_mock = not self.api_key or self.api_key.startswith("your_") or "sk_" in self.api_key or "pk_" in self.api_key
        self.client = None
        
        if not self.is_mock:
            try:
                self.client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[{self.name}] Error initializing GenAI client: {e}. Falling back to mock execution.")
                self.is_mock = True

    def retrieve_context(self, query: str, collection: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieval helper from vector database (Qdrant mock/real).
        """
        print(f"[{self.name}] Vector DB Query in '{collection}': {query[:50]}")
        return [
            {
                "score": 0.92, 
                "payload": {
                    "text": "Internal database record: User customer logs and transaction tables must retain active user consent logs for 7 years.",
                    "document": "Corporate Data Deletion & Retention Policy v1.4.pdf",
                    "clause": "Sec 4.2 Retention Duration"
                }
            }
        ]

    def call_llm(self, prompt: str, system_instruction: str = None) -> str:
        """
        Helper to call Gemini. Falls back to generating mock content if API key is mock/missing.
        """
        GLOBAL_FORMATTING_RULES = """
====== GLOBAL FORMATTING RULES ======
1. Write like a senior enterprise compliance consultant (McKinsey/Bain style).
2. ALWAYS use structured Headings, Sub-headings, and Bullet lists.
3. NEVER return huge walls of text. Avoid long paragraphs.
4. Always highlight Business Impact, Priorities, and Owners.
5. Use tables where appropriate.
6. Format explicitly for CTOs, Compliance Officers, and Legal Teams.
=====================================
"""
        instruction = system_instruction or self.system_prompt
        instruction += f"\n\n{GLOBAL_FORMATTING_RULES}"
        
        if self.is_mock:
            # Simulate slight latency for natural feel
            time.sleep(0.5)
            return f"[Mock LLM Response for {self.name}] Synthesized response based on prompt: {prompt[:100]}..."
            
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config={'system_instruction': instruction}
            )
            return response.text
        except APIError as e:
            print(f"[{self.name}] Google GenAI API Error: {e}. Falling back to mock.")
            return f"[API Error Fallback response for {self.name}]"
        except Exception as e:
            print(f"[{self.name}] Unexpected error calling Gemini: {e}")
            return f"[Error Fallback response for {self.name}]"

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Execute core agent logical reasoning. Override this in child classes.
        """
        print(f"[{self.name}] Running reasoning logic...")
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        """
        Standard error mitigation behavior.
        """
        print(f"[{self.name}] Agent failed with error: {error}")
        state[f"status_{self.name}"] = f"FAILED: {str(error)}"
        state["error"] = str(error)
        return state
