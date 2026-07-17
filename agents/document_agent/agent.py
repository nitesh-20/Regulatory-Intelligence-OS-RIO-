from agents.base import BaseAgent
from typing import Dict, Any, List

class DocumentAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="DocumentAgent",
            system_prompt="You are a document extraction and ingestion specialist. Perform OCR, structural cleanups, and extract entities."
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        doc_path = state.get("document_path", "sec_cyber_ruling_draft.pdf")
        print(f"[{self.name}] Indexing & generating metadata for: '{doc_path}'")
        
        # Simulate OCR and entity extraction
        state["cleaned_markdown"] = "# SEC Cybersecurity Amendments\n- Requirement 1: Deploy AES-256 encryption on corporate files.\n- Requirement 2: Audit keys monthly."
        state["extracted_entities"] = ["SEC", "AES-256", "Audit Trail"]
        state["metadata"] = {"authority": "SEC", "severity": "HIGH", "category": "Cybersecurity"}
        state["status_document_agent"] = "SUCCESS"
        return state
