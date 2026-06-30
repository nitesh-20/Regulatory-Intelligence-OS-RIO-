# RIO Agent (Regulatory Intelligence Operating System)

RIO Agent is an enterprise-grade Agentic Regulatory Intelligence Platform. It monitors global regulatory bodies, parses documents, reasons through compliance twin policies, runs audit simulations, and triggers automated workflows (Jira, Slack, Linear) using a resilient multi-agent network.

---

## 1. Monorepo Structure

```
rio-agent/
├── frontend/             # React (Vite) + Tailwind CSS SPA Client
├── backend/              # FastAPI python backend API
├── agents/               # LangGraph multi-agent logic stubs (Shared)
├── workflows/            # Temporal background workflow stubs (Shared)
├── database/             # PostgreSQL schema DDL files
├── docs/                 # Architectural and Agent specifications
├── docker-compose.yml    # Development stack orchestration config
├── package.json          # Root npm script workspace mapping
└── README.md             # Startup and connection guidelines
```

---

## 2. Quickstart & Local Setup

### System Prerequisites
* Node.js v18+
* Python v3.11+
* Docker & Docker Compose

### Step 1: Clone and Bootstrap Environment
```bash
# Clone the repository
git clone https://github.com/nitesh-20/Regulatory-Intelligence-OS-RIO-.git
cd Regulatory-Intelligence-OS-RIO-

# Set up local environment variables
cp .env.example .env
```
Open `.env` and fill in your connection strings and API keys.

### Step 2: Bootstrap Dependencies
You can install both the frontend node modules and backend pip packages using the root npm workspace command:
```bash
npm run bootstrap
```

### Step 3: Run the Development Servers
Launch both the React dev frontend (port 3000) and the FastAPI reload api server (port 8000) concurrently:
```bash
npm run dev:all
```

---

## 3. Database & Authentication Setup

### PostgreSQL Setup
1.  Launch the PostgreSQL service container:
    ```bash
    docker-compose up -d postgres
    ```
2.  Initialize the schemas using the DDL script:
    ```bash
    psql -h localhost -U rio_user -d rio_db -f database/schema.sql
    ```
    *(Password defaults to `rio_password` as defined in `docker-compose.yml`)*

### Qdrant Vector DB Setup
1.  Launch the Qdrant database:
    ```bash
    docker-compose up -d qdrant
    ```
2.  Qdrant dashboards can be accessed at `http://localhost:6333/dashboard`.
3.  Vector embeddings of regulations can be pushed to collections via `qdrant-client` using the keys defined in the Python database modules.

### Clerk Authentication Configuration
1.  Register an account at [Clerk.com](https://clerk.com).
2.  Create a new application named `RIO Agent`.
3.  Copy the publishable and secret keys from the API keys section.
4.  Paste them into the `.env` settings parameters:
    ```env
    CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    ```

---

## 4. GitHub Deployment Guidelines

To push this codebase to a new GitHub repository:

```bash
git init
git add .
git commit -m "Initial scaffold of RIO Agent platform architecture"
git branch -M main
git remote add origin https://github.com/nitesh-20/Regulatory-Intelligence-OS-RIO-.git
git push -u origin main
```
