import asyncio
import os
from temporalio import activity, workflow
from temporalio.client import Client
from temporalio.worker import Worker

from app.core.crawlers.rbi_crawler import RBICrawler
from app.core.crawlers.sebi_crawler import SEBICrawler

# ---------------------------------------------------------
# ACTIVITIES
# ---------------------------------------------------------
@activity.defn
async def scrape_regulatory_source(source: str) -> list:
    """
    Production Scraper Activity using real BeautifulSoup crawlers.
    """
    activity.logger.info(f"Scraping real data from {source}...")
    
    if source == "RBI":
        crawler = RBICrawler()
        return crawler.scrape_latest(limit=3)
    elif source == "SEBI":
        crawler = SEBICrawler()
        return crawler.scrape_latest(limit=3)
    
    return []

@activity.defn
async def process_document_pipeline(raw_text: str) -> dict:
    """
    Document Pipeline Activity.
    OCR -> Extract Text -> Chunking -> Embeddings -> Insert to Qdrant.
    """
    activity.logger.info("Executing Document Pipeline (Chunking & Embedding)...")
    # TODO: Integrate with Qdrant client and Gemini embeddings
    await asyncio.sleep(1)
    return {"status": "indexed", "chunks": 42}

@activity.defn
async def trigger_ai_pipeline(doc_metadata: dict) -> dict:
    """
    Triggers the downstream Agentic AI Pipeline (Risk, Compliance, Reporting).
    """
    activity.logger.info("Triggering Agentic Pipeline...")
    # TODO: Integrate with actual PlannerAgent logic
    await asyncio.sleep(1)
    return {"risk_score": 85, "compliance_gaps": 2}


# ---------------------------------------------------------
# WORKFLOWS
# ---------------------------------------------------------
@workflow.defn
class RegulatoryMonitoringWorkflow:
    @workflow.run
    async def run(self, source_url: str) -> dict:
        """
        Main orchestration workflow for regulatory updates.
        """
        # 1. Scrape
        raw_text = await workflow.execute_activity(
            scrape_regulatory_source,
            source_url,
            start_to_close_timeout=timedelta(minutes=5),
        )
        
        # 2. Process
        doc_metadata = await workflow.execute_activity(
            process_document_pipeline,
            raw_text,
            start_to_close_timeout=timedelta(minutes=5),
        )
        
        # 3. Analyze
        analysis_result = await workflow.execute_activity(
            trigger_ai_pipeline,
            doc_metadata,
            start_to_close_timeout=timedelta(minutes=10),
        )
        
        return analysis_result


# ---------------------------------------------------------
# WORKER BOOTSTRAP
# ---------------------------------------------------------
async def main():
    temporal_host = os.getenv("TEMPORAL_HOST_PORT", "localhost:7233")
    print(f"Connecting to Temporal cluster at {temporal_host}...")
    
    try:
        client = await Client.connect(temporal_host)
        print("Connected to Temporal!")
        
        worker = Worker(
            client,
            task_queue="rio-monitoring-queue",
            workflows=[RegulatoryMonitoringWorkflow],
            activities=[scrape_regulatory_source, process_document_pipeline, trigger_ai_pipeline],
        )
        print("Starting RIO Temporal Worker...")
        await worker.run()
    except Exception as e:
        print(f"Failed to connect to Temporal: {e}")

if __name__ == "__main__":
    from datetime import timedelta
    asyncio.run(main())
