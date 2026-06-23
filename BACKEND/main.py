
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="LegalIntel AI - Contract Intelligence Platform")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractDocument(BaseModel):
    id: Optional[str] = None
    name: str
    content: str
    type: Optional[str] = None
    size: Optional[int] = None
    uploadedAt: Optional[datetime] = None

class ExtractedClause(BaseModel):
    id: str
    type: str
    content: str
    pageNumber: Optional[int] = None
    confidence: float

class Risk(BaseModel):
    id: str
    title: str
    description: str
    level: str
    category: str
    evidence: Optional[str] = None

class Conflict(BaseModel):
    id: str
    type: str
    description: str
    document1: str
    document2: str
    location1: Optional[str] = None
    location2: Optional[str] = None
    severity: str

class RedlineSuggestion(BaseModel):
    id: str
    currentClause: str
    suggestedClause: str
    businessImpact: str
    riskSeverity: str
    rationale: str

class TimelineEvent(BaseModel):
    id: str
    title: str
    date: datetime
    type: str
    description: str

class AIInsights(BaseModel):
    topRisks: List[Risk]
    recommendedActions: List[str]
    negotiationPoints: List[str]
    executiveSummary: str
    keyObligations: List[str]
    criticalDeadlines: List[TimelineEvent]

class ContractSummary(BaseModel):
    overview: str
    parties: List[str]
    keyObligations: List[str]

class DealReadiness(BaseModel):
    score: int
    pendingApprovals: int
    complianceGaps: int
    missingDocuments: List[str]
    requiredActions: List[str]

class DocumentStats(BaseModel):
    totalDocuments: int
    pagesProcessed: int
    clausesExtracted: int
    risksIdentified: int

class AnalysisRequest(BaseModel):
    primary_contract: ContractDocument
    supporting_documents: List[ContractDocument]
    enterprise_context: List[ContractDocument]

class AnalysisResponse(BaseModel):
    contractSummary: ContractSummary
    extractedClauses: List[ExtractedClause]
    risks: List[Risk]
    conflicts: List[Conflict]
    missingClauses: List[dict]
    timelineEvents: List[TimelineEvent]
    dealReadiness: DealReadiness
    aiInsights: AIInsights
    documentStats: DocumentStats

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    references: Optional[List[dict]] = None
    timestamp: datetime

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    documents: List[ContractDocument]

class ChatResponse(BaseModel):
    message: ChatMessage

@app.get("/")
async def root():
    return {"message": "LegalIntel AI API - Contract Intelligence Platform"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_contract(request: AnalysisRequest):
    # Mock analysis data matching the frontend expectations
    contract_summary = ContractSummary(
        overview="Master Services Agreement between Acme Corp and Tech Solutions for cloud migration services with a 3-year term and $2.5M total value.",
        parties=["Acme Corp", "Tech Solutions Inc."],
        keyObligations=[
            "Complete migration within 6 months",
            "Provide 24/7 support with 1hr SLA",
            "Monthly payments of $69,444"
        ]
    )
    
    extracted_clauses = [
        ExtractedClause(id="1", type="Parties", content="This agreement is between Acme Corp and Tech Solutions Inc.", confidence=0.98),
        ExtractedClause(id="2", type="Effective Date", content="This agreement shall commence on January 1, 2025.", confidence=0.96),
        ExtractedClause(id="3", type="Expiry Date", content="This agreement shall terminate on December 31, 2027.", confidence=0.95),
        ExtractedClause(id="4", type="Payment Terms", content="Net 30 days from invoice date. Late payments: 1.5% monthly interest.", confidence=0.92),
        ExtractedClause(id="5", type="Contract Value", content="Total contract value: $2,500,000 USD.", confidence=0.99),
        ExtractedClause(id="6", type="Termination Clause", content="Either party may terminate with 60 days written notice.", confidence=0.94),
        ExtractedClause(id="7", type="Governing Law", content="Governing law: State of Delaware, USA.", confidence=0.97),
        ExtractedClause(id="8", type="Data Privacy", content="All processing must comply with GDPR and CCPA.", confidence=0.91),
        ExtractedClause(id="9", type="Liability", content="Liability capped at $1,000,000 per incident.", confidence=0.93),
        ExtractedClause(id="10", type="Confidentiality", content="Confidentiality period: 5 years post-termination.", confidence=0.90),
        ExtractedClause(id="11", type="SLA", content="99.9% uptime guarantee, 24/7 support with 1hr response.", confidence=0.88),
        ExtractedClause(id="12", type="Insurance", content="Vendor must carry $5M general liability insurance.", confidence=0.89),
        ExtractedClause(id="13", type="Audit Rights", content="Client may audit vendor records with 30 days notice.", confidence=0.92),
    ]
    
    risks = [
        Risk(id="r1", title="Uncapped Indemnity", description="Indemnification clause has no monetary limit.", level="critical", category="legal"),
        Risk(id="r2", title="Missing Cyber Insurance", description="No requirement for cyber liability insurance.", level="high", category="security"),
        Risk(id="r3", title="Payment Terms Mismatch", description="SOW shows net-45 but contract says net-30.", level="high", category="financial"),
        Risk(id="r4", title="No Data Processing Agreement", description="DPA is referenced but not attached.", level="critical", category="compliance"),
        Risk(id="r5", title="Broad IP Assignment", description="Vendor assigns all IP including pre-existing works.", level="medium", category="legal"),
        Risk(id="r6", title="Unclear SLA Credits", description="SLA credits are not clearly defined.", level="medium", category="operational"),
    ]
    
    missing_clauses = [
        {"clause": "NDA", "severity": "high"},
        {"clause": "GDPR Compliance", "severity": "critical"},
        {"clause": "Indemnity", "severity": "critical"},
        {"clause": "Cyber Insurance", "severity": "high"},
        {"clause": "Data Processing Agreement", "severity": "critical"},
        {"clause": "IP Ownership", "severity": "medium"},
        {"clause": "Limitation of Liability", "severity": "low"},
    ]
    
    timeline_events = [
        TimelineEvent(id="t1", title="Contract Effective Date", date=datetime(2025, 1, 1), type="effective", description="Start of contractual obligations"),
        TimelineEvent(id="t2", title="First Payment Due", date=datetime(2025, 2, 1), type="payment", description="First monthly invoice due"),
        TimelineEvent(id="t3", title="Renewal Window Opens", date=datetime(2027, 10, 1), type="renewal", description="90-day renewal window begins"),
        TimelineEvent(id="t4", title="Termination Notice Cutoff", date=datetime(2027, 11, 1), type="termination", description="Last day to submit termination notice"),
        TimelineEvent(id="t5", title="Contract Expiration", date=datetime(2027, 12, 31), type="expiration", description="End of initial term"),
    ]
    
    deal_readiness = DealReadiness(
        score=45,
        pendingApprovals=3,
        complianceGaps=5,
        missingDocuments=["Signed Master Agreement", "Data Processing Agreement", "Insurance Certificates", "Compliance Approvals"],
        requiredActions=["Sign Master Agreement", "Execute Data Processing Agreement", "Obtain Insurance Certificates", "Resolve Payment Terms Conflict", "Get Compliance Approval"],
    )
    
    ai_insights = AIInsights(
        topRisks=risks[:3],
        recommendedActions=["Cap indemnity at $5M", "Add cyber insurance requirement", "Resolve payment terms conflict", "Attach Data Processing Agreement"],
        negotiationPoints=["Liability cap amount", "Indemnification scope", "SLA credit structure", "Intellectual property rights"],
        executiveSummary="The contract has significant gaps in compliance and risk allocation. Key issues include uncapped indemnity, missing DPA, and no cyber insurance requirement.",
        keyObligations=["Cloud migration within 6 months", "99.9% uptime guarantee", "Monthly payments of $69,444", "24/7 support with 1hr response"],
        criticalDeadlines=[timeline_events[0], timeline_events[2]],
    )
    
    document_stats = DocumentStats(
        totalDocuments=5, pagesProcessed=147, clausesExtracted=13, risksIdentified=6,
    )
    
    return AnalysisResponse(
        contractSummary=contract_summary,
        extractedClauses=extracted_clauses,
        risks=risks,
        conflicts=[],
        missingClauses=missing_clauses,
        timelineEvents=timeline_events,
        dealReadiness=deal_readiness,
        aiInsights=ai_insights,
        documentStats=document_stats,
    )

@app.post("/chat", response_model=ChatResponse)
async def chat_with_contracts(request: ChatRequest):
    responses = [
        {
            "content": "The payment terms specify net-30 days from invoice date. Late payments incur a 1.5% monthly interest charge.",
            "references": [{"document": "Master Services Agreement.pdf", "section": "Section 7.2"}]
        },
        {
            "content": "Data cannot leave India without prior written consent. All processing must occur within Indian territory as per Clause 12.4.",
            "references": [{"document": "Data Processing Agreement.pdf", "section": "Clause 12.4"}]
        },
        {
            "content": "Liability is capped at $1,000,000 per incident and $5,000,000 in aggregate per contract year.",
            "references": [{"document": "Master Services Agreement.pdf", "section": "Section 15.3"}]
        },
        {
            "content": "All intellectual property developed during the engagement is owned exclusively by the client as per Clause 8.1.",
            "references": [{"document": "Master Services Agreement.pdf", "section": "Clause 8.1"}]
        },
        {
            "content": "Yes, audit rights are included. The client may audit the vendor's facilities and records with 30 days notice.",
            "references": [{"document": "Master Services Agreement.pdf", "section": "Section 14"}]
        },
    ]
    
    import random
    selected = random.choice(responses)
    
    return ChatResponse(
        message=ChatMessage(
            id="res-" + str(random.randint(1000, 9999)),
            role="assistant",
            content=selected["content"],
            references=selected["references"],
            timestamp=datetime.now(),
        )
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
