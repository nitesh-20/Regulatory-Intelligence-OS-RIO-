from agents.base import BaseAgent
from agents.planner_agent.agent import PlannerAgent
from agents.search_agent.agent import SearchAgent
from agents.compliance_agent.agent import ComplianceAgent
from agents.risk_agent.agent import RiskAgent
from agents.document_agent.agent import DocumentAgent
from agents.comparison_agent.agent import ComparisonAgent
from agents.report_agent.agent import ReportAgent
from agents.notification_agent.agent import NotificationAgent
from agents.research_agent.agent import ResearchAgent
from agents.monitoring_agent.agent import MonitoringAgent

_instances = {}

def get_agent_instance(agent_name: str) -> BaseAgent:
    """
    Retrieves a cached instance of the requested agent by name.
    """
    # Normalize naming
    normalized_name = agent_name.lower().replace(" ", "_")
    if not normalized_name.endswith("_agent"):
        normalized_name = f"{normalized_name}_agent"
        
    if normalized_name in _instances:
        return _instances[normalized_name]
    
    if normalized_name == "planner_agent":
        _instances[normalized_name] = PlannerAgent()
    elif normalized_name == "search_agent":
        _instances[normalized_name] = SearchAgent()
    elif normalized_name == "compliance_agent":
        _instances[normalized_name] = ComplianceAgent()
    elif normalized_name == "risk_agent":
        _instances[normalized_name] = RiskAgent()
    elif normalized_name == "document_agent":
        _instances[normalized_name] = DocumentAgent()
    elif normalized_name == "comparison_agent":
        _instances[normalized_name] = ComparisonAgent()
    elif normalized_name == "report_agent":
        _instances[normalized_name] = ReportAgent()
    elif normalized_name == "notification_agent":
        _instances[normalized_name] = NotificationAgent()
    elif normalized_name == "research_agent":
        _instances[normalized_name] = ResearchAgent()
    elif normalized_name == "monitoring_agent":
        _instances[normalized_name] = MonitoringAgent()
    else:
        return None
        
    return _instances[normalized_name]
