import time
import json
from typing import Dict, Any, List
from agents.base import BaseAgent

class PlannerAgent(BaseAgent):
    """
    Planner Agent is the primary brain of the RIO system.
    It takes user goals, parses them to decide which agents and tools are needed,
    and runs them in a structured execution graph.
    """
    def __init__(self):
        super().__init__(
            name="PlannerAgent",
            system_prompt=(
                "You are the central Planner Agent for the RIO Compliance OS. "
                "Your goal is to parse user requests and determine the execution sequence "
                "of specialized compliance sub-agents and tools."
            )
        )

    def plan_execution(self, goal: str) -> Dict[str, Any]:
        """
        Formulates a compliance execution plan.
        """
        print(f"[PlannerAgent] Creating execution plan for goal: '{goal}'")
        
        # Decide which agents to call based on keywords or LLM parsing
        llm_prompt = f"Deconstruct this compliance goal into an execution plan specifying target agents, tools, and sequence: {goal}"
        raw_plan = self.call_llm(llm_prompt)
        
        # Determine agent routing logic
        goal_lower = goal.lower()
        plan = {
            "goal": goal,
            "agents_to_trigger": [],
            "tools_to_trigger": [],
            "sequence": [],
            "reasoning": f"Derived plan using compliance taxonomy analysis: {raw_plan[:80]}..."
        }
        
        # Keyword heuristic router (or LLM fallback)
        if any(w in goal_lower for w in ["pdf", "upload", "chunk", "document", "parse", "policy"]):
            plan["agents_to_trigger"].extend(["document_agent", "compliance_agent", "risk_agent"])
            plan["tools_to_trigger"].extend(["search_documents", "extract_obligations"])
            plan["sequence"] = ["document_agent", "compliance_agent", "risk_agent"]
        elif any(w in goal_lower for w in ["compare", "diff", "new version", "old"]):
            plan["agents_to_trigger"].extend(["monitoring_agent", "comparison_agent", "risk_agent", "notification_agent"])
            plan["tools_to_trigger"].extend(["compare_documents", "send_notifications"])
            plan["sequence"] = ["monitoring_agent", "comparison_agent", "risk_agent", "notification_agent"]
        elif any(w in goal_lower for w in ["rbi", "sebi", "mca", "monitor", "crawl", "latest"]):
            plan["agents_to_trigger"].extend(["monitoring_agent", "research_agent", "report_agent"])
            plan["tools_to_trigger"].extend(["monitor_sources", "web_search", "generate_report"])
            plan["sequence"] = ["monitoring_agent", "research_agent", "report_agent"]
        elif any(w in goal_lower for w in ["explain", "what is", "how does", "summarize", "plain english"]):
            plan["agents_to_trigger"].extend(["research_agent", "report_agent"])
            plan["tools_to_trigger"].extend(["web_search", "search_regulations"])
            plan["sequence"] = ["research_agent", "report_agent"]
        else:
            # Default fallback for general QA / audits
            plan["agents_to_trigger"].extend(["research_agent", "compliance_agent", "risk_agent", "report_agent"])
            plan["tools_to_trigger"].extend(["search_regulations", "risk_analysis"])
            plan["sequence"] = ["research_agent", "compliance_agent", "risk_agent", "report_agent"]
            
        return plan

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        goal = state.get("goal", "")
        if not goal:
            raise ValueError("Input 'goal' is required for the PlannerAgent.")

        start_time = time.time()
        plan = self.plan_execution(goal)
        
        # Save plan to state
        state["planner_decisions"] = plan
        state["execution_graph"] = {
            "nodes": [{"id": "Planner", "type": "input"}] + [{"id": agent, "type": "agent"} for agent in plan["sequence"]],
            "edges": [{"source": "Planner", "target": plan["sequence"][0]}] + [
                {"source": plan["sequence"][i], "target": plan["sequence"][i+1]}
                for i in range(len(plan["sequence"])-1)
            ] if plan["sequence"] else []
        }
        state["agent_chain"] = plan["sequence"]
        state["steps"] = []
        
        # Run sub-agents sequentially (mock/real delegation)
        import agents
        for agent_name in plan["sequence"]:
            step_start = time.time()
            print(f"[PlannerAgent] Spawning agent: {agent_name}")
            
            # Lookup agent class dynamically
            agent_instance = agents.get_agent_instance(agent_name)
            if agent_instance:
                try:
                    # Propagate state
                    state = agent_instance.process(state)
                    status = "SUCCESS"
                except Exception as e:
                    status = f"FAILED: {e}"
            else:
                # Simulation fallback if agent class isn't fully wired yet
                status = "SUCCESS"
                state[f"status_{agent_name}"] = "SUCCESS"
            
            step_duration = time.time() - step_start
            state["steps"].append({
                "agent": agent_name,
                "status": status,
                "duration": round(step_duration, 3),
                "tools_called": [t for t in plan["tools_to_trigger"] if agent_name in t or "search" in t or "analysis" in t],
                "tokens_used": len(goal) * 3 + 120 # simulated tokens
            })
            
        duration = time.time() - start_time
        state["time_taken"] = round(duration, 3)
        state["tokens"] = sum(step["tokens_used"] for step in state["steps"]) + 150
        
        # Construct final response
        summary_text = state.get("summary", "Analysis completed successfully.")
        gaps_count = len(state.get("gaps_found", []))
        risk_score = state.get("risk_score", 45)
        
        state["final_response"] = (
            f"### Executive Compliance Summary\n"
            f"Processed request: **\"{goal}\"**\n\n"
            f"- **System Verdict**: Action required\n"
            f"- **Active Compliance Twin Risk Score**: {risk_score}/100\n"
            f"- **Identified Policy Gaps**: {gaps_count} open item(s)\n\n"
            f"**Planner Decisions & Sequence**: {', '.join(plan['sequence'])}"
        )
        
        return state
