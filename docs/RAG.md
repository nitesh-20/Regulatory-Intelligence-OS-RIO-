# Production RAG Pipeline Specifications

This document outlines the architecture of the **Self-Correcting RAG (Retrieval-Augmented Generation)** pipeline utilized within the **RIO** platform.

---

## 1. Vector Synchronization Sequence

To map unstructured circulars to active internal policies, the system implements a multi-step indexing pipeline:

```
[Document Ingestion]
        │
        ▼
[Chunk Partitioning] (Recursive Character Text Splitting: 1000 characters chunk size, 150 characters overlap)
        │
        ▼
[Metadata Tagging] (Extract Jurisdiction, Date, Target Industry, Penalty Clauses via LLM)
        │
        ▼
[Embedding Generation] (Gemini Embedding model text-embedding-004)
        │
        ▼
[Qdrant Synchronization] (Payload: Text block + Metadata JSON, Vector dimension: 768, Distance: Cosine)
```

---

## 2. Self-Correcting Retrieval & Refinement Loop

To prevent hallucinations, RIO uses a double-evaluation loop (orchestrated by the Research and Compliance agents):

1. **Hybrid Retrieval**: Querying Qdrant using vector distance matching + lexical keyword scoring.
2. **Context Precision Analysis**:
   - The retrieved context is checked for relevance to the initial inquiry.
   - If confidence scores drop below a threshold (default: `0.80`), the system triggers a query refinement step.
3. **Query Refinement**:
   - The sub-agent reformulates the search parameters (e.g. broadening search strings, adding synonyms).
   - If retrieval succeeds, context passes to generation. If not, it triggers an escalation webhook.
4. **Generation & Verification**:
   - The LLM synthesizes the compliance verdict.
   - The output is validated for Groundedness (does the response match only the retrieved source context?) and Faithfulness.
