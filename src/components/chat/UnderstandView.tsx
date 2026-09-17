"use client";

import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, Info, CheckCircle2, Users, BookOpen, Calendar, DollarSign, Search, Download } from "lucide-react";
import { generatePDFReport } from "@/lib/utils/pdfExport";

interface UnderstandViewProps {
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

export default function UnderstandView({ document }: UnderstandViewProps) {
  if (document.analysisStatus === "analyzing" || !document.analysis) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-signal" />
        <p className="text-[14px] font-medium text-ink">Analyzing document...</p>
        <p className="text-[13px] opacity-70 mt-1">Generating a concise, adaptive summary.</p>
      </div>
    );
  }

  if (document.analysisStatus === "error") {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Analysis failed</p>
        <p className="text-[13px] opacity-70 mt-1">We couldn't generate the document intelligence.</p>
      </div>
    );
  }

  const { analysis } = document;

  const handleExport = () => {
    if (!analysis) return;
    
    const sections = [];
    
    if (analysis.summary) {
      sections.push({ title: "What this document is", content: [analysis.summary] });
    }
    
    if (analysis.keyPoints && analysis.keyPoints.length > 0) {
      sections.push({ 
        title: "Key points", 
        content: analysis.keyPoints.map(kp => `• ${kp.point}${kp.evidence?.pageNumber ? ` (Page ${kp.evidence.pageNumber})` : ''}`)
      });
    }

    if (analysis.parties && analysis.parties.length > 0) {
      sections.push({ 
        title: "Parties involved", 
        content: analysis.parties.map(p => `${p.name} - ${p.role}`)
      });
    }

    if (analysis.importantTerms && analysis.importantTerms.length > 0) {
      sections.push({ 
        title: "Important terms", 
        content: analysis.importantTerms.map(t => `${t.term}: ${t.description}`)
      });
    }

    if (analysis.financialTerms && analysis.financialTerms.length > 0) {
      sections.push({ 
        title: "Financial terms", 
        content: analysis.financialTerms.map(f => `${f.amount ? `${f.amount} - ` : ''}${f.description}`)
      });
    }

    if (analysis.areasToReview && analysis.areasToReview.length > 0) {
      sections.push({ 
        title: "Potential areas to review", 
        content: analysis.areasToReview.map(a => `• ${a.description}${a.evidence?.pageNumber ? ` (Page ${a.evidence.pageNumber})` : ''}`)
      });
    }

    generatePDFReport({
      documentName: document.filename,
      reportTitle: "Document Summary",
      sections
    });
  };

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      {document.analysisStatus === "partial" && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-8 flex gap-3 text-amber-800">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[14px] leading-relaxed">
            <strong>Document too long for full analysis.</strong> We've summarized the first portion of the document.
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h3 className="text-[20px] font-bold text-ink mb-2">Document Summary</h3>
          <p className="text-[14px] text-slate">A quick, plain-language overview based exclusively on the uploaded document.</p>
        </div>
        <button 
          onClick={handleExport}
          className="shrink-0 flex items-center gap-2 px-4 py-2 border border-line rounded-8 text-[13px] font-semibold text-slate hover:bg-slate/5 hover:text-ink transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="space-y-8">
        
        {/* WHAT THIS DOCUMENT IS */}
        {(analysis.summary || analysis.documentType) && (
          <div className="bg-white border border-line rounded-12 p-6 shadow-sm">
            <h4 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info className="w-4 h-4" /> What this document is
            </h4>
            {analysis.documentType && (
              <span className="inline-block px-3 py-1 bg-signal/10 text-signal font-semibold text-[13px] rounded-full mb-4">
                {analysis.documentType}
              </span>
            )}
            {analysis.summary && (
              <p className="text-[15px] text-ink leading-relaxed font-medium">
                {analysis.summary}
              </p>
            )}
          </div>
        )}

        {/* KEY POINTS */}
        {analysis.keyPoints && analysis.keyPoints.length > 0 && (
          <div className="bg-white border border-line rounded-12 p-6 shadow-sm">
            <h4 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Key points
            </h4>
            <ul className="space-y-3">
              {analysis.keyPoints.map((point, idx) => (
                <li key={`kp-${idx}`} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-signal mt-2 shrink-0" />
                  <p className="text-[14px] text-ink leading-relaxed">
                    {point.point}
                    <EvidencePill evidence={point.evidence} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* PEOPLE / PARTIES INVOLVED */}
        {analysis.parties && analysis.parties.length > 0 && (
          <div className="bg-white border border-line rounded-12 p-6 shadow-sm">
            <h4 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> People / Parties involved
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysis.parties.map((party, idx) => (
                <div key={`pty-${idx}`} className="p-3 bg-slate/5 rounded-8 border border-line/50">
                  <span className="text-[13px] font-semibold text-ink block">{party.name}</span>
                  <span className="text-[12px] text-slate mt-0.5 block">{party.role}</span>
                  {party.evidence && (
                    <div className="mt-2 block"><EvidencePill evidence={party.evidence} /></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMPORTANT TERMS */}
        {analysis.importantTerms && analysis.importantTerms.length > 0 && (
          <div className="bg-white border border-line rounded-12 p-6 shadow-sm">
            <h4 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Important terms
            </h4>
            <div className="space-y-4 divide-y divide-line/50">
              {analysis.importantTerms.map((term, idx) => (
                <div key={`term-${idx}`} className={idx > 0 ? "pt-4" : ""}>
                  <p className="text-[14px] text-ink leading-relaxed">
                    <span className="font-semibold">{term.term}:</span> {term.description}
                    <EvidencePill evidence={term.evidence} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* IMPORTANT DATES */}
        {analysis.importantDates && analysis.importantDates.length > 0 && (
          <div className="bg-white border border-line rounded-12 p-6 shadow-sm">
            <h4 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Important dates
            </h4>
            <div className="space-y-3">
              {analysis.importantDates.map((date, idx) => (
                <div key={`date-${idx}`} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span className="text-[14px] font-semibold text-ink sm:w-1/3 shrink-0">{date.date}</span>
                  <p className="text-[14px] text-slate leading-relaxed">
                    {date.description}
                    <EvidencePill evidence={date.evidence} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FINANCIAL TERMS */}
        {analysis.financialTerms && analysis.financialTerms.length > 0 && (
          <div className="bg-white border border-line rounded-12 p-6 shadow-sm">
            <h4 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Financial terms
            </h4>
            <div className="space-y-4">
              {analysis.financialTerms.map((fin, idx) => (
                <div key={`fin-${idx}`} className="p-4 bg-slate/5 rounded-8 border border-line/50">
                  {fin.amount && (
                    <span className="text-[15px] font-bold text-ink block mb-1">{fin.amount}</span>
                  )}
                  <p className="text-[14px] text-slate leading-relaxed">
                    {fin.description}
                    <EvidencePill evidence={fin.evidence} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* POTENTIAL AREAS TO REVIEW */}
        {analysis.areasToReview && analysis.areasToReview.length > 0 && (
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-12 p-6 shadow-sm">
            <h4 className="text-[12px] font-bold text-amber-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search className="w-4 h-4" /> Potential areas to review
            </h4>
            <ul className="space-y-3">
              {analysis.areasToReview.map((area, idx) => (
                <li key={`area-${idx}`} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <p className="text-[14px] text-ink leading-relaxed">
                    {area.description}
                    <EvidencePill evidence={area.evidence} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
