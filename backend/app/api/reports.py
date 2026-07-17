import io
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException, Depends
# pyrefly: ignore [missing-import]
from fastapi.responses import StreamingResponse
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

from app.database.connection import get_db
from app.database.models import Organization, ComplianceTask

router = APIRouter()

@router.get("/generate")
def generate_pdf_report(db: Session = Depends(get_db)):
    try:
        # Fetch active organization
        org = db.query(Organization).first()
        if not org:
            from app.database.seed import seed_database
            seed_database()
            org = db.query(Organization).first()
        if not org:
            raise HTTPException(status_code=500, detail="Organization not seeded.")

        # Fetch open tasks
        tasks = db.query(ComplianceTask).filter(
            ComplianceTask.organization_id == org.id,
            ComplianceTask.status == "open"
        ).all()

        # Calculate readiness score
        # 100 - (CRITICAL * 30 + HIGH * 20 + MEDIUM * 10)
        penalty = 0
        for t in tasks:
            sev = t.severity.upper()
            if sev == "CRITICAL":
                penalty += 30
            elif sev == "HIGH":
                penalty += 20
            elif sev == "MEDIUM":
                penalty += 10
            else:
                penalty += 5
        readiness_score = max(0, 100 - penalty)

        # Create BytesIO buffer to host the compiled PDF
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
        )
        
        styles = getSampleStyleSheet()
        
        # Define premium custom color palette
        primary_color = colors.HexColor("#0f172a") # Slate 900
        accent_color = colors.HexColor("#3b82f6")  # Blue 500
        text_color = colors.HexColor("#334155")    # Slate 700
        
        # Styles
        title_style = ParagraphStyle(
            'DocTitle',
            parent=styles['Heading1'],
            fontSize=24,
            leading=28,
            textColor=primary_color,
            spaceAfter=15
        )
        subtitle_style = ParagraphStyle(
            'DocSub',
            parent=styles['Normal'],
            fontSize=11,
            leading=14,
            textColor=text_color,
            spaceAfter=30
        )
        section_style = ParagraphStyle(
            'DocSec',
            parent=styles['Heading2'],
            fontSize=16,
            leading=20,
            textColor=primary_color,
            spaceBefore=15,
            spaceAfter=10
        )
        body_style = ParagraphStyle(
            'DocBody',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=text_color
        )
        bold_body_style = ParagraphStyle(
            'DocBoldBody',
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            textColor=primary_color,
            fontName="Helvetica-Bold"
        )
        
        elements = []
        
        # Header banner
        elements.append(Paragraph("RIO Compliance Intelligence Executive Report", title_style))
        elements.append(Paragraph(
            f"Generated on: 2026-07-17 | Tenant Organization: <b>{org.name}</b><br/>"
            f"Industry Scope: {org.industry} | Geographies Covered: {', '.join(org.geographies)}",
            subtitle_style
        ))
        
        # Score metrics table
        score_data = [
            [Paragraph("RIO Readiness Score", bold_body_style), Paragraph(f"<b>{readiness_score}%</b>", bold_body_style)],
            [Paragraph("Active Compliance Gaps", body_style), Paragraph(f"{len(tasks)} items", body_style)],
            [Paragraph("Audit Verdict", body_style), Paragraph("Action Required" if readiness_score < 90 else "Fully Compliant", body_style)]
        ]
        score_table = Table(score_data, colWidths=[200, 100])
        score_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('TEXTCOLOR', (0,0), (-1,-1), text_color),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,-1), 'Helvetica'),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#e2e8f0")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ]))
        elements.append(score_table)
        elements.append(Spacer(1, 20))
        
        # Section 2: Gaps checklist
        elements.append(Paragraph("Identified Regulatory Discrepancies & Tasks", section_style))
        
        if not tasks:
            elements.append(Paragraph("No active gaps identified. System is fully compliant.", body_style))
        else:
            table_data = [
                [
                    Paragraph("<b>Discrepancy / Gap</b>", bold_body_style),
                    Paragraph("<b>Severity</b>", bold_body_style),
                    Paragraph("<b>Remediation Plan</b>", bold_body_style)
                ]
            ]
            for t in tasks:
                # Color code severity
                sev_color = "#ef4444" if t.severity == "CRITICAL" else ("#f97316" if t.severity == "HIGH" else "#eab308")
                table_data.append([
                    Paragraph(f"<b>{t.title}</b><br/>{t.description}", body_style),
                    Paragraph(f"<font color='{sev_color}'><b>{t.severity}</b></font>", body_style),
                    Paragraph(t.remediation_plan or "No direct plan defined yet.", body_style)
                ])
                
            task_table = Table(table_data, colWidths=[200, 70, 260])
            task_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 10),
                ('TOPPADDING', (0,0), (-1,-1), 10),
                ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
                ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ]))
            elements.append(task_table)
            
        elements.append(Spacer(1, 30))
        elements.append(Paragraph("<i>End of Report. Confidential regulatory briefing produced autonomously by RIO.</i>", body_style))
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=rio_compliance_report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF Compilation failed: {str(e)}")
