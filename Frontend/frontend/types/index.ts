
export type ContractDocument = {
  id: string;
  name: string;
  content: string;
  type: 'primary' | 'supporting' | 'context';
  size: number;
  uploadedAt: Date;
};

export type ExtractedClause = {
  id: string;
  type: string;
  content: string;
  pageNumber?: number;
  confidence: number;
};

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export type Risk = {
  id: string;
  title: string;
  description: string;
  level: RiskLevel;
  category: 'legal' | 'financial' | 'compliance' | 'security' | 'operational';
  evidence?: string;
};

export type Conflict = {
  id: string;
  type: string;
  description: string;
  document1: string;
  document2: string;
  location1?: string;
  location2?: string;
  severity: RiskLevel;
};

export type RedlineSuggestion = {
  id: string;
  currentClause: string;
  suggestedClause: string;
  businessImpact: string;
  riskSeverity: RiskLevel;
  rationale: string;
};

export type TimelineEvent = {
  id: string;
  title: string;
  date: Date;
  type: 'effective' | 'payment' | 'renewal' | 'termination' | 'expiration';
  description: string;
};

export type AnalysisResult = {
  contractSummary: {
    overview: string;
    parties: string[];
    keyObligations: string[];
  };
  extractedClauses: ExtractedClause[];
  risks: Risk[];
  conflicts: Conflict[];
  missingClauses: { clause: string; severity: RiskLevel }[];
  timelineEvents: TimelineEvent[];
  dealReadiness: {
    score: number;
    pendingApprovals: number;
    complianceGaps: number;
    missingDocuments: string[];
    requiredActions: string[];
  };
  aiInsights: {
    topRisks: Risk[];
    recommendedActions: string[];
    negotiationPoints: string[];
    executiveSummary: string;
    keyObligations: string[];
    criticalDeadlines: TimelineEvent[];
  };
  documentStats: {
    totalDocuments: number;
    pagesProcessed: number;
    clausesExtracted: number;
    risksIdentified: number;
  };
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  references?: { document: string; section: string }[];
  timestamp: Date;
};
