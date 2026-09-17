"use client";

import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, Download, CheckCircle2, Briefcase, FileQuestion, FolderOpen, AlertCircle, MessageSquare } from "lucide-react";
import { generatePDFReport } from "@/lib/utils/pdfExport";

interface PrepareViewProps {
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

export default function PrepareView({ document }: PrepareViewProps) {
  if (document.analysisStatus === "analyzing" || !document.analysis) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-signal" />
        <p className="text-[14px] font-medium text-ink">Building preparation package...</p>
      </div>
    );
  }

  if (document.analysisStatus === "error") {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Analysis failed</p>
        <p className="text-[13px] opacity-70 mt-1">We couldn't generate the review package.</p>
      </div>
    );
  }

  const prep = document.analysis.reviewPrep;

  if (!prep) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Briefcase className="w-8 h-8 mb-4 opacity-50" />
        <p className="text-[14px] font-medium">Preparation package unavailable</p>
        <p className="text-[13px] opacity-70 mt-1">This document type did not yield a review package.</p>
      </div>
    );
  }

  const handleExport = () => {
    const sections = [];

    if (prep.keyPoints && prep.keyPoints.length > 0) {
      sections.push({
        title: "What Sightline found",
        content: prep.keyPoints.map(kp => `• ${kp}`)
      });
    }

    if (prep.questionsToAsk && prep.questionsToAsk.length > 0) {
      sections.push({
        title: "Questions to ask",
        content: prep.questionsToAsk.map(q => `• ${q.question}${q.evidence?.pageNumber ? ` (Page ${q.evidence.pageNumber})` : ''}`)
      });
    }

    if (prep.areasToDiscuss && prep.areasToDiscuss.length > 0) {
      sections.push({
        title: "Areas worth discussing",
        content: prep.areasToDiscuss.map(a => `• ${a}`)
      });
    }

    if (prep.informationToGather && prep.informationToGather.length > 0) {
      sections.push({
        title: "Information to gather",
        content: prep.informationToGather.map(i => `• ${i}`)
      });
    }

    if (prep.unresolvedItems && prep.unresolvedItems.length > 0) {
      sections.push({
        title: "Unresolved questions",
        content: prep.unresolvedItems.map(u => `• ${u.issue}\n  ${u.explanation}${u.evidence?.pageNumber ? ` (Page ${u.evidence.pageNumber})` : ''}`)
      });
    }

    generatePDFReport({
      documentName: document.filename,
      reportTitle: "Prepare for Review",
      sections
    });
  };

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h3 className="text-[20px] font-bold text-ink mb-2">Prepare for Review</h3>
          <p className="text-[14px] text-slate leading-relaxed">
            Organize your thoughts before consulting a licensed professional. 
            <br className="hidden md:block"/>
            <span className="text-[12px] opacity-80 italic mt-1 inline-block">Note: Sightline provides information, not legal advice.</span>
          </p>
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
        {/* 1. Key Points */}
        {prep.keyPoints && prep.keyPoints.length > 0 && (
          <section className="bg-white border border-line rounded-12 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-ink">
              <CheckCircle2 className="w-5 h-5 text-signal" />
              <h4 className="text-[15px] font-bold">What Sightline found</h4>
            </div>
            <ul className="space-y-3">
              {prep.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[14px] text-ink leading-relaxed">
                  <span className="text-signal shrink-0 mt-1">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 2. Questions to Ask */}
        {prep.questionsToAsk && prep.questionsToAsk.length > 0 && (
          <section className="bg-white border border-line rounded-12 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-ink">
              <FileQuestion className="w-5 h-5 text-signal" />
              <h4 className="text-[15px] font-bold">Questions to ask</h4>
            </div>
            <div className="space-y-4">
              {prep.questionsToAsk.map((q, idx) => (
                <div key={idx} className="bg-slate/5 border border-line/50 rounded-8 p-4">
                  <p className="text-[14px] font-medium text-ink leading-relaxed mb-1">{q.question}</p>
                  <EvidencePill evidence={q.evidence} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Areas to Discuss */}
        {prep.areasToDiscuss && prep.areasToDiscuss.length > 0 && (
          <section className="bg-white border border-line rounded-12 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-ink">
              <MessageSquare className="w-5 h-5 text-signal" />
              <h4 className="text-[15px] font-bold">Areas worth discussing</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {prep.areasToDiscuss.map((area, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-signal/10 text-signal border border-signal/20 rounded-6 text-[13px] font-medium">
                  {area}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 4. Information to Gather */}
        {prep.informationToGather && prep.informationToGather.length > 0 && (
          <section className="bg-white border border-line rounded-12 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-ink">
              <FolderOpen className="w-5 h-5 text-signal" />
              <h4 className="text-[15px] font-bold">Information to gather</h4>
            </div>
            <p className="text-[13px] text-slate mb-3">You may want to bring these related items to your review:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {prep.informationToGather.map((info, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate/5 border border-line/50 rounded-6 px-3 py-2">
                  <div className="w-4 h-4 border border-line rounded-[4px] bg-white shrink-0" />
                  <span className="text-[13px] text-ink font-medium truncate">{info}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Unresolved Items */}
        {prep.unresolvedItems && prep.unresolvedItems.length > 0 && (
          <section className="bg-white border border-line rounded-12 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-ink">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h4 className="text-[15px] font-bold">Unresolved questions</h4>
            </div>
            <div className="space-y-4">
              {prep.unresolvedItems.map((item, idx) => (
                <div key={idx} className="border border-line/80 rounded-8 overflow-hidden">
                  <div className="bg-amber-500/5 px-4 py-3 border-b border-line/50">
                    <h5 className="text-[14px] font-semibold text-ink">{item.issue}</h5>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-[13px] text-ink/80 leading-relaxed">{item.explanation}</p>
                    <div className="mt-2 block">
                      <EvidencePill evidence={item.evidence} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
