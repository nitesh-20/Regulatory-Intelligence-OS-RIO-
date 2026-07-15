from datetime import timedelta
from typing import Dict, Any, List
from temporalio import workflow, activity
from temporalio.common import RetryPolicy

# Activities stubs for Self-Correcting RAG

@activity.defn
async def crawl_regulatory_sites(sources: List[str]) -> List[Dict[str, Any]]:
    """
    Activity to launch Playwright/Crawl4AI scraping instances.
    """
    print(f"[Activity] Crawling sources: {sources}")
    return [
        {"title": "New DPDP Consent Circular", "url": "https://meity.gov.in/circular/1", "is_scanned": True},
        {"title": "Amended SEC Form 8-K guidelines", "url": "https://sec.gov/guideline/2", "is_scanned": False}
    ]


@activity.defn
async def run_ocr_pipeline_activity(doc_payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    OCR Ingestion Pipeline Activity: Tesseract / LayoutLM layout clean-up.
    Handles scanned and poorly formatted PDF files.
    """
    print(f"[Activity] Running OCR & Layout Cleanup on: {doc_payload.get('title')}")
    return {
        "title": doc_payload.get("title"),
        "raw_text": "Amended SEC Form 8-K encryption requirements: AES-256 standard.",
        "cleaned_markdown": "# SEC Form 8-K Amendment\nSection 12: Storage MUST employ AES-256 keys.",
        "metadata": {
            "authority": "SEC",
            "country_code": "US",
            "effective_date": "2026-07-15"
        }
    }


@activity.defn
async def run_vector_indexing_activity(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Embedding Generation & Qdrant Synchronization Activity.
    Chunks text, calculates embeddings, and pushes to Qdrant.
    """
    print(f"[Activity] Generating vectors and syncing to Qdrant for: {payload.get('title')}")
    # Simulate chunk split & upload
    return {
        "collection": "regulations",
        "chunks_indexed": 4,
        "status": "SUCCESS"
    }


@activity.defn
async def run_langgraph_analysis(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Activity to invoke the LangGraph multi-agent state reasoning engine.
    """
    print(f"[Activity] Running LangGraph reasoning workflow on: {payload.get('title')}")
    return {
        "summary": "Plain English summary of the new requirements.",
        "gaps_identified": ["Database encryption strength is weak under SEC rules."],
        "priority": "HIGH"
    }


@activity.defn
async def run_self_correcting_rag_eval_activity(rag_payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    RAG Evaluation Layer: Checks Faithfulness, Groundedness, Precision, and Citations.
    """
    query = rag_payload.get("query", "")
    iteration = rag_payload.get("iteration", 1)
    print(f"[Activity] Evaluating RAG Answer for query: '{query}' (Iteration {iteration})")
    
    # Simulate correction behavior: Fail first iteration to trigger correction, then pass
    if iteration == 1:
        return {
            "faithfulness": 0.65,
            "groundedness": 0.70,
            "context_precision": 0.60,
            "citation_accuracy": 0.50,
            "confidence_score": 0.55,
            "evaluation_passed": False,
            "suggested_query_refinement": f"{query} encryption requirements metadata"
        }
    else:
        return {
            "faithfulness": 0.96,
            "groundedness": 0.98,
            "context_precision": 0.95,
            "citation_accuracy": 1.00,
            "confidence_score": 0.96,
            "evaluation_passed": True,
            "suggested_query_refinement": ""
        }


@activity.defn
async def send_slack_alert(details: Dict[str, Any]) -> str:
    """
    Activity to push webhook payloads to Slack channels.
    """
    print(f"[Activity] Dispatching Slack notifications: {details}")
    return "Notification Sent"


# Temporal Workflows

@workflow.defn
class RegulationMonitoringWorkflow:
    """
    Workflow for hourly cron checks, crawling, and OCR pipeline triggers.
    """
    @workflow.run
    async def run(self, sources: List[str]) -> Dict[str, Any]:
        retry_policy = RetryPolicy(
            initial_interval=timedelta(seconds=5),
            backoff_coefficient=2.0,
            maximum_attempts=5
        )

        # Step 1: Run crawling activity
        results = await workflow.execute_activity(
            crawl_regulatory_sites,
            sources,
            start_to_close_timeout=timedelta(minutes=5),
            retry_policy=retry_policy
        )

        processed_docs = []
        for doc in results:
            # Step 2: Trigger OCR and cleaning on every document
            cleaned_doc = await workflow.execute_activity(
                run_ocr_pipeline_activity,
                doc,
                start_to_close_timeout=timedelta(minutes=10),
                retry_policy=retry_policy
            )
            
            # Step 3: Run Vector Indexing to Qdrant
            await workflow.execute_activity(
                run_vector_indexing_activity,
                cleaned_doc,
                start_to_close_timeout=timedelta(minutes=5),
                retry_policy=retry_policy
            )
            
            processed_docs.append(cleaned_doc)

        return {"scraped_count": len(results), "documents": processed_docs}


@workflow.defn
class SelfCorrectingRAGWorkflow:
    """
    Workflow coordinating retrieval, LLM generation, the Evaluation Layer,
    and query refinement loops for queries.
    """
    @workflow.run
    async def run(self, query: str) -> Dict[str, Any]:
        retry_policy = RetryPolicy(
            initial_interval=timedelta(seconds=2),
            maximum_attempts=3
        )
        
        current_query = query
        max_iterations = 3
        
        for iteration in range(1, max_iterations + 1):
            # Step 1: Run LangGraph Agent Reasoning Loop
            agent_result = await workflow.execute_activity(
                run_langgraph_analysis,
                {"title": current_query},
                start_to_close_timeout=timedelta(minutes=10),
                retry_policy=retry_policy
            )
            
            # Step 2: Evaluate result
            eval_result = await workflow.execute_activity(
                run_self_correcting_rag_eval_activity,
                {"query": current_query, "iteration": iteration, "agent_result": agent_result},
                start_to_close_timeout=timedelta(minutes=5),
                retry_policy=retry_policy
            )
            
            if eval_result["evaluation_passed"]:
                return {
                    "query": query,
                    "answer": agent_result["summary"],
                    "confidence_score": eval_result["confidence_score"],
                    "evaluation": eval_result,
                    "status": "APPROVED"
                }
            
            # Refine query for next iteration
            current_query = eval_result["suggested_query_refinement"]
            
        # If still failing, escalate to Human Reviewer
        await workflow.execute_activity(
            send_slack_alert,
            {"alert_type": "LOW_CONFIDENCE_RAG_ESCALATION", "query": query},
            start_to_close_timeout=timedelta(minutes=1)
        )
        
        return {
            "query": query,
            "answer": "Confidence low. Escalated to human reviewer.",
            "confidence_score": 0.30,
            "status": "ESCALATED"
        }
