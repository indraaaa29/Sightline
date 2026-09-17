"use client";

import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, Info, ShieldAlert, Shield, HelpCircle } from "lucide-react";

interface RiskReviewViewProps {
  document: UploadedDocument;
}

const EvidencePill = ({ evidence }: { evidence?: Evidence }) => {
  if (!evidence || !evidence.pageNumber) return null;
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-4 bg-slate/10 text-slate text-[11px] font-medium border border-line cursor-help transition-colors hover:bg-slate/20 hover:text-ink"
      title={evidence.sourceExcerpt || evidence.text || "View source in document"}
    >
      Page {evidence.pageNumber}
    </span>
  );
};

export default function RiskReviewView({ document }: RiskReviewViewProps) {
  if (document.analysisStatus === "analyzing" || !document.analysis) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-signal" />
        <p className="text-[14px] font-medium text-ink">Analyzing risks...</p>
        <p className="text-[13px] opacity-70 mt-1">This may take a minute for longer documents.</p>
      </div>
    );
  }

  if (document.analysisStatus === "error") {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Analysis failed</p>
        <p className="text-[13px] opacity-70 mt-1">We couldn't extract risks from this document.</p>
      </div>
    );
  }

  const { analysis } = document;
  const risks = analysis.risks || [];

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      {document.analysisStatus === "partial" && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-8 flex gap-3 text-amber-800">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[14px] leading-relaxed">
            <strong>Document too long for full analysis.</strong> We've extracted potential concerns from the first portion of the document.
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Risk Review</h3>
        <p className="text-[14px] text-slate">Identify provisions or patterns that may deserve closer attention. Sightline provides information, not legal advice.</p>
      </div>

      {risks.length === 0 ? (
        <div className="text-center text-slate py-12 bg-white border border-line rounded-12 shadow-sm flex flex-col items-center">
          <Shield className="w-8 h-8 mb-3 text-emerald-500 opacity-80" />
          <p className="text-[14px]">No obvious material concerns were automatically extracted from this document.</p>
          <p className="text-[13px] opacity-70 mt-1">This does not guarantee the document is risk-free.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {risks.map((risk, idx) => {
            const riskColor = risk.severity === "high" ? "text-red-600" : 
                              risk.severity === "medium" ? "text-amber-600" : "text-slate";
            
            const bgAccent = risk.severity === "high" ? "bg-red-50/50" : 
                             risk.severity === "medium" ? "bg-amber-50/50" : "bg-slate/5";

            const Icon = risk.severity === "high" ? ShieldAlert : 
                         risk.severity === "medium" ? AlertTriangle : HelpCircle;

            const label = risk.severity === "high" ? "Potential concern" : 
                          risk.severity === "medium" ? "Worth reviewing" : "Notice";

            return (
              <div 
                key={`risk-${idx}`} 
                className="bg-white border border-line rounded-12 shadow-sm overflow-hidden animate-[fadeIn_300ms_ease-out_forwards]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`px-5 py-4 border-b border-line flex items-center gap-3 ${bgAccent}`}>
                  <Icon className={`w-5 h-5 shrink-0 ${riskColor}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-ink truncate">{risk.concern}</h4>
                    <span className={`text-[12px] font-medium ${riskColor}`}>{label}</span>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {risk.whatItSays && (
                    <div>
                      <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider mb-1.5">What the document says</h5>
                      <p className="text-[14px] text-ink leading-relaxed">{risk.whatItSays}</p>
                    </div>
                  )}

                  {risk.whyItMatters && (
                    <div>
                      <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider mb-1.5">Why it may matter</h5>
                      <p className="text-[14px] text-ink leading-relaxed">{risk.whyItMatters}</p>
                    </div>
                  )}

                  {risk.whatToReview && (
                    <div>
                      <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider mb-1.5">What to review</h5>
                      <p className="text-[14px] text-ink leading-relaxed">{risk.whatToReview}</p>
                    </div>
                  )}

                  {/* Removed fallback block that caused TS error */}

                  {risk.evidence && (
                    <div className="pt-2 border-t border-line/50">
                      <EvidencePill evidence={risk.evidence} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
