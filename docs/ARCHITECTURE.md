# RIO Agent System Architecture Document

This document outlines the software design, data pathways, and components of the **RIO Agent** platform.

---

## 1. High-Level Technical Architecture

```
                                  +-----------------------+
                                  |    React Frontend     |
                                  |     (Vite/Port 3000)  |
                                  +-----------+-----------+
                                              |
                                              | HTTPS / WebSockets
                                              v
                                  +-----------+-----------+
                                  |    FastAPI Gateway    |
                                  |        (Port 8000)    |
                                  +-----+-----+-----+-----+
                                        |     |     |
                 +----------------------+     |     +----------------------+
                 |                            |                            |
                 v                            v                            v
      +----------+----------+       +---------+---------+       +----------+----------+
      |  PostgreSQL Database|       | Qdrant Vector DB  |       |  Redis Cache / MQ   |
      |   (Relational/DDL)  |       | (Semantic Search) |       |  (Temporal State)   |
      +---------------------+       +-------------------+       +---------------------+
                                              ^
                                              | Ingests & Queries
                                              |
                                    +---------+---------+
                                    |  Temporal Worker  |
                                    | & LangGraph Loop  |
                                    +-------------------+
                                              ^
                                              |
                                    +---------+---------+
                                    | Playwright Scraper|
                                    +-------------------+
```

---

## 2. Component Breakdown

### A. Frontend (React & Tailwind CSS)
*   **Vite**: Selected for fast build speeds and instant hot-module reloading.
*   **React Router**: Manages page routing. Pages are modularized in `src/pages`.
*   **Tailwind CSS**: Utility-first CSS frame integrated with standard modern typography (Inter/Outfit) and custom HSL color schemas to render premium glassmorphic UI panels.

### B. API Gateway (FastAPI)
*   **Asynchronous Engine**: Leverages Python's `asyncio` for concurrent query handling.
*   **Routing**: Decoupled routes (`app/api/endpoints.py`) linked directly with SQLAlchemy PostgreSQL database handlers.
*   **Pydantic Validations**: Ensures structural integrity of inputs and enforces strict interface schemas.

### C. Relational Store (PostgreSQL)
*   Holds relational objects (organizations, tenants, users, DDL metadata, watchlists).
*   Enforces relational integrity via structured foreign keys, cascade delete rules, and transaction boundaries.

### D. Vector Store (Qdrant)
*   Stores text embeddings representing individual clauses of regulations alongside enterprise policy documents.
*   Executes fast Cosine Similarity searches to map external regulations to internal controls.

### E. Background Orchestrator (Temporal)
*   Provides durable execution for long-running scrapers, preventing transaction drops.
*   Executes activity retry loops if scraper targets change structures or throw network failures.
