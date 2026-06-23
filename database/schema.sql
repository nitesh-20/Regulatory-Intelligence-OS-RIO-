-- RIO Agent Database Initialization Schema
-- Target: PostgreSQL 15+

-- Extension Setup
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    company_size VARCHAR(50) NOT NULL,
    geographies VARCHAR(50)[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users (Auth via Clerk)
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, -- Clerk User ID
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'member', -- admin, billing, member
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Regulations Global Directory
CREATE TABLE regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(512) NOT NULL,
    authority VARCHAR(255) NOT NULL, -- e.g. SEC, RBI, FTC
    country_code VARCHAR(10) NOT NULL, -- ISO Alpha-2
    category VARCHAR(100) NOT NULL, -- Privacy, Cyber, Financial, AI
    source_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Regulation Versions (Regulation GitHub)
CREATE TABLE regulation_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
    version_tag VARCHAR(50) NOT NULL, -- e.g. '2026.1'
    effective_date DATE NOT NULL,
    publication_date DATE NOT NULL,
    commit_summary TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Watchlists (User Custom Subscriptions)
CREATE TABLE watchlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    categories VARCHAR(100)[] DEFAULT '{}',
    countries VARCHAR(10)[] DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Compliance Gaps & Tasks (Compliance Twin)
CREATE TABLE compliance_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    regulation_id UUID REFERENCES regulations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(50) DEFAULT 'open', -- open, in_progress, resolved, accepted_risk
    remediation_plan TEXT,
    external_ticket_id VARCHAR(255), -- Jira/Linear ticket mapping
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Audit Reports
CREATE TABLE audit_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    framework_name VARCHAR(100) NOT NULL, -- DORA, GDPR, SEC
    readiness_score INT CHECK (readiness_score BETWEEN 0 AND 100),
    simulated_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
    evidence_payload JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    channel VARCHAR(50) NOT NULL, -- Slack, Email, Discord
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Multi-Agent Run Audits
CREATE TABLE agent_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    run_status VARCHAR(50) DEFAULT 'running', -- running, completed, failed
    execution_steps JSONB DEFAULT '[]',
    tokens_consumed INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for Query Performance
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_regulations_cat_country ON regulations(category, country_code);
CREATE INDEX idx_reg_versions_active ON regulation_versions(regulation_id) WHERE is_active = TRUE;
CREATE INDEX idx_compliance_tasks_org_status ON compliance_tasks(organization_id, status);
CREATE INDEX idx_audit_reports_org ON audit_reports(organization_id);
CREATE INDEX idx_agent_runs_org ON agent_runs(organization_id, agent_name);
