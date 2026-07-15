import time
from typing import Dict, Any, List
from agents.base import BaseAgent

# Helper decorator for Agent Retry Logic
def agent_retry(max_retries: int = 3, backoff_seconds: int = 2):
    def decorator(func):
        def wrapper(self, state: Dict[str, Any], *args, **kwargs):
            last_error = None
            for attempt in range(1, max_retries + 1):
                try:
                    return func(self, state, *args, **kwargs)
                except Exception as e:
                    last_error = e
                    print(f"[{self.name}] Attempt {attempt} failed with error: {str(e)}. Retrying...")
                    time.sleep(backoff_seconds * attempt)
            
            # If all attempts fail, invoke Failure Recovery
            print(f"[{self.name}] All attempts failed. Invoking Failure Recovery.")
            return self.handle_failure(state, last_error)
        return wrapper
    return decorator


class SourceDiscoveryAgent(BaseAgent):
    """
    Responsibilities: Scrapes or discovers legislative updates from government registers,
    gazettes, RSS feeds, and official URLs.
    """
    def __init__(self):
        super().__init__(
            name="SourceDiscoveryAgent",
            system_prompt="You are a compliance discovery intelligence agent. Spot new regulatory feeds, circulars, and announcements."
        )
        self.memory: Dict[str, Any] = {} # Local agent cache

    def use_scraping_tool(self, source_urls: List[str]) -> List[str]:
        print(f"[{self.name}] Executing Playwright/Crawl4AI Scraping Tool on sources.")
        return ["https://sec.gov/news/press-release/1", "https://meity.gov.in/notif/2"]

    @agent_retry(max_retries=3, backoff_seconds=1)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Inputs validation
        sources = state.get("sources")
        if not sources:
            raise ValueError("Input 'sources' list is missing.")

        print(f"[{self.name}] Processing source URLs: {sources}")
        
        # Tool usage
        discovered_urls = self.use_scraping_tool(sources)
        self.memory["last_discovered"] = discovered_urls
        
        # Outputs
        state["discovered_urls"] = discovered_urls
        state["status_source_discovery"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["discovered_urls"] = []
        state["status_source_discovery"] = f"FAILED: {str(error)}"
        state["escalate_to_human"] = True
        return state


class MonitoringAgent(BaseAgent):
    """
    Responsibilities: Tracks and identifies modifications to existing regulations, compares with historical database.
    """
    def __init__(self):
        super().__init__(
            name="MonitoringAgent",
            system_prompt="You are a regulation version monitoring agent. Determine if discovered items are updates to existing acts."
        )
        self.memory: Dict[str, Any] = {}

    def check_version_db_tool(self, url: str) -> Dict[str, Any]:
        print(f"[{self.name}] Checking DB version history for: {url}")
        return {"is_update": True, "existing_regulation_id": "reg-uuid-1234", "version_tag": "2026.1"}

    @agent_retry(max_retries=3, backoff_seconds=1)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        discovered_urls = state.get("discovered_urls")
        if not discovered_urls:
            raise ValueError("Input 'discovered_urls' is missing or empty.")

        print(f"[{self.name}] Monitoring version changes for discovered URLs.")
        updates = []
        for url in discovered_urls:
            res = self.check_version_db_tool(url)
            updates.append(res)
        
        self.memory["last_checked_updates"] = updates
        state["version_updates"] = updates
        state["is_update"] = True
        state["existing_regulation_id"] = "reg-uuid-1234"
        state["status_monitoring"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["version_updates"] = []
        state["is_update"] = False
        state["status_monitoring"] = f"FAILED: {str(error)}"
        return state


class ExtractionAgent(BaseAgent):
    """
    Responsibilities: Extracts raw text content from PDF/Docx/HTML, cleans text into structured markdown.
    Handles scanned files and OCR workflows.
    """
    def __init__(self):
        super().__init__(
            name="ExtractionAgent",
            system_prompt="You are a legal text extraction specialist. Clean raw document inputs and output structured markdown."
        )
        self.memory: Dict[str, Any] = {}

    def run_ocr_tool(self, document_path: str) -> str:
        print(f"[{self.name}] Running Tesseract/LayoutLM OCR on: {document_path}")
        return "# Amended Regulation\nSection 4.1: Database storage MUST employ AES-256 encryption."

    @agent_retry(max_retries=3, backoff_seconds=1)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        doc_path = state.get("document_path")
        if not doc_path:
            raise ValueError("Input 'document_path' is missing.")

        # Tool usage - run OCR pipeline
        cleaned_markdown = self.run_ocr_tool(doc_path)
        self.memory["last_extracted_markdown"] = cleaned_markdown

        state["cleaned_markdown"] = cleaned_markdown
        state["status_extraction"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["cleaned_markdown"] = ""
        state["status_extraction"] = f"FAILED: {str(error)}"
        state["escalate_to_human"] = True
        return state


class ClassificationAgent(BaseAgent):
    """
    Responsibilities: Categorizes the regulation based on jurisdiction, category, and tags.
    """
    def __init__(self):
        super().__init__(
            name="ClassificationAgent",
            system_prompt="You are a regulatory categorizer. Tag documents with taxonomy terms, regions, and categories."
        )
        self.memory: Dict[str, Any] = {}

    def llm_tagging_tool(self, text: str) -> Dict[str, Any]:
        print(f"[{self.name}] Classifying document content with LLM tagging tool.")
        return {"category": "Privacy", "country_code": "IN", "jurisdiction": "MEITY"}

    @agent_retry(max_retries=2, backoff_seconds=1)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        markdown = state.get("cleaned_markdown")
        if not markdown:
            raise ValueError("Input 'cleaned_markdown' is missing.")

        tags = self.llm_tagging_tool(markdown)
        self.memory["last_tags"] = tags

        state["metadata"] = tags
        state["status_classification"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["metadata"] = {"category": "Unclassified", "country_code": "GLOBAL", "jurisdiction": "UNKNOWN"}
        state["status_classification"] = f"FAILED: {str(error)}"
        return state


class ImpactAnalysisAgent(BaseAgent):
    """
    Responsibilities: Determines affected companies based on company size, geography, and industry segment.
    """
    def __init__(self):
        super().__init__(
            name="ImpactAnalysisAgent",
            system_prompt="You are an industry impact researcher. Map regulation rules against target user profiles."
        )
        self.memory: Dict[str, Any] = {}

    def analyze_demographics_tool(self, metadata: Dict[str, Any]) -> List[str]:
        print(f"[{self.name}] Calculating industry footprint based on metadata: {metadata}")
        return ["Fintech", "SaaS"]

    @agent_retry(max_retries=2, backoff_seconds=1)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        metadata = state.get("metadata")
        if not metadata:
            raise ValueError("Input 'metadata' is missing.")

        industries = self.analyze_demographics_tool(metadata)
        self.memory["last_impacted_industries"] = industries

        state["affected_industries"] = industries
        state["company_size_affected"] = "All"
        state["status_impact_analysis"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["affected_industries"] = ["All"]
        state["company_size_affected"] = "All"
        state["status_impact_analysis"] = f"FAILED: {str(error)}"
        return state


class LegalReasoningAgent(BaseAgent):
    """
    Responsibilities: Translates complex legal boilerplate text into concise, plain-English summaries.
    Highlights penalties and compliance risks.
    """
    def __init__(self):
        super().__init__(
            name="LegalReasoningAgent",
            system_prompt="You are a legal summarization analyst. Explain business impact, risks, and requirements in plain terms."
        )
        self.memory: Dict[str, Any] = {}

    def extract_legal_requirements_tool(self, text: str) -> Dict[str, Any]:
        print(f"[{self.name}] Extracting rules, requirements, and risks.")
        return {
            "summary": "Mandates real-time consent withdrawal and database encryption verification.",
            "requirements": ["AES-256 encryption", "Deletion logs available"],
            "risks": "Non-compliance penalty up to 2% of global revenue."
        }

    @agent_retry(max_retries=3, backoff_seconds=1)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        markdown = state.get("cleaned_markdown")
        if not markdown:
            raise ValueError("Input 'cleaned_markdown' is missing.")

        reasoning = self.extract_legal_requirements_tool(markdown)
        self.memory["last_reasoning"] = reasoning

        state["summary"] = reasoning["summary"]
        state["requirements"] = reasoning["requirements"]
        state["risks"] = reasoning["risks"]
        state["status_legal_reasoning"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["summary"] = "Failed to parse legal details."
        state["requirements"] = []
        state["risks"] = "HIGH"
        state["status_legal_reasoning"] = f"FAILED: {str(error)}"
        return state


class ComplianceTwinAgent(BaseAgent):
    """
    Responsibilities: Cross-checks the regulation changes against company internal policies and flags gaps.
    Integrates with the Self-Correcting RAG pipeline to verify context.
    """
    def __init__(self):
        super().__init__(
            name="ComplianceTwinAgent",
            system_prompt="You are the Compliance Twin mapper. Match regulatory clauses against company policies in the vector index."
        )
        self.memory: Dict[str, Any] = {}

    def query_policy_vector_index(self, query: str) -> List[Dict[str, Any]]:
        # Tool usage - Qdrant vector lookup
        return self.retrieve_context(query, "policies", top_k=3)

    @agent_retry(max_retries=3, backoff_seconds=2)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        requirements = state.get("requirements")
        if not requirements:
            raise ValueError("Input 'requirements' is missing.")

        gaps = []
        for req in requirements:
            contexts = self.query_policy_vector_index(req)
            # Evaluate relevance (Self-Correcting RAG layer simulation)
            best_score = max([c.get("score", 0) for c in contexts]) if contexts else 0
            if best_score < 0.80:
                gaps.append({
                    "clause": req,
                    "policy_ref": "None Found",
                    "gap_details": f"Internal policy mapping confidence low ({best_score:.2f}). Compliance check failed."
                })
        
        self.memory["last_evaluated_gaps"] = gaps
        state["gaps_found"] = gaps
        state["status_compliance_twin"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["gaps_found"] = [{"clause": "All", "policy_ref": "N/A", "gap_details": f"System error: {str(error)}"}]
        state["status_compliance_twin"] = f"FAILED: {str(error)}"
        return state


class AuditSimulationAgent(BaseAgent):
    """
    Responsibilities: Executes mock audit runs on active twin controls and computes readiness score.
    """
    def __init__(self):
        super().__init__(
            name="AuditSimulationAgent",
            system_prompt="You are the Audit Simulator. Verify if internal controls and documentation pass the audit rules."
        )
        self.memory: Dict[str, Any] = {}

    def check_audit_controls_tool(self, gaps: List[Dict[str, Any]]) -> Dict[str, Any]:
        print(f"[{self.name}] Simulating control audit against gaps.")
        failed_count = len(gaps)
        score = max(0, 100 - (failed_count * 15))
        return {"readiness_score": score, "failed_controls": failed_count}

    @agent_retry(max_retries=2, backoff_seconds=1)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        gaps = state.get("gaps_found")
        if gaps is None:
            raise ValueError("Input 'gaps_found' is missing.")

        audit_results = self.check_audit_controls_tool(gaps)
        self.memory["last_audit_results"] = audit_results

        state["readiness_score"] = audit_results["readiness_score"]
        state["failed_controls"] = audit_results["failed_controls"]
        state["status_audit_simulation"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["readiness_score"] = 0
        state["failed_controls"] = 999
        state["status_audit_simulation"] = f"FAILED: {str(error)}"
        return state


class RecommendationAgent(BaseAgent):
    """
    Responsibilities: Creates actionable compliance roadmaps with immediate, 30-day, and 90-day actions.
    Integrates external ticketing tools (Jira/Linear).
    """
    def __init__(self):
        super().__init__(
            name="RecommendationAgent",
            system_prompt="You are the Recommendation Roadmap generator. Outline technical task tickets and policy revisions."
        )
        self.memory: Dict[str, Any] = {}

    def create_jira_task_tool(self, title: str, description: str) -> str:
        print(f"[{self.name}] Mocking Jira Task creation: {title}")
        return "JIRA-4821"

    @agent_retry(max_retries=2, backoff_seconds=1)
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        gaps = state.get("gaps_found")
        if gaps is None:
            raise ValueError("Input 'gaps_found' is missing.")

        tickets = []
        for gap in gaps:
            task_id = self.create_jira_task_tool(
                title=f"Resolve gap: {gap['clause']}",
                description=gap["gap_details"]
            )
            tickets.append(task_id)

        roadmap = {
            "immediate": "Conduct code audit on database log parameters.",
            "thirty_days": "Publish update to internal consent policies.",
            "tickets": tickets
        }
        self.memory["last_roadmap"] = roadmap

        state["roadmap"] = roadmap
        state["status_recommendation"] = "SUCCESS"
        return state

    def handle_failure(self, state: Dict[str, Any], error: Exception) -> Dict[str, Any]:
        state["roadmap"] = {"immediate": "Manual compliance check needed.", "tickets": []}
        state["status_recommendation"] = f"FAILED: {str(error)}"
        return state
