# Planner Agent

The Planner Agent acts as the central router and deconstructor of RIO. 

## Capabilities
1. Parses high-level goals into component-level actions.
2. Identifies downstream agents (`document_agent`, `risk_agent`, `compliance_agent`, etc.) required to satisfy the goal.
3. Coordinates parallel and sequential workflows.
4. Generates structural execution telemetry showing latency, tool executions, and step parameters.
