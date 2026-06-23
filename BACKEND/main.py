
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="LegalIntel AI - Contract Intelligence Platform")

import os

# Configure CORS
origins = [
    "http://localhost:3000",
    "https://legal-intel-ai-gjfh.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    primary_contract: Optional[ContractDocument] = None
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

# Define required documents with identifying keywords
REQUIRED_DOCUMENTS = [
    {"name": "Signed Master Agreement / Contract", "keywords": ["contract", "agreement", "msa", "master", "signed"], "severity": "critical"},
    {"name": "Scope of Work (SOW)", "keywords": ["sow", "scope of work", "statement of work"], "severity": "high"},
    {"name": "Purchase Order (PO)", "keywords": ["po", "purchase order", "order"], "severity": "high"},
    {"name": "Payment Terms / Commercial Agreement", "keywords": ["payment", "commercial", "pricing"], "severity": "high"},
    {"name": "Insurance Certificates", "keywords": ["insurance", "certificate", "policy"], "severity": "high"},
    {"name": "Compliance / Regulatory Approvals", "keywords": ["compliance", "regulatory", "approval"], "severity": "medium"},
    {"name": "Technical Specifications / Annexures", "keywords": ["technical", "specification", "annexure", "annex"], "severity": "medium"},
    {"name": "Data Processing Agreement (DPA)", "keywords": ["dpa", "data processing"], "severity": "critical"},
]

def check_document_match(doc: ContractDocument, required_doc):
    """Check if an uploaded document matches a required document"""
    doc_name = doc.name.lower()
    doc_content = doc.content.lower()
    for keyword in required_doc["keywords"]:
        if keyword in doc_name or keyword in doc_content:
            return True
    return False

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_contract(request: AnalysisRequest):
    # Collect all uploaded documents
    all_uploaded_docs = [request.primary_contract] if request.primary_contract else []
    all_uploaded_docs.extend(request.supporting_documents)
    all_uploaded_docs.extend(request.enterprise_context)
    
    # Match uploaded docs to required docs
    available_required_docs = []
    missing_required_docs = []
    
    for req_doc in REQUIRED_DOCUMENTS:
        matched = False
        for uploaded_doc in all_uploaded_docs:
            if check_document_match(uploaded_doc, req_doc):
                available_required_docs.append(req_doc["name"])
                matched = True
                break
        if not matched:
            missing_required_docs.append(req_doc["name"])
    
    # Calculate deal readiness score
    num_required = len(REQUIRED_DOCUMENTS)
    num_available = len(available_required_docs)
    readiness_score = int((num_available / num_required) * 100)
    
    # Basic contract summary from primary document
    contract_summary = ContractSummary(
        overview=f"Contract analysis based on {len(all_uploaded_docs)} uploaded document(s)",
        parties=[doc.name for doc in all_uploaded_docs[:2]] if all_uploaded_docs else ["Unknown"],
        keyObligations=[f"Analyzed document: {doc.name}" for doc in all_uploaded_docs[:3]],
    )
    
    # Build risks from missing documents
    risks = []
    risk_id = 0
    for req_doc in REQUIRED_DOCUMENTS:
        if req_doc["name"] in missing_required_docs:
            risk_id += 1
            risks.append(Risk(
                id=f"r{risk_id}",
                title=f"Missing {req_doc['name']}",
                description=f"{req_doc['name']} is required for deal closure but not uploaded",
                level=req_doc["severity"],
                category="compliance" if "compliance" in req_doc["name"].lower() or "dpa" in req_doc["name"].lower() else "legal"
            ))
    
    timeline_events = [
        TimelineEvent(id="t1", title="Contract Analysis Complete", date=datetime.now(), type="effective", description="Document analysis completed successfully"),
    ]
    
    deal_readiness = DealReadiness(
        score=readiness_score,
        pendingApprovals=len(missing_required_docs),
        complianceGaps=len([m for m in missing_required_docs if "compliance" in m.lower() or "dpa" in m.lower()]),
        missingDocuments=missing_required_docs,
        requiredActions=[f"Upload {doc}" for doc in missing_required_docs],
    )
    
    ai_insights = AIInsights(
        topRisks=risks[:5],
        recommendedActions=deal_readiness.requiredActions[:5],
        negotiationPoints=["Review all missing documents", "Verify document completeness"],
        executiveSummary=f"Deal readiness: {readiness_score}%. Missing {len(missing_required_docs)} critical document(s) for closure.",
        keyObligations=[f"Uploaded {len(all_uploaded_docs)} document(s)"],
        criticalDeadlines=timeline_events,
    )
    
    document_stats = DocumentStats(
        totalDocuments=len(all_uploaded_docs),
        pagesProcessed=len(all_uploaded_docs)*10, # mock
        clausesExtracted=0, # mock for now
        risksIdentified=len(risks),
    )
    
    return AnalysisResponse(
        contractSummary=contract_summary,
        extractedClauses=[], # we'll add real extraction later
        risks=risks,
        conflicts=[],
        missingClauses=[],
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
