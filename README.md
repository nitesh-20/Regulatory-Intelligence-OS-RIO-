# RIO Agent (Regulatory Intelligence Operating System)

RIO Agent is a production-grade, multi-agent regulatory intelligence platform designed to continuously monitor global regulations, compliance requirements, circulars, and enforcement actions, converting them into actionable business intelligence.

This codebase serves as a scalable, developer-ready starter architecture utilizing a robust React frontend, FastAPI backend gateway, Qdrant vector search, PostgreSQL data schemas, LangGraph collaborative agents, and Temporal background workers.

---

## 1. Monorepo Directory Layout

```
rio-agent/
├── frontend/             # React (Vite) + Tailwind CSS SPA Client
│   ├── src/
│   │   ├── components/   # Shared layout components (Sidebar, TopNav)
│   │   ├── pages/        # Interactive dashboards & SaaS consoles
│   │   └── index.css     # Design tokens & glassmorphic custom utility styles
├── backend/              # FastAPI python backend API
│   ├── app/
│   │   ├── api/          # REST Endpoint controllers (health, regs, watchlists)
│   │   ├── schemas/      # Pydantic schemas validation models
│   │   ├── database/     # SQLAlchemy connection session helper
│   │   └── main.py       # FastAPI application gateway entrypoint
├── agents/               # LangGraph multi-agent stubs (Shared package)
│   ├── base.py           # Base agent core logic class
│   └── definitions.py    # Implementation stubs for all 9 regulatory agents
├── workflows/            # Temporal background workflow stubs (Shared package)
│   └── temporal_workflows.py # Crawler, analyzer, and alert workflows
├── database/             # PostgreSQL database storage DDL schemas
│   └── schema.sql        # Tables DDL & query optimization indices
├── docs/                 # Architectural plans and detailed agents specifications
│   ├── ARCHITECTURE.md
│   └── AGENTS.md
├── docker-compose.yml    # Development stack container orchestration configs
├── package.json          # Root npm script workspace mapper
├── .gitignore            # Codebase version control ignores
└── README.md             # Platform startup & operations guides
```

---

## 2. Core Platform Capabilities & Modules

### Frontend Modules
*   **Executive Intelligence Dashboard**: Visual KPI widgets monitoring audit readiness, pending gaps, daily briefing summaries, and recent fines.
*   **Regulatory Feed**: Live feed filtering and tracking regulatory actions across categories (Privacy, Cyber, AI, Finance) and severity.
*   **Ask Impact AI**: Natural language conversational assistant simulating multi-agent reasoning steps to deliver company-specific requirements.
*   **Compliance Twin**: Ingestion inventory for corporate policies, automatically tracking mapped obligations and active compliance gaps.
*   **Audit Simulator**: Control execution console checking internal logs and documents against compliance framework rules.
*   **Policy Diff**: Unified side-by-side git diff interface for regulation versions.
*   **Settings**: System management for organization size, operational regions, databases, and third-party webhooks (Jira, Slack).

### Agent Architecture (LangGraph)
Scaffolds a collaborative multi-agent loop:
1.  **SourceDiscoveryAgent**: Finds new announcement links.
2.  **MonitoringAgent**: Classifies updates and matches existing records.
3.  **ExtractionAgent**: Converts documents to structured markdown.
4.  **ClassificationAgent**: Tags category, region, and jurisdiction.
5.  **ImpactAnalysisAgent**: Determines which company profiles are affected.
6.  **LegalReasoningAgent**: Summarizes requirements and risks.
7.  **ComplianceTwinAgent**: Evaluates gaps against internal policy indexes.
8.  **AuditSimulationAgent**: Verifies controls and calculates scores.
9.  **RecommendationAgent**: Creates actionable 30/90-day roadmaps.

### Background Orchestration (Temporal)
Resilient workflow engine backing high-frequency tasks:
*   **Regulation Monitoring Workflow**: Cron-based scheduler triggering scrapers.
*   **Compliance Analysis Workflow**: Pipelines documents into the LangGraph multi-agent analyzer.
*   **Notification Workflow**: Dispatches alerts to Slack channels or external targets.

---

## 3. Quickstart & Local Setup

### Prerequisites
*   Node.js v18+
*   Python v3.11+
*   Docker & Docker Compose

### Step 1: Bootstrap Configurations
```bash
# Clone the repository
git clone https://github.com/nitesh-20/Regulatory-Intelligence-OS-RIO-.git
cd "RIO Agent "

# Setup environment variables
cp .env.example .env
```
Update `.env` with your API credentials (Gemini, Clerk, Qdrant).

### Step 2: Install Dependencies
Run the unified installer to bootstrap both Node modules and Python packages:
```bash
npm run bootstrap
```

### Step 3: Launch Local Services
Spin up Qdrant, PostgreSQL, Redis, and Temporal servers using Docker:
```bash
docker-compose up -d
```

### Step 4: Run Development Servers
Start both the React client SPA and FastAPI servers concurrently:
```bash
npm run dev:all
```
*   **Frontend SPA**: `http://localhost:3000`
*   **FastAPI API Gateway**: `http://localhost:8000/docs`

---

## 4. External Integrations Configuration

### PostgreSQL Setup
Apply database tables schemas using the DDL file:
```bash
psql -h localhost -U rio_user -d rio_db -f database/schema.sql
```
*(Password: `rio_password`)*

### Clerk Authentication
1. Register at [Clerk.com](https://clerk.com) and create a project named `RIO Agent`.
2. Add API credentials to your `.env`:
   ```env
   CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

### Qdrant Vector Database
1. Qdrant dashboard is available at `http://localhost:6333/dashboard`.
2. Ensure `QDRANT_URL=http://localhost:6333` is set in `.env`.
