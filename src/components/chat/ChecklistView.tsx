"use client";

import { useState } from "react";
import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, ListChecks, CheckCircle2, Download, MessageSquare, ChevronDown, ChevronUp, Check, AlertCircle } from "lucide-react";
import { generatePDFReport } from "@/lib/utils/pdfExport";

interface ChecklistViewProps {
  document: UploadedDocument;
  onAskAboutItem?: (title: string, context: string) => void;
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

export default function ChecklistView({ document, onAskAboutItem }: ChecklistViewProps) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  if (document.analysisStatus === "analyzing" || !document.analysis) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-signal" />
        <p className="text-[14px] font-medium text-ink">Generating checklist...</p>
      </div>
    );
  }

  if (document.analysisStatus === "error") {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Analysis failed</p>
        <p className="text-[13px] opacity-70 mt-1">We couldn't generate the review checklist.</p>
      </div>
    );
  }

  const { analysis } = document;
  const checklist = analysis.checklist || [];

  const toggleCheck = (index: number) => {
    const next = new Set(checkedItems);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCheckedItems(next);
  };

  const toggleExpand = (index: number) => {
    const next = new Set(expandedItems);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setExpandedItems(next);
  };

  const handleExport = () => {
    const sections = checklist.map((item, idx) => {
      const isChecked = checkedItems.has(idx);
      const state = isChecked ? "[X]" : "[ ]";
      const lines = [];
      
      lines.push(`${state} ${item.title}`);
      
      if (item.explanation) {
        lines.push(`    ${item.explanation}`);
      }
      
      if (item.priority) {
        lines.push(`    Priority: ${item.priority}`);
      }
      
      if (item.evidence?.pageNumber) {
        lines.push(`    Evidence: Page ${item.evidence.pageNumber}`);
      }

      return {
        content: lines
      };
    });

    generatePDFReport({
      documentName: document.filename,
      reportTitle: "Action Checklist",
      sections: [
        {
          title: "Tasks",
          content: [] // Handled by sections mapping
        },
        ...sections
      ]
    });
  };

  const progress = checklist.length > 0 ? Math.round((checkedItems.size / checklist.length) * 100) : 0;

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h3 className="text-[20px] font-bold text-ink mb-2">Action Checklist</h3>
          <p className="text-[14px] text-slate">Document-grounded items to consider verifying.</p>
        </div>
        {checklist.length > 0 && (
          <button 
            onClick={handleExport}
            className="shrink-0 flex items-center gap-2 px-4 py-2 border border-line rounded-8 text-[13px] font-semibold text-slate hover:bg-slate/5 hover:text-ink transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
      </div>

      {checklist.length === 0 ? (
        <div className="text-center text-slate py-12 bg-white border border-line rounded-12 shadow-sm flex flex-col items-center">
          <ListChecks className="w-8 h-8 mb-3 text-slate opacity-50" />
          <p className="text-[14px]">No specific action items generated for this document.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex-1 h-2 bg-slate/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            <span className="text-[13px] font-medium text-slate tabular-nums">{progress}%</span>
          </div>

          <div className="space-y-3">
            {checklist.map((item, idx) => {
              const isChecked = checkedItems.has(idx);
              const isExpanded = expandedItems.has(idx);

              return (
                <div 
                  key={`chk-${idx}`} 
                  className={`border rounded-12 transition-all duration-300 ${isChecked ? 'bg-slate/5 border-transparent' : 'bg-white border-line shadow-sm hover:border-line/80'}`}
                >
                  <div className="px-5 py-4 flex items-start gap-4">
                    <button 
                      onClick={() => toggleCheck(idx)}
                      className={`shrink-0 w-6 h-6 rounded-[6px] border flex items-center justify-center transition-colors mt-0.5
                        ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate/30 bg-slate/5 text-transparent hover:border-slate/50'}
                      `}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                    
                    <div className="flex-1 min-w-0 flex flex-col gap-2">
                      <div 
                        className="flex items-start justify-between gap-4 cursor-pointer select-none"
                        onClick={() => toggleExpand(idx)}
                      >
                        <h4 className={`text-[15px] font-semibold transition-colors ${isChecked ? 'text-slate line-through' : 'text-ink'}`}>
                          {item.title}
                        </h4>
                        <button className="text-slate hover:text-ink shrink-0 p-1 -mr-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {item.priority && !isChecked && (
                        <div className="flex items-center gap-1.5">
                          {item.priority === 'high' && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                          <span className={`text-[11px] font-bold uppercase tracking-wider ${
                            item.priority === 'high' ? 'text-red-500' :
                            item.priority === 'medium' ? 'text-amber-600' : 'text-slate'
                          }`}>
                            {item.priority} priority
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 ml-10 border-t border-line/50">
                      {item.explanation && (
                        <p className={`text-[14px] leading-relaxed mb-4 ${isChecked ? 'text-slate' : 'text-ink/80'}`}>
                          {item.explanation}
                        </p>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {item.relatedClause && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-4 bg-signal/10 text-signal text-[11px] font-semibold">
                              {item.relatedClause}
                            </span>
                          )}
                          <EvidencePill evidence={item.evidence} />
                        </div>

                        {onAskAboutItem && (
                          <button
                            onClick={() => onAskAboutItem(item.title, item.explanation || item.title)}
                            disabled={isChecked}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-6 text-[12px] font-semibold transition-colors shrink-0
                              ${isChecked 
                                ? 'bg-slate/10 text-slate/50 cursor-not-allowed' 
                                : 'bg-slate/5 text-slate hover:bg-slate/10 hover:text-ink border border-line/50'
                              }
                            `}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Ask about this
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
