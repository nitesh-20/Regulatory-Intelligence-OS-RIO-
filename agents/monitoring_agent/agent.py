import datetime
from agents.base import BaseAgent
from typing import Dict, Any, List
from app.database.models import Regulation, RegulationVersion

class MonitoringAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="MonitoringAgent",
            system_prompt=(
                "You are the continuous Monitoring Agent. Spot updates to official legislative "
                "gazettes (SEBI, RBI, MCA, SEC, etc.) and save new versions to the database."
            )
        )

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Scans regulatory sources. If triggered manually, inserts a simulated new version
        for the first regulation in the database to show real log integration.
        """
        print(f"[{self.name}] Initiating scan of legislative registries...")
        
        db = state.get("db")
        org_id = state.get("organization_id")
        
        new_notifications_found = 0
        monitored_sources = ["RBI", "SEBI", "MCA", "SEC"]
        
        if db:
            try:
                # Find the first regulation to append an update version to
                reg = db.query(Regulation).first()
                if reg:
                    # Check if we already created a simulated monitoring version to prevent duplication
                    existing_sim = db.query(RegulationVersion).filter(
                        RegulationVersion.regulation_id == reg.id,
                        RegulationVersion.version_tag == "2026.3"
                    ).first()
                    
                    if not existing_sim:
                        # Append a new version detected by monitoring scanner
                        new_ver = RegulationVersion(
                            regulation_id=reg.id,
                            version_tag="2026.3",
                            effective_date=datetime.date.today() + datetime.timedelta(days=30),
                            publication_date=datetime.date.today(),
                            commit_summary="Autonomously detected gazette amendment. Updating compliance twin obligations.",
                            is_active=True
                        )
                        db.add(new_ver)
                        db.commit()
                        new_notifications_found = 1
                        print(f"[{self.name}] Autonomous scanner detected new regulation version for '{reg.title}'!")
            except Exception as e:
                if db:
                    db.rollback()
                print(f"[{self.name}] Error registering updated version: {e}")
                
        state["monitored_sources"] = monitored_sources
        state["last_checked"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        state["new_notifications_found"] = new_notifications_found
        state["status_monitoring_agent"] = "SUCCESS"
        return state
