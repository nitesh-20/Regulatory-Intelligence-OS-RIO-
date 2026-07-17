# RIO (Regulatory Intelligence Operating System)

> **"The AI Operating System for Regulatory Intelligence and Compliance."**

RIO is an enterprise-grade agentic regulatory intelligence platform. It autonomously monitors global regulatory bodies, deconstructs circulars, parses policies, flags compliance gaps, and runs audit simulations using a resilient multi-agent network.

---

## 1. Monorepo Structure

```
rio-agent/
├── frontend/             # React (Vite) + TypeScript + Tailwind CSS Client
├── backend/              # FastAPI Python Gateway
├── agents/               # Autonomous AI agent sub-packages (Shared Core)
│   ├── base.py           # Core BaseAgent class with google-genai
│   ├── planner_agent/    # Orchestrator & sequence builder
│   ├── search_agent/     # Web search & registry scraper
│   ├── compliance_agent/ # Twin policy gap mapper
│   ├── risk_agent/       # Criticality & exposure scorer
│   ├── document_agent/   # OCR & obligation extractor
│   ├── comparison_agent/ # Document version diff comparator
│   └── ...
├── database/             # PostgreSQL DDL schemas
├── docs/                 # Architectural specifications
└── docker-compose.yml    # Development stack orchestration config
```

---

## 2. Multi-Agent Reasoning Architecture

Unlike simple CRUD apps, every action in RIO is evaluated by a collaborative chain of autonomous specialists:

```
                  [User Inquiry]
                        │
                        ▼
                [Planner Agent] (Brain)
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
  [Search Agent] [Document Agent] [Risk Agent]
         │              │              │
         └──────────────┼──────────────┘
                        ▼
            [Compliance Twin Agent]
                        │
                        ▼
               [Qdrant Vector DB]
```

---

## 3. Quickstart & Local Setup

### System Prerequisites
* Node.js v18+
* Python v3.11+

### Step 1: Clone and Bootstrap Environment
```bash
git clone https://github.com/nitesh-20/Regulatory-Intelligence-OS-RIO-.git
cd Regulatory-Intelligence-OS-RIO-
cp .env.example .env
```
Open `.env` and fill in your `GEMINI_API_KEY`.

### Step 2: Bootstrap Dependencies
Install the frontend node modules and backend pip packages using the monorepo script:
```bash
npm run bootstrap
```

### Step 3: Run the Development Servers
Launch both the React dev frontend and the FastAPI reload api server concurrently:
```bash
npm run dev:all
```
The terminal console will load at **`http://localhost:3001`**.

---

## 4. Documentation Catalog

For in-depth architectural and agent design, consult our documentation sub-folder:
*   [SystemDesign.md](file:///Users/niteshsahu/Desktop/RIO%20Agent/docs/SystemDesign.md): Sequence flows and Mermaid charts.
*   [AI-Agents.md](file:///Users/niteshsahu/Desktop/RIO%20Agent/docs/AI-Agents.md): Detailed configurations for the multi-agent mesh.
*   [RAG.md](file:///Users/niteshsahu/Desktop/RIO%20Agent/docs/RAG.md): Vector chunking standards and self-correcting retrieval protocols.
