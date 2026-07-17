import os
import sys
import datetime
from sqlalchemy.orm import Session

# Ensure app context is loaded
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from app.database.connection import engine, Base, SessionLocal
from app.database.models import (
    Organization, 
    User, 
    Regulation, 
    RegulationVersion, 
    Watchlist, 
    ComplianceTask, 
    Policy,
    ControlMapping
)

def seed_database():
    print("[Seed] Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Check if database is already seeded
        if db.query(Organization).first() is not None:
            print("[Seed] Database already seeded. Skipping.")
            return

        print("[Seed] Seeding data...")
        
        # 1. Seed Organization
        org = Organization(
            name="Fintech Sandbox Org",
            industry="Financial Services / Payments",
            company_size="120",
            geographies=["IN", "US", "EU"]
        )
        db.add(org)
        db.flush() # Populate org.id
        
        # 2. Seed User
        user = User(
            id="user_clerk_sandbox_101",
            organization_id=org.id,
            email="iamniteshsahu20@gmail.com",
            first_name="Nitesh",
            last_name="Sahu",
            role="admin"
        )
        db.add(user)
        
        # 3. Seed Regulations
        reg_dpdp = Regulation(
            title="DPDP Data Consent Architecture Framework",
            authority="RBI / MEITY",
            country_code="IN",
            category="Privacy",
            source_url="https://meity.gov.in/dpdp"
        )
        reg_ftc = Regulation(
            title="FTC Safeguards Rule on Consumer Data Security",
            authority="FTC",
            country_code="US",
            category="Cybersecurity",
            source_url="https://ftc.gov/safeguards"
        )
        reg_eu_ai = Regulation(
            title="EU AI Act General Purpose AI Model Amendment",
            authority="EU Parliament",
            country_code="EU",
            category="Artificial Intelligence",
            source_url="https://artificialintelligenceact.eu"
        )
        reg_sec = Regulation(
            title="SEC Cyber Risk Disclosure Form 8-K Update",
            authority="SEC",
            country_code="US",
            category="Cybersecurity",
            source_url="https://sec.gov/guideline/cyber-disclosure"
        )
        db.add_all([reg_dpdp, reg_ftc, reg_eu_ai, reg_sec])
        db.flush()

        # 4. Seed Regulation Versions
        v_dpdp = RegulationVersion(
            regulation_id=reg_dpdp.id,
            version_tag="2026.1",
            effective_date=datetime.date(2026, 1, 1),
            publication_date=datetime.date(2025, 12, 1),
            commit_summary="Initial operational consent standard framework released for consent managers.",
            is_active=True
        )
        v_ftc = RegulationVersion(
            regulation_id=reg_ftc.id,
            version_tag="2026.2",
            effective_date=datetime.date(2026, 6, 1),
            publication_date=datetime.date(2026, 4, 15),
            commit_summary="Amended rules for notification of customer records breach exceeding 500 records.",
            is_active=True
        )
        v_sec = RegulationVersion(
            regulation_id=reg_sec.id,
            version_tag="2026.1",
            effective_date=datetime.date(2026, 7, 1),
            publication_date=datetime.date(2026, 5, 20),
            commit_summary="Amended guidelines requiring inline XBRL tagging of material cybersecurity events.",
            is_active=True
        )
        db.add_all([v_dpdp, v_ftc, v_sec])

        # 5. Seed Watchlists
        wl = Watchlist(
            organization_id=org.id,
            name="Global Data Privacy Laws",
            categories=["Privacy", "Cybersecurity"],
            countries=["IN", "EU", "US"],
            active=True
        )
        db.add(wl)

        # 6. Seed Policies
        policy_privacy = Policy(
            organization_id=org.id,
            title="Corporate Privacy Policy v1.4.pdf",
            content=(
                "# Corporate Privacy Policy\n"
                "Section 1.1: We collect customer metadata for transaction logging.\n"
                "Section 4.1: User consent logs are stored in our databases indefinitely to support fraud detection runs."
            ),
            version_tag="1.4.0"
        )
        policy_security = Policy(
            organization_id=org.id,
            title="Database & Data Security controls.md",
            content=(
                "# Database Control Standards\n"
                "Standard 2.4: All data at rest must use cryptographic safety keys.\n"
                "Standard 4.2: Customer credentials and personal logs database tables must employ AES-128 encryption algorithm."
            ),
            version_tag="1.0.0"
        )
        db.add_all([policy_privacy, policy_security])
        db.flush()

        # 7. Seed Compliance Gaps / Tasks
        task_1 = ComplianceTask(
            organization_id=org.id,
            regulation_id=reg_dpdp.id,
            title="Inadequate Data Retention Policy",
            description=(
                "Your Privacy Policy permits indefinite data storage. Under the DPDP Act Section 11, "
                "personal data must be erased as soon as the purpose for collection is served."
            ),
            severity="HIGH",
            status="open",
            remediation_plan="Revise 'Corporate Privacy Policy' to add a 7-year retention maximum clause for consent logs.",
            due_date=datetime.date(2026, 12, 31)
        )
        task_2 = ComplianceTask(
            organization_id=org.id,
            regulation_id=reg_sec.id,
            title="Database Encryption Key Strength Discrepancy",
            description=(
                "Your current controls specify AES-128 encryption. The revised SEC guidelines require "
                "AES-256 for public-facing database instances."
            ),
            severity="CRITICAL",
            status="open",
            remediation_plan="Upgrade AWS KMS key parameters and migrate all database cluster encryption configurations.",
            due_date=datetime.date(2026, 9, 30)
        )
        db.add_all([task_1, task_2])
        
        # 8. Control Mapping
        map_1 = ControlMapping(
            policy_id=policy_privacy.id,
            regulation_id=reg_dpdp.id,
            compliance_status="gap",
            confidence_score=0.88
        )
        map_2 = ControlMapping(
            policy_id=policy_security.id,
            regulation_id=reg_sec.id,
            compliance_status="gap",
            confidence_score=0.91
        )
        db.add_all([map_1, map_2])
        
        db.commit()
        print("[Seed] Successfully seeded compliance sandbox environment!")
    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
