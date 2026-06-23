# RIO Agent Multi-Agent Network Specifications

This document outlines the tasks, capabilities, input inputs, and expected outputs for each of the 9 agents orchestrating within the RIO Agent system.

---

## 1. Multi-Agent Collaborative Diagram

```
[Government Gazette]
       |
       v
+------v-----------------+      +------------------------+      +------------------------+
| SourceDiscoveryAgent  | ---> |    MonitoringAgent     | ---> |    ExtractionAgent     |
| (Finds URL links)      |      |  (Deduplicates files)  |      |   (Raw to Markdown)    |
+------------------------+      +------------------------+      +-----------+------------+
                                                                            |
                                                                            v
+------------------------+      +------------------------+      +-----------v------------+
|  LegalReasoningAgent   | <--- |  ClassificationAgent   | <--- |   ImpactAnalysisAgent  |
| (Translates jargon)    |      | (Categorizes metadata) |      |   (Sector mapping)     |
+----------+-------------+      +------------------------+      +------------------------+
           |
           v
+----------v-------------+      +------------------------+      +------------------------+
|  ComplianceTwinAgent   | ---> |  AuditSimulationAgent  | ---> |  RecommendationAgent   |
| (Identifies gaps)      |      |  (Mock control audits) |      | (Builds 30/90 roadmap) |
+------------------------+      +------------------------+      +------------------------+
```

---

## 2. Agent Reference Catalog

### 1. SourceDiscoveryAgent
*   **Purpose**: Discovers new circulars, announcements, and PDFs from registered official regulatory registers.
*   **Input**: Seed list of root regulatory source pages.
*   **Output**: Stream of raw URLs and page metadata.

### 2. MonitoringAgent
*   **Purpose**: Inspects incoming URLs and hashes to determine if they correspond to brand new regulations or modifications to existing acts.
*   **Input**: Crawled page hashes.
*   **Output**: Relational lookup flags (`is_update` status and parent Regulation UUIDs).

### 3. ExtractionAgent
*   **Purpose**: Downloads PDFs or raw HTML, strips away noise (ads, scripts, footnotes), and reformats text content into clean structured markdown.
*   **Input**: Raw HTML or document blobs.
*   **Output**: Document Markdown with clear headers and clause references.

### 4. ClassificationAgent
*   **Purpose**: Categorizes the document based on taxonomy terms, active industry fields, jurisdictions of operation, and authority tags.
*   **Input**: Document Markdown.
*   **Output**: Taxonomy tag array, Category string, Jurisdiction, Country Code.

### 5. ImpactAnalysisAgent
*   **Purpose**: Identifies which target enterprise profiles are affected by checking categories, company size thresholds, and regions.
*   **Input**: Classification parameters.
*   **Output**: Applicability conditions (`affected_industries` list, `company_size` targets).

### 6. LegalReasoningAgent
*   **Purpose**: Converts complex legalese into short summaries, listing explicit business requirements and potential penalty risks.
*   **Input**: Document Markdown.
*   **Output**: Business Summary, List of Requirements, Risk evaluation metrics.

### 7. ComplianceTwinAgent
*   **Purpose**: Connects to the enterprise policy vector index in Qdrant, compares regulation requirements, and logs gaps.
*   **Input**: Legal obligations + target client org ID.
*   **Output**: Mapped policies and compliance gaps table logs.

### 8. AuditSimulationAgent
*   **Purpose**: Simulates automated audits, validates mock control checks, and calculates overall readiness scores.
*   **Input**: Compliance Twin configuration + active gaps.
*   **Output**: Control audit outcome logs (Pass/Fail/Warning), Readiness score (0-100).

### 9. RecommendationAgent
*   **Purpose**: Builds action item roadmap tasks (Jira/Linear ticket configurations) to resolve gaps.
*   **Input**: Active gaps.
*   **Output**: Immediate actions, 30-day/90-day task schemas.
