import io
import os
import json
from pypdf import PdfReader
from agents.base import BaseAgent
from typing import Dict, Any, List
from app.database.models import Policy
from app.database.connection import SessionLocal

class DocumentAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="DocumentAgent",
            system_prompt=(
                "You are an expert document extraction and ingestion specialist. "
                "Analyze document text to extract structured compliance information (metadata, key obligations, entities)."
            )
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Parses document content, runs entity/obligation extraction using Gemini, 
        and saves the policy to the database.
        
        Expected state parameters:
        - "file_content": bytes (optional)
        - "file_name": str (optional)
        - "organization_id": str (optional)
        - "db": Session (optional)
        """
        file_content = state.get("file_content")
        file_name = state.get("file_name", "uploaded_policy.pdf")
        org_id = state.get("organization_id")
        db = state.get("db")
        
        text_content = ""
        
        # 1. Parse PDF or Text Content
        if file_content:
            try:
                if file_name.lower().endswith(".pdf"):
                    reader = PdfReader(io.BytesIO(file_content))
                    pages_text = []
                    for idx, page in enumerate(reader.pages):
                        pages_text.append(page.extract_text() or "")
                    text_content = "\n".join(pages_text)
                else:
                    text_content = file_content.decode("utf-8", errors="ignore")
            except Exception as e:
                print(f"[{self.name}] Error reading file: {e}")
                text_content = ""
                
        if not text_content:
            # Fallback to default mock if no content provided
            text_content = (
                "# Database Control Standards\n"
                "Standard 2.4: All data at rest must use cryptographic safety keys.\n"
                "Standard 4.2: Customer credentials and personal logs database tables must employ AES-128 encryption algorithm."
            )
            file_name = "Database & Data Security controls.md"

        # 2. Extract Metadata & Obligations using Gemini
        prompt = (
            f"You are a regulatory compliance parser. Extract information from this policy text. "
            f"Text:\n\"\"\"\n{text_content[:8000]}\n\"\"\"\n\n"
            f"Respond with a JSON object containing:\n"
            f"1. \"title\": Extract a proper title for this policy.\n"
            f"2. \"category\": Classify into Privacy, Cybersecurity, AI, Financial, or General.\n"
            f"3. \"obligations\": List 2-4 key operational obligations extracted as bullet points.\n"
            f"4. \"entities\": List of main software, authorities, or standards mentioned.\n"
            f"5. \"severity\": Suggested severity if these rules are breached (CRITICAL, HIGH, MEDIUM, LOW).\n"
            f"Do not include markdown tags like ```json in your response, return raw JSON string."
        )
        
        title = file_name
        category = "General"
        obligations = []
        entities = []
        severity = "MEDIUM"
        
        try:
            # Generate structured response from Gemini
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            raw_text = response.text.strip()
            # Clean possible markdown wrapping if returned
            if raw_text.startswith("```"):
                lines = raw_text.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines[-1].startswith("```"):
                    lines = lines[:-1]
                raw_text = "\n".join(lines).strip()
                
            parsed = json.loads(raw_text)
            title = parsed.get("title", title)
            category = parsed.get("category", category)
            obligations = parsed.get("obligations", [])
            entities = parsed.get("entities", [])
            severity = parsed.get("severity", severity)
        except Exception as e:
            print(f"[{self.name}] Gemini extraction failed or parsed invalid JSON: {e}")
            # Fallback values
            if "encryption" in text_content.lower() or "cipher" in text_content.lower():
                category = "Cybersecurity"
                entities = ["AES-128", "Database"]
                obligations = ["All data at rest must use cryptographic keys.", "Store customer logs encrypted."]
                severity = "HIGH"

        # 3. Save to database if session is provided
        created_policy_id = None
        if db and org_id:
            try:
                new_policy = Policy(
                    organization_id=org_id,
                    title=title,
                    content=text_content,
                    version_tag="1.0.0"
                )
                db.add(new_policy)
                db.commit()
                db.refresh(new_policy)
                created_policy_id = new_policy.id
                print(f"[{self.name}] Successfully saved policy '{title}' (ID: {created_policy_id}) to DB.")
            except Exception as e:
                db.rollback()
                print(f"[{self.name}] Error saving policy to DB: {e}")

        # 4. Update execution state
        state["cleaned_markdown"] = text_content
        state["extracted_entities"] = entities
        state["extracted_obligations"] = obligations
        state["policy_title"] = title
        state["policy_id"] = created_policy_id
        state["metadata"] = {
            "authority": "Internal Corporate Policy",
            "severity": severity,
            "category": category
        }
        state["status_document_agent"] = "SUCCESS"
        return state
