
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  FileText,
  AlertTriangle,
  TrendingUp,
  Download,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Scale,
  Lock,
  Briefcase,
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import KPICard from '@/components/ui/KPICard';
import RiskBadge from '@/components/ui/RiskBadge';
import DocumentUploader from '@/components/contract/DocumentUploader';
import ContractChat from '@/components/chat/ContractChat';
import ContractTimeline from '@/components/contract/ContractTimeline';
import RiskHeatmap from '@/components/dashboard/RiskHeatmap';
import { ContractDocument, AnalysisResult, TimelineEvent, Risk, ExtractedClause } from '@/types';

const mockAnalysis: AnalysisResult = {
  contractSummary: {
    overview:
      'Master Services Agreement between Acme Corp and Tech Solutions for cloud migration services with a 3-year term and $2.5M total value.',
    parties: ['Acme Corp', 'Tech Solutions Inc.'],
    keyObligations: [
      'Complete migration within 6 months',
      'Provide 24/7 support with 1hr SLA',
      'Monthly payments of $69,444',
    ],
  },
  extractedClauses: [
    {
      id: '1',
      type: 'Parties',
      content: 'This agreement is between Acme Corp and Tech Solutions Inc.',
      confidence: 0.98,
    },
    {
      id: '2',
      type: 'Effective Date',
      content: 'This agreement shall commence on January 1, 2025.',
      confidence: 0.96,
    },
    {
      id: '3',
      type: 'Expiry Date',
      content: 'This agreement shall terminate on December 31, 2027.',
      confidence: 0.95,
    },
    {
      id: '4',
      type: 'Payment Terms',
      content: 'Net 30 days from invoice date. Late payments: 1.5% monthly interest.',
      confidence: 0.92,
    },
    {
      id: '5',
      type: 'Contract Value',
      content: 'Total contract value: $2,500,000 USD.',
      confidence: 0.99,
    },
    {
      id: '6',
      type: 'Termination Clause',
      content: 'Either party may terminate with 60 days written notice.',
      confidence: 0.94,
    },
    {
      id: '7',
      type: 'Governing Law',
      content: 'Governing law: State of Delaware, USA.',
      confidence: 0.97,
    },
    {
      id: '8',
      type: 'Data Privacy',
      content: 'All processing must comply with GDPR and CCPA.',
      confidence: 0.91,
    },
    {
      id: '9',
      type: 'Liability',
      content: 'Liability capped at $1,000,000 per incident.',
      confidence: 0.93,
    },
    {
      id: '10',
      type: 'Confidentiality',
      content: 'Confidentiality period: 5 years post-termination.',
      confidence: 0.90,
    },
    {
      id: '11',
      type: 'SLA',
      content: '99.9% uptime guarantee, 24/7 support with 1hr response.',
      confidence: 0.88,
    },
    {
      id: '12',
      type: 'Insurance',
      content: 'Vendor must carry $5M general liability insurance.',
      confidence: 0.89,
    },
    {
      id: '13',
      type: 'Audit Rights',
      content: 'Client may audit vendor records with 30 days notice.',
      confidence: 0.92,
    },
  ],
  risks: [
    {
      id: 'r1',
      title: 'Uncapped Indemnity',
      description: 'Indemnification clause has no monetary limit.',
      level: 'critical',
      category: 'legal',
    },
    {
      id: 'r2',
      title: 'Missing Cyber Insurance',
      description: 'No requirement for cyber liability insurance.',
      level: 'high',
      category: 'security',
    },
    {
      id: 'r3',
      title: 'Payment Terms Mismatch',
      description: 'SOW shows net-45 but contract says net-30.',
      level: 'high',
      category: 'financial',
    },
    {
      id: 'r4',
      title: 'No Data Processing Agreement',
      description: 'DPA is referenced but not attached.',
      level: 'critical',
      category: 'compliance',
    },
    {
      id: 'r5',
      title: 'Broad IP Assignment',
      description: 'Vendor assigns all IP including pre-existing works.',
      level: 'medium',
      category: 'legal',
    },
    {
      id: 'r6',
      title: 'Unclear SLA Credits',
      description: 'SLA credits are not clearly defined.',
      level: 'medium',
      category: 'operational',
    },
  ],
  conflicts: [],
  missingClauses: [
    { clause: 'NDA', severity: 'high' },
    { clause: 'GDPR Compliance', severity: 'critical' },
    { clause: 'Indemnity', severity: 'critical' },
    { clause: 'Cyber Insurance', severity: 'high' },
    { clause: 'Data Processing Agreement', severity: 'critical' },
    { clause: 'IP Ownership', severity: 'medium' },
    { clause: 'Limitation of Liability', severity: 'low' },
  ],
  timelineEvents: [
    {
      id: 't1',
      title: 'Contract Effective Date',
      date: new Date('2025-01-01'),
      type: 'effective',
      description: 'Start of contractual obligations',
    },
    {
      id: 't2',
      title: 'First Payment Due',
      date: new Date('2025-02-01'),
      type: 'payment',
      description: 'First monthly invoice due',
    },
    {
      id: 't3',
      title: 'Renewal Window Opens',
      date: new Date('2027-10-01'),
      type: 'renewal',
      description: '90-day renewal window begins',
    },
    {
      id: 't4',
      title: 'Termination Notice Cutoff',
      date: new Date('2027-11-01'),
      type: 'termination',
      description: 'Last day to submit termination notice',
    },
    {
      id: 't5',
      title: 'Contract Expiration',
      date: new Date('2027-12-31'),
      type: 'expiration',
      description: 'End of initial term',
    },
  ],
  dealReadiness: {
    score: 45,
    pendingApprovals: 3,
    complianceGaps: 5,
    missingDocuments: [
      'Signed Master Agreement',
      'Data Processing Agreement',
      'Insurance Certificates',
      'Compliance Approvals',
    ],
    requiredActions: [
      'Sign Master Agreement',
      'Execute Data Processing Agreement',
      'Obtain Insurance Certificates',
      'Resolve Payment Terms Conflict',
      'Get Compliance Approval',
    ],
  },
  aiInsights: {
    topRisks: [
      {
        id: 'r1',
        title: 'Uncapped Indemnity',
        description: 'Indemnification clause has no monetary limit.',
        level: 'critical',
        category: 'legal',
      },
      {
        id: 'r4',
        title: 'No Data Processing Agreement',
        description: 'DPA is referenced but not attached.',
        level: 'critical',
        category: 'compliance',
      },
      {
        id: 'r2',
        title: 'Missing Cyber Insurance',
        description: 'No requirement for cyber liability insurance.',
        level: 'high',
        category: 'security',
      },
    ],
    recommendedActions: [
      'Cap indemnity at $5M',
      'Add cyber insurance requirement',
      'Resolve payment terms conflict',
      'Attach Data Processing Agreement',
    ],
    negotiationPoints: [
      'Liability cap amount',
      'Indemnification scope',
      'SLA credit structure',
      'Intellectual property rights',
    ],
    executiveSummary:
      'The contract has significant gaps in compliance and risk allocation. Key issues include uncapped indemnity, missing DPA, and no cyber insurance requirement.',
    keyObligations: [
      'Cloud migration within 6 months',
      '99.9% uptime guarantee',
      'Monthly payments of $69,444',
      '24/7 support with 1hr response',
    ],
    criticalDeadlines: [
      {
        id: 't1',
        title: 'Contract Effective Date',
        date: new Date('2025-01-01'),
        type: 'effective',
        description: 'Start of contractual obligations',
      },
      {
        id: 't3',
        title: 'Renewal Window Opens',
        date: new Date('2027-10-01'),
        type: 'renewal',
        description: '90-day renewal window begins',
      },
    ],
  },
  documentStats: {
    totalDocuments: 5,
    pagesProcessed: 147,
    clausesExtracted: 13,
    risksIdentified: 6,
  },
};

export default function Home() {
  const [primaryDocs, setPrimaryDocs] = useState<ContractDocument[]>([]);
  const [supportingDocs, setSupportingDocs] = useState<ContractDocument[]>([]);
  const [contextDocs, setContextDocs] = useState<ContractDocument[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard'>('upload');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    try {
      if (primaryDocs.length > 0) {
        const response = await fetch(`${API_URL}/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            primary_contract: primaryDocs[0],
            supporting_documents: supportingDocs,
            enterprise_context: contextDocs,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAnalysisResult(data);
      } else {
        // Use mock data if no documents uploaded
        setAnalysisResult(mockAnalysis);
      }
      setActiveTab('dashboard');
    } catch (error) {
      console.error("Error analyzing contract:", error);
      // Fallback to mock data on error
      setAnalysisResult(mockAnalysis);
      setActiveTab('dashboard');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LegalIntel AI
              </h1>
              <p className="text-xs text-zinc-500">Contract Intelligence Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {analysisResult && (
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                New Analysis
              </button>
            )}
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center">
              <span className="text-sm font-semibold">JS</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'upload' ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Contract Intelligence & Deal Closure Auditor</h2>
                <p className="text-zinc-400 max-w-2xl mx-auto">
                  Upload your contracts and supporting documents for AI-powered analysis, risk detection, and deal readiness assessment
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-8">
                  <DocumentUploader
                    type="primary"
                    label="Primary Contract"
                    description="Upload the main agreement document (MSA, Contract, etc.)"
                    documents={primaryDocs}
                    onAdd={(docs) => setPrimaryDocs([...primaryDocs, ...docs])}
                    onRemove={(id) => setPrimaryDocs(primaryDocs.filter(d => d.id !== id))}
                  />
                  <DocumentUploader
                    type="supporting"
                    label="Supporting Documents"
                    description="Upload SOWs, POs, amendments, and other supporting documents"
                    documents={supportingDocs}
                    onAdd={(docs) => setSupportingDocs([...supportingDocs, ...docs])}
                    onRemove={(id) => setSupportingDocs(supportingDocs.filter(d => d.id !== id))}
                  />
                  <DocumentUploader
                    type="context"
                    label="Enterprise Context"
                    description="Upload policies, previous contracts, and other reference documents"
                    documents={contextDocs}
                    onAdd={(docs) => setContextDocs([...contextDocs, ...docs])}
                    onRemove={(id) => setContextDocs(contextDocs.filter(d => d.id !== id))}
                  />
                </div>

                <div className="space-y-6">
                  <GlassCard className="p-8">
                    <div className="text-center">
                      <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                        <Activity size={32} className="text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Ready to Analyze?</h3>
                      <p className="text-zinc-400 mb-6">
                        {primaryDocs.length === 0
                          ? 'Please upload at least one primary contract document'
                          : `${primaryDocs.length + supportingDocs.length + contextDocs.length} documents ready for analysis`}
                      </p>
                      <button
                        onClick={handleAnalyze}
                        disabled={primaryDocs.length === 0 || isAnalyzing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-zinc-700 disabled:to-zinc-800 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100"
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Analyzing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <Activity size={20} />
                            <span>Analyze Contract</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h4 className="font-semibold mb-4 text-white">What We'll Analyze</h4>
                    <div className="space-y-3">
                      {[
                        { icon: FileText, text: 'Clause extraction & validation' },
                        { icon: AlertTriangle, text: 'Risk identification' },
                        { icon: Scale, text: 'Conflict detection' },
                        { icon: Lock, text: 'Compliance assessment' },
                        { icon: TrendingUp, text: 'Deal readiness score' },
                        { icon: Download, text: 'Comprehensive reports' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <item.icon size={18} className="text-blue-400" />
                          <span className="text-zinc-300 text-sm">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {analysisResult && (
                <>
                  {/* Dashboard Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Executive Dashboard</h2>
                      <p className="text-zinc-400">AI-powered contract analysis & risk assessment</p>
                    </div>
                    <button
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all"
                    >
                      <Download size={20} />
                      <span>Export Report</span>
                    </button>
                  </div>

                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KPICard
                      title="Deal Readiness"
                      value={`${analysisResult.dealReadiness.score}%`}
                      icon={CheckCircle}
                      color="#22c55e"
                      subtitle="Score out of 100"
                    />
                    <KPICard
                      title="Critical Risks"
                      value={analysisResult.risks.filter(r => r.level === 'critical').length}
                      icon={XCircle}
                      color="#ef4444"
                    />
                    <KPICard
                      title="High Risks"
                      value={analysisResult.risks.filter(r => r.level === 'high').length}
                      icon={AlertTriangle}
                      color="#f97316"
                    />
                    <KPICard
                      title="Clauses Extracted"
                      value={analysisResult.extractedClauses.length}
                      icon={FileText}
                      color="#3b82f6"
                    />
                  </div>

                  {/* Main Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column - Risk Summary & Heatmap */}
                    <div className="lg:col-span-2 space-y-8">
                      <GlassCard>
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                          <Shield size={24} className="text-blue-400" />
                          Risk Summary
                        </h3>
                        <div className="space-y-4">
                          {analysisResult.risks.map((risk) => (
                            <motion.div
                              key={risk.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                            >
                              <div className="flex-shrink-0 mt-1">
                                <RiskBadge level={risk.level} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1">{risk.title}</h4>
                                <p className="text-sm text-zinc-400">{risk.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </GlassCard>

                      <GlassCard>
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                          <Activity size={24} className="text-purple-400" />
                          Risk Heatmap
                        </h3>
                        <RiskHeatmap />
                      </GlassCard>

                      <GlassCard>
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                          <FileText size={24} className="text-emerald-400" />
                          Extracted Clauses
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {analysisResult.extractedClauses.map((clause) => (
                            <div
                              key={clause.id}
                              className="p-4 bg-white/5 rounded-xl border border-white/10"
                            >
                              <h4 className="font-semibold text-white mb-2">{clause.type}</h4>
                              <p className="text-sm text-zinc-400 mb-2">{clause.content}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    style={{ width: `${clause.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-zinc-500">
                                  {(clause.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    </div>

                    {/* Right Column - Timeline, Chat, Insights */}
                    <div className="space-y-8">
                      <GlassCard>
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                          <Clock size={24} className="text-amber-400" />
                          Contract Timeline
                        </h3>
                        <ContractTimeline events={analysisResult.timelineEvents} />
                      </GlassCard>

                      <GlassCard>
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                          <Briefcase size={24} className="text-rose-400" />
                          AI Insights
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-white mb-3">Top Risks</h4>
                            <div className="space-y-2">
                              {analysisResult.aiInsights.topRisks.map((risk) => (
                                <div key={risk.id} className="flex items-center gap-2">
                                  <RiskBadge level={risk.level} />
                                  <span className="text-sm text-zinc-300">{risk.title}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-3">Recommended Actions</h4>
                            <ul className="space-y-2">
                              {analysisResult.aiInsights.recommendedActions.map((action, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle size={16} className="text-blue-400 mt-1 flex-shrink-0" />
                                  <span className="text-sm text-zinc-300">{action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-white mb-3">Negotiation Points</h4>
                            <ul className="space-y-2">
                              {analysisResult.aiInsights.negotiationPoints.map((point, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <AlertTriangle size={16} className="text-amber-400 mt-1 flex-shrink-0" />
                                  <span className="text-sm text-zinc-300">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </GlassCard>

                      <ContractChat />
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
