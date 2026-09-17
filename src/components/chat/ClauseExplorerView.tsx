"use client";

import { useState } from "react";
import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, ChevronDown, MessageSquare, Info, ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface ClauseExplorerViewProps {
  document: UploadedDocument;
  onAskAboutClause?: (clauseTitle: string, excerpt: string) => void;
}

const EvidencePill = ({ evidence }: { evidence?: Evidence }) => {
  if (!evidence || !evidence.pageNumber) return null;
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 ml-2 rounded-4 bg-slate/10 text-slate text-[11px] font-medium border border-line cursor-help transition-colors hover:bg-slate/20 hover:text-ink"
      title="This indicates the page where this clause was found."
    >
      Page {evidence.pageNumber}
    </span>
  );
};

export default function ClauseExplorerView({ document, onAskAboutClause }: ClauseExplorerViewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (document.analysisStatus === "analyzing" || !document.analysis) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-signal" />
        <p className="text-[14px] font-medium text-ink">Analyzing clauses...</p>
        <p className="text-[13px] opacity-70 mt-1">This may take a minute for longer documents.</p>
      </div>
    );
  }

  if (document.analysisStatus === "error") {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Analysis failed</p>
        <p className="text-[13px] opacity-70 mt-1">We couldn't generate the clause analysis.</p>
      </div>
    );
  }

  const { analysis } = document;
  const clauses = analysis.clauses || [];

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      {document.analysisStatus === "partial" && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-8 flex gap-3 text-amber-800">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[14px] leading-relaxed">
            <strong>Document too long for full analysis.</strong> We've extracted clauses from the first portion of the document.
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Clause Explorer</h3>
        <p className="text-[14px] text-slate">Review important clauses identified in this document. Sightline provides information, not legal advice.</p>
      </div>

      {clauses.length === 0 ? (
        <div className="text-center text-slate py-12 bg-white border border-line rounded-12 shadow-sm">
          <p className="text-[14px]">No specific material clauses were automatically extracted from this document.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clauses.map((clause, idx) => {
            const isExpanded = expandedIndex === idx;
            const RiskIcon = clause.riskLevel === "high" ? ShieldAlert : 
                             clause.riskLevel === "medium" ? Shield : ShieldCheck;
            
            const riskColor = clause.riskLevel === "high" ? "text-red-500" : 
                              clause.riskLevel === "medium" ? "text-amber-500" : "text-emerald-500";
            
            const riskLabel = clause.riskLevel === "high" ? "Potential concern" : 
                              clause.riskLevel === "medium" ? "Worth reviewing" : "Standard";

            return (
              <div 
                key={`clause-${idx}`} 
                className={`bg-white border transition-colors duration-200 shadow-sm rounded-12 overflow-hidden ${
                  isExpanded ? "border-signal/50" : "border-line hover:border-slate/30"
                }`}
              >
                {/* Header (Clickable) */}
                <button 
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center gap-4"
                >
                  <RiskIcon className={`w-5 h-5 shrink-0 ${riskColor}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-ink truncate">{clause.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[12px] font-medium ${riskColor}`}>{riskLabel}</span>
                      <span className="text-slate/30">•</span>
                      {clause.evidence && clause.evidence.pageNumber && (
                        <span className="text-[12px] text-slate">Page {clause.evidence.pageNumber}</span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-line/50 animate-[fadeIn_200ms_ease-out_forwards]">
                    <div className="space-y-5">
                      
                      {clause.whatItSays && (
                        <div>
                          <h5 className="text-[12px] font-semibold text-slate uppercase tracking-wider mb-2">What the document says</h5>
                          <p className="text-[14px] text-ink leading-relaxed">{clause.whatItSays}</p>
                        </div>
                      )}

                      {clause.summary && (
                        <div>
                          <h5 className="text-[12px] font-semibold text-slate uppercase tracking-wider mb-2">In plain language</h5>
                          <p className="text-[14px] text-ink leading-relaxed">{clause.summary}</p>
                        </div>
                      )}

                      {clause.whyItMatters && (
                        <div>
                          <h5 className="text-[12px] font-semibold text-slate uppercase tracking-wider mb-2">Why it may matter</h5>
                          <p className="text-[14px] text-ink leading-relaxed">{clause.whyItMatters}</p>
                        </div>
                      )}

                      {clause.evidence && clause.evidence.sourceExcerpt && (
                        <div>
                          <h5 className="text-[12px] font-semibold text-slate uppercase tracking-wider mb-2">Relevant excerpt</h5>
                          <div className="bg-panel border border-line rounded-8 p-4">
                            <p className="text-[13px] text-slate font-serif italic leading-relaxed">
                              "{clause.evidence.sourceExcerpt}"
                            </p>
                          </div>
                        </div>
                      )}

                      {onAskAboutClause && (
                        <div className="pt-2">
                          <button
                            onClick={() => onAskAboutClause(clause.title, clause.evidence?.sourceExcerpt || "")}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate/5 hover:bg-slate/10 text-ink text-[13px] font-medium rounded-8 transition-colors"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Ask Sightline about this clause
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
