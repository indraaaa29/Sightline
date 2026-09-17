"use client";

import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, Info, CheckCircle2, Calendar, AlertCircle } from "lucide-react";

interface ObligationsViewProps {
  document: UploadedDocument;
}

const EvidencePill = ({ evidence }: { evidence?: Evidence }) => {
  if (!evidence || !evidence.pageNumber) return null;
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 ml-2 rounded-4 bg-slate/10 text-slate text-[11px] font-medium border border-line cursor-help transition-colors hover:bg-slate/20 hover:text-ink"
      title={evidence.sourceExcerpt || evidence.text || "View source in document"}
    >
      Page {evidence.pageNumber}
    </span>
  );
};

export default function ObligationsView({ document }: ObligationsViewProps) {
  if (document.analysisStatus === "analyzing" || !document.analysis) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-signal" />
        <p className="text-[14px] font-medium text-ink">Analyzing responsibilities...</p>
        <p className="text-[13px] opacity-70 mt-1">This may take a minute for longer documents.</p>
      </div>
    );
  }

  if (document.analysisStatus === "error") {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Analysis failed</p>
        <p className="text-[13px] opacity-70 mt-1">We couldn't extract obligations from this document.</p>
      </div>
    );
  }

  const { analysis } = document;
  const obligations = analysis.obligations || [];

  // Group obligations by party
  const groupedObligations = obligations.reduce((acc, ob) => {
    const party = ob.party || "Unspecified Party";
    if (!acc[party]) acc[party] = [];
    acc[party].push(ob);
    return acc;
  }, {} as Record<string, typeof obligations>);

  const parties = Object.keys(groupedObligations).sort();

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      {document.analysisStatus === "partial" && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-8 flex gap-3 text-amber-800">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[14px] leading-relaxed">
            <strong>Document too long for full analysis.</strong> We've extracted obligations from the first portion of the document.
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Obligations & Responsibilities</h3>
        <p className="text-[14px] text-slate">Review who must do what, by when, and under what conditions.</p>
      </div>

      {parties.length === 0 ? (
        <div className="text-center text-slate py-12 bg-white border border-line rounded-12 shadow-sm">
          <p className="text-[14px]">No specific obligations were automatically extracted from this document.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {parties.map((party, idx) => (
            <div key={`party-group-${idx}`} className="animate-[fadeIn_300ms_ease-out_forwards]" style={{ animationDelay: `${idx * 100}ms` }}>
              <h4 className="text-[14px] font-bold text-ink mb-4 pb-2 border-b border-line flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-signal" />
                {party}
              </h4>
              
              <div className="space-y-4">
                {groupedObligations[party].map((ob, obIdx) => (
                  <div key={`ob-${idx}-${obIdx}`} className="bg-white border border-line rounded-12 p-5 shadow-sm transition-colors hover:border-slate/30">
                    <p className="text-[14px] text-ink leading-relaxed font-medium">
                      {ob.description}
                      <EvidencePill evidence={ob.evidence} />
                    </p>
                    
                    {(ob.deadline || ob.conditions) && (
                      <div className="mt-4 pt-4 border-t border-line/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ob.deadline && (
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-slate mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-0.5">Deadline</span>
                              <span className="text-[13px] text-ink">{ob.deadline}</span>
                            </div>
                          </div>
                        )}
                        {ob.conditions && (
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-slate mt-0.5 shrink-0" />
                            <div>
                              <span className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-0.5">Conditions</span>
                              <span className="text-[13px] text-ink">{ob.conditions}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
