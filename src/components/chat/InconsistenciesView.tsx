"use client";

import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, Info, GitBranch, Split } from "lucide-react";

interface InconsistenciesViewProps {
  document: UploadedDocument;
}

const EvidencePill = ({ evidence }: { evidence?: Evidence }) => {
  if (!evidence || !evidence.pageNumber) return null;
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 mt-3 rounded-4 bg-slate/10 text-slate text-[11px] font-medium border border-line cursor-help transition-colors hover:bg-slate/20 hover:text-ink"
      title={evidence.sourceExcerpt || evidence.text || "View source in document"}
    >
      Page {evidence.pageNumber}
    </span>
  );
};

export default function InconsistenciesView({ document }: InconsistenciesViewProps) {
  if (document.analysisStatus === "analyzing" || !document.analysis) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-signal" />
        <p className="text-[14px] font-medium text-ink">Analyzing document for conflicts...</p>
        <p className="text-[13px] opacity-70 mt-1">This may take a minute for longer documents.</p>
      </div>
    );
  }

  if (document.analysisStatus === "error") {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Analysis failed</p>
        <p className="text-[13px] opacity-70 mt-1">We couldn't extract inconsistencies from this document.</p>
      </div>
    );
  }

  const { analysis } = document;
  const inconsistencies = analysis.inconsistencies || [];

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      {document.analysisStatus === "partial" && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-8 flex gap-3 text-amber-800">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[14px] leading-relaxed">
            <strong>Document too long for full analysis.</strong> We've extracted potential conflicts from the first portion of the document.
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Conflicts & Inconsistencies</h3>
        <p className="text-[14px] text-slate">Identify places where different parts of the same document appear difficult to reconcile.</p>
      </div>

      {inconsistencies.length === 0 ? (
        <div className="text-center text-slate py-12 bg-white border border-line rounded-12 shadow-sm flex flex-col items-center">
          <GitBranch className="w-8 h-8 mb-3 text-emerald-500 opacity-80" />
          <p className="text-[14px]">No obvious contradictions were found in this document.</p>
          <p className="text-[13px] opacity-70 mt-1">This does not guarantee the document is perfectly drafted.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {inconsistencies.map((inc, idx) => {
            return (
              <div 
                key={`inc-${idx}`} 
                className="bg-white border border-line rounded-12 shadow-sm overflow-hidden animate-[fadeIn_300ms_ease-out_forwards]"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="px-5 py-4 border-b border-line flex items-start gap-3 bg-slate/5">
                  <Split className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-semibold text-ink mb-1">{inc.topic || "Potential Inconsistency"}</h4>
                    <p className="text-[14px] text-slate leading-relaxed">{inc.whyItDeservesReview || "These provisions appear different and may require clarification."}</p>
                  </div>
                </div>

                {inc.provision1 && inc.provision2 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line bg-slate/50">
                    <div className="p-5 flex flex-col">
                      <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider mb-3">First Provision</h5>
                      <div className="flex-1 bg-white border border-line/50 rounded-8 p-4 shadow-sm text-[14px] text-ink leading-relaxed">
                        {inc.provision1.text}
                        <div className="block mt-1">
                          <EvidencePill evidence={inc.provision1.evidence} />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col">
                      <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider mb-3">Second Provision</h5>
                      <div className="flex-1 bg-white border border-line/50 rounded-8 p-4 shadow-sm text-[14px] text-ink leading-relaxed">
                        {inc.provision2.text}
                        <div className="block mt-1">
                          <EvidencePill evidence={inc.provision2.evidence} />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Fallback for old schema if it accidentally generates description instead of the comparative schema
                  <div className="p-5">
                    <p className="text-[14px] text-ink leading-relaxed">
                      {(inc as any).description}
                    </p>
                    {(inc as any).evidence && (
                      <EvidencePill evidence={(inc as any).evidence} />
                    )}
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
