import datetime
import uuid
from sqlalchemy import (
    Column, 
    String, 
    Integer, 
    Boolean, 
    Date, 
    DateTime, 
    ForeignKey, 
    Text, 
    Numeric, 
    JSON
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.connection import Base

# Helper to support UUID in both Postgres and SQLite fallbacks
def get_uuid_type():
    return String(36)

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    industry = Column(String(100), nullable=False)
    company_size = Column(String(50), nullable=False)
    geographies = Column(JSON, nullable=False, default=list) # Stored as JSON list for SQLite compatibility
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    users = relationship("User", back_populates="organization")
    watchlists = relationship("Watchlist", back_populates="organization")
    tasks = relationship("ComplianceTask", back_populates="organization")
    reports = relationship("AuditReport", back_populates="organization")
    policies = relationship("Policy", back_populates="organization")

class User(Base):
    __tablename__ = "users"

    id = Column(String(255), primary_key=True) # Clerk User ID
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    email = Column(String(255), unique=True, nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    role = Column(String(50), nullable=False, default="member")
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="users")

class Regulation(Base):
    __tablename__ = "regulations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(512), nullable=False)
    authority = Column(String(255), nullable=False)
    country_code = Column(String(10), nullable=False)
    category = Column(String(100), nullable=False)
    source_url = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    versions = relationship("RegulationVersion", back_populates="regulation", cascade="all, delete-orphan")
    tasks = relationship("ComplianceTask", back_populates="regulation")

class RegulationVersion(Base):
    __tablename__ = "regulation_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    regulation_id = Column(String(36), ForeignKey("regulations.id", ondelete="CASCADE"), nullable=False)
    version_tag = Column(String(50), nullable=False)
    effective_date = Column(Date, nullable=False)
    publication_date = Column(Date, nullable=False)
    commit_summary = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    regulation = relationship("Regulation", back_populates="versions")

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    categories = Column(JSON, default=list)
    countries = Column(JSON, default=list)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="watchlists")

class ComplianceTask(Base):
    __tablename__ = "compliance_tasks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    regulation_id = Column(String(36), ForeignKey("regulations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    status = Column(String(50), default="open") # open, in_progress, resolved
    remediation_plan = Column(Text, nullable=True)
    external_ticket_id = Column(String(255), nullable=True)
    due_date = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="tasks")
    regulation = relationship("Regulation", back_populates="tasks")

class AuditReport(Base):
    __tablename__ = "audit_reports"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    framework_name = Column(String(100), nullable=False)
    readiness_score = Column(Integer, nullable=False)
    simulated_by = Column(String(255), nullable=True)
    evidence_payload = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="reports")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    channel = Column(String(50), nullable=False) # Slack, Email, Discord
    status = Column(String(50), default="pending")
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    agent_name = Column(String(100), nullable=False)
    run_status = Column(String(50), default="running")
    execution_steps = Column(JSON, default=list)
    tokens_consumed = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    version_tag = Column(String(50), default="1.0.0")
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    organization = relationship("Organization", back_populates="policies")

class ControlMapping(Base):
    __tablename__ = "control_mappings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    policy_id = Column(String(36), ForeignKey("policies.id", ondelete="CASCADE"), nullable=False)
    regulation_id = Column(String(36), ForeignKey("regulations.id", ondelete="CASCADE"), nullable=False)
    compliance_status = Column(String(50), default="compliant")
    confidence_score = Column(Numeric(3, 2), default=1.00)
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class EvaluationLog(Base):
    __tablename__ = "evaluation_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    query = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    faithfulness = Column(Numeric(3, 2), nullable=False)
    groundedness = Column(Numeric(3, 2), nullable=False)
    context_precision = Column(Numeric(3, 2), nullable=False)
    citation_accuracy = Column(Numeric(3, 2), nullable=False)
    confidence_score = Column(Numeric(3, 2), nullable=False)
    iterations = Column(Integer, default=1)
    escalation_status = Column(String(50), default="none")
    created_at = Column(DateTime(timezone=True), default=datetime.datetime.utcnow)
