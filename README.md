<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-check.svg" width="80" height="80" alt="RIO Logo">
  <h1>RIO – Regulatory Intelligence Operating System</h1>
  <p><strong>An AI-powered Multi-Agent Regulatory Intelligence Platform that continuously monitors regulations, analyzes business impact, and automates enterprise compliance.</strong></p>

  <p>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
    <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/FastAPI-0.111-009688?logo=fastapi" alt="FastAPI">
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Qdrant-Vector%20DB-FF3366?logo=qdrant" alt="Qdrant">
    <img src="https://img.shields.io/badge/Google%20GenAI-Gemini%202.5-4285F4" alt="Gemini">
    <img src="https://img.shields.io/badge/Status-Production%20Ready-success" alt="Status">
  </p>
</div>

---

## 🚀 Live Platform

Experience the production deployment of RIO:

**[https://rio-agent-platform.vercel.app/](https://rio-agent-platform.vercel.app/)**

> **Note:** The live environment is actively connected to Google Gemini 2.5 Flash for autonomous reasoning and Qdrant for vector embeddings.

---

## 📖 Project Overview

### What is RIO?
RIO (Regulatory Intelligence Operating System) is an enterprise-grade, agentic AI platform designed for Fortune 500 companies, fintechs, banks, and large institutions. It acts as an autonomous digital compliance officer that never sleeps. 

### Why enterprises need it
Regulatory landscapes (e.g., RBI, SEBI, CERT-In, DPDP) shift daily. Traditional compliance involves manual teams reading PDFs, mapping them to internal corporate policies, and tracking gaps in spreadsheets—a slow, error-prone, and expensive process. Missed updates lead to millions in regulatory fines and immense reputational damage.

### What problems it solves
RIO completely automates regulatory monitoring. It autonomously scrapes government registries, extracts structured obligations, semantic-matches them against internal policies, computes a business risk score, and assigns specific remediation tasks to corresponding departments.

---

## ✨ Key Features

- **Multi-Agent Architecture**: A decentralized mesh of specialized AI agents (Planner, Compliance, Risk, Document, etc.) collaborating to solve complex compliance reasoning.
- **Continuous Regulatory Monitoring**: Autonomous pipelines that ingest and normalize regulations from global regulatory bodies.
- **Compliance Twin**: An AI representation of your internal corporate policies. Upload a PDF policy, and RIO instantly parses clauses, generates embeddings, and identifies specific gaps against active regulations.
- **Policy Diff Engine**: Visually compare legal documents version-over-version with semantic highlighting of critical changes.
- **AI Assistant (RAG)**: Conversational interface grounded in your corporate data and active regulations to answer precise compliance queries.
- **Risk Intelligence**: Algorithmic scoring of compliance posture, calculating operational and financial exposure.
- **Executive Reports**: Auto-generated, boardroom-ready summaries of regulatory changes and remediation plans.
- **Enterprise Search**: Vector-based semantic search across thousands of pages of internal and external regulatory documents.

---

## 🏛 System Architecture

RIO utilizes a highly modular, decoupled architecture driven by an autonomous AI mesh.

```mermaid
graph TD
    subgraph "External Sources"
        GOV[Government Registries]
        PDF[PDF Circulars]
        WEB[Compliance News]
    end

    subgraph "Ingestion & Storage"
        MON[Monitoring Engine]
        DOC[Document Pipeline]
        VEC[(Qdrant Vector DB)]
        SQL[(PostgreSQL DB)]
    end

    subgraph "AI Agent Mesh"
        PLAN[Planner Agent]
        COMP[Compliance Agent]
        RISK[Risk Agent]
        DOC_AG[Document Agent]
    end

    subgraph "Enterprise UI"
        DASH[Executive Dashboard]
        TWIN[Compliance Twin]
        CHAT[AI Assistant]
    end

    GOV --> MON
    WEB --> MON
    PDF --> DOC
    MON --> SQL
    DOC --> VEC
    DOC --> SQL

    PLAN --> COMP
    PLAN --> RISK
    PLAN --> DOC_AG
    
    COMP <--> VEC
    COMP <--> SQL
    
    SQL --> DASH
    VEC --> TWIN
    PLAN --> CHAT
```

---

## 🤖 AI Agents

The heart of RIO is its collaborative agent mesh. Each agent has specialized prompts, tools, and responsibilities.

| Agent | Responsibility |
| :--- | :--- |
| **Planner Agent** | The central orchestrator. Deconstructs user intent, builds execution graphs, and delegates tasks to sub-agents. |
| **Monitoring Agent** | Continuously scans external regulatory registries and government websites for new circulars. |
| **Document Agent** | Ingests PDFs, performs OCR, chunks text, and uses LLMs to extract exact clauses, metadata, and obligations. |
| **Compliance Agent** | Evaluates internal corporate policies against external regulations via RAG to autonomously generate compliance gaps. |
| **Risk Agent** | Analyzes identified gaps to compute severity, business impact, and financial exposure. |
| **Comparison Agent** | Performs semantic diffing between two versions of a legal document to highlight critical alterations. |
| **Report Agent** | Synthesizes raw agent output into professional, boardroom-ready executive summaries. |
| **Notification Agent** | Manages real-time alerts and email dispatches to relevant stakeholders when critical changes occur. |

---

## 🛠 Tech Stack

- **Frontend**: React, Next.js (Vite), TypeScript, Tailwind CSS, Lucide Icons, Framer Motion
- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Pydantic
- **AI / LLM**: Google GenAI SDK (Gemini 2.5 Flash), `langchain-text-splitters`
- **Database**: PostgreSQL (Relational Data)
- **Vector Database**: Qdrant (Semantic RAG Embeddings)
- **Infrastructure**: Vercel (Serverless), Docker, GitHub Actions
- **Authentication**: JWT, Role-Based Access Control
- **Monitoring**: Built-in Python logging and execution tracking

---

## 📂 Project Structure

```text
rio-agent/
├── frontend/             # React (Vite) + TypeScript + Tailwind CSS Client
├── backend/              # FastAPI Python Gateway
│   └── app/
│       ├── api/          # REST API Controllers
│       ├── core/         # Vector pipelines & auth logic
│       └── database/     # SQLAlchemy Models & Migrations
├── agents/               # Autonomous AI agent logic & prompts
│   ├── base.py           # Core Agent Class
│   ├── planner_agent/    # Orchestrator
│   ├── compliance_agent/ # Gap mapping
│   └── ...               
├── docs/                 # Architectural specifications
└── vercel.json           # Serverless deployment configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python v3.11+
- PostgreSQL (Local or Cloud)
- Qdrant (Local Docker or Qdrant Cloud)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nitesh-20/Regulatory-Intelligence-OS-RIO-.git
   cd Regulatory-Intelligence-OS-RIO-
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` to include your specific credentials:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=postgresql://user:pass@localhost:5432/rio_db
   QDRANT_URL=http://localhost:6333
   ```

3. **Install Dependencies**
   ```bash
   npm run bootstrap
   ```

### Running Locally
To launch both the FastAPI backend and the React frontend concurrently:
```bash
npm run dev:all
```
The platform will be accessible at `http://localhost:3001`.

### Running with Docker
*(Ensure Docker Daemon is running)*
```bash
docker-compose up --build -d
```

---

## 🔄 Automated Workflow

```mermaid
sequenceDiagram
    participant Gov as Govt Sources
    participant Monitoring as Monitoring Engine
    participant Document as Document Pipeline
    participant Embed as Embeddings
    participant Compliance as Compliance Mapping
    participant Risk as Risk Analysis
    participant Report as Report Gen

    Gov->>Monitoring: Publish New Circular
    Monitoring->>Document: Download PDF Document
    Document->>Embed: Extract Text & Tables
    Embed->>Embed: Store in Qdrant Vector DB
    Embed->>Compliance: Trigger Evaluation
    Compliance->>Risk: Find Gaps vs Corporate Policy
    Risk->>Report: Score Financial/Operational Risk
    Report->>Report: Synthesize Executive Summary
    Report-->>Gov: Dispatch Notifications to Owners
```

---

## 📸 Screenshots

<details>
<summary><b>1. Enterprise Dashboard</b></summary>
<i>Centralized hub for active alerts, risk exposure metrics, and recent compliance changes.</i>
<br><br>
<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layout-dashboard.svg" height="200" alt="Dashboard Placeholder">
</details>

<details>
<summary><b>2. Compliance Twin</b></summary>
<i>Digital representation of corporate policies with real-time discrepancy mapping.</i>
<br><br>
<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield.svg" height="200" alt="Compliance Twin Placeholder">
</details>

<details>
<summary><b>3. AI Assistant (RAG)</b></summary>
<i>Context-aware chatbot providing legal analysis on uploaded internal policies.</i>
<br><br>
<img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/bot.svg" height="200" alt="AI Assistant Placeholder">
</details>

---

## 📡 API Documentation

RIO uses FastAPI, which provides an auto-generated OpenAPI specification. Once running locally, navigate to `http://localhost:8000/docs` to view the interactive Swagger UI.

**Example Endpoints:**
- `POST /api/v1/agent/chat`
  - *Request*: `{"prompt": "Summarize RBI circular changes."}`
  - *Response*: Streamed agent reasoning and final executive markdown.
- `GET /api/v1/compliance/gaps`
  - *Response*: JSON list of active compliance gaps sorted by severity.
- `POST /api/v1/documents/upload`
  - *Request*: `multipart/form-data` with PDF file.
  - *Response*: Parsed document metadata, AI insights, and Qdrant ingestion status.

---

## 🗺 Roadmap

- [ ] **Multi-Tenant Architecture**: Scale the platform to support isolated corporate tenants securely.
- [ ] **Jira/ServiceNow Integration**: Automatically dispatch remediation tickets to external ITSM tools.
- [ ] **Multi-modal Intelligence**: Support audio call transcripts for internal compliance audits.
- [ ] **Custom Fine-tuned Legal LLM**: Deploy locally hosted small language models optimized for strict legal reasoning.

---

## 🔒 Security

Enterprise security is a core pillar of RIO:
- **Authentication**: JWT-based session management.
- **RBAC (Role-Based Access Control)**: Granular permissions for Admins, Compliance Officers, and Legal Teams.
- **Data Privacy**: Vector embeddings are strictly partitioned by `organization_id` to ensure tenant isolation.
- **Audit Logs**: All AI agent actions and database mutations are immutably logged for forensic auditing.

---

## 🌍 Deployment

The RIO platform is optimized for modern cloud-native environments:

- **Frontend**: Configured for edge deployment on **Vercel** or Netlify.
- **Backend API**: Deployed as serverless Python functions on **Vercel** via `@vercel/python` (defined in `vercel.json`).
- **Database**: Compatible with managed PostgreSQL instances like **Supabase**, Neon, or AWS RDS.
- **Vector DB**: Designed for **Qdrant Cloud** serverless clusters.
- **Production CI/CD**: Seamless GitHub Actions workflows ensure test coverage and build stability before edge deployments.

---

## 🤝 Contributing

We welcome contributions from compliance professionals, AI engineers, and security researchers. 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
