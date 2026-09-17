"use client";

import { useState, useRef } from "react";
import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, FileText, Upload, GitCompare, GitBranch } from "lucide-react";

interface CompareViewProps {
  documentA: UploadedDocument;
}

interface ComparisonChange {
  topic: string;
  versionA: { text: string; pageNumber: number };
  versionB: { text: string; pageNumber: number };
  whyItMatters: string;
}

const EvidencePill = ({ pageNumber, onClick }: { pageNumber?: number, onClick?: () => void }) => {
  if (!pageNumber) return null;
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-4 bg-slate/10 text-slate text-[11px] font-medium border border-line cursor-help transition-colors hover:bg-slate/20 hover:text-ink mt-2"
    >
      Page {pageNumber}
    </span>
  );
};

export default function CompareView({ documentA }: CompareViewProps) {
  const [documentB, setDocumentB] = useState<UploadedDocument | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [changes, setChanges] = useState<ComparisonChange[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setCompareError("File exceeds 20MB limit.");
      return;
    }

    setCompareError(null);
    setDocumentB({
      id: Math.random().toString(36).substr(2, 9),
      filename: file.name,
      size: file.size,
      status: "uploading"
    });

    try {
      setDocumentB((prev) => prev ? { ...prev, status: "extracting" } : null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/documents/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract");
      
      if (data.status === "requires_ocr") {
         setCompareError("Document requires OCR. This view currently only supports text extraction for the comparison file.");
         setDocumentB(null);
         return;
      }

      if (data.status === "unreadable") {
         setCompareError("Document contains no readable text.");
         setDocumentB(null);
         return;
      }

      const docBContext = {
        filename: file.name,
        pageCount: data.pageCount,
        pages: data.pages,
        extractionMethod: "pdf"
      };

      setDocumentB((prev) => prev ? { 
        ...prev, 
        status: "complete", 
        pageCount: data.pageCount, 
        pages: data.pages 
      } : null);

      // Now we have both docs, let's compare
      setIsComparing(true);
      
      const compareRes = await fetch("/api/documents/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentAContext: {
            filename: documentA.filename,
            pages: documentA.pages
          },
          documentBContext: docBContext
        })
      });

      const compareData = await compareRes.json();
      if (!compareRes.ok) throw new Error(compareData.error || "Failed to compare");

      setChanges(compareData.changes || []);

    } catch (e: any) {
      console.error(e);
      setCompareError(e.message || "An error occurred during comparison.");
      setDocumentB(null);
    } finally {
      setIsComparing(false);
    }
  };

  // 1. Initial State: Upload Document B
  if (!documentB && !isComparing && !compareError) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-16 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
        <div className="mb-8">
          <h3 className="text-[20px] font-bold text-ink mb-2">Compare Documents</h3>
          <p className="text-[14px] text-slate">Upload a second document to compare against <span className="font-semibold text-ink">{documentA.filename}</span>.</p>
        </div>

        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-line rounded-16 p-12 bg-slate/5 hover:bg-slate/10 hover:border-slate/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <Upload className="w-6 h-6 text-signal" />
          </div>
          <div className="text-center">
            <p className="text-[15px] font-semibold text-ink mb-1">Click to upload Document B</p>
            <p className="text-[13px] text-slate">PDF files up to 20MB</p>
          </div>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="application/pdf"
          onChange={handleFileSelect}
        />
      </div>
    );
  }

  // 2. Loading State: Extracting or Comparing
  if (isComparing || (documentB && documentB.status !== "complete")) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate opacity-0 animate-[fadeIn_300ms_ease-out_forwards]">
        <div className="relative mb-6 flex items-center justify-center w-16 h-16">
           <GitCompare className="w-8 h-8 text-signal animate-pulse" />
           <Loader2 className="w-16 h-16 absolute inset-0 animate-[spin_3s_linear_infinite] opacity-20 text-signal" />
        </div>
        <p className="text-[15px] font-medium text-ink">
          {documentB?.status === "extracting" ? "Extracting text from Document B..." : "Analyzing substantive changes..."}
        </p>
        <p className="text-[13px] opacity-70 mt-1">This may take up to a minute depending on document length.</p>
      </div>
    );
  }

  // 3. Error State
  if (compareError) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Comparison failed</p>
        <p className="text-[13px] opacity-70 mt-1">{compareError}</p>
        <button 
          onClick={() => { setCompareError(null); setDocumentB(null); }}
          className="mt-6 px-4 py-2 border border-line rounded-8 text-ink text-[13px] hover:bg-slate/5 transition-colors"
        >
          Try a different document
        </button>
      </div>
    );
  }

  // 4. Complete State: Render Comparison
  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h3 className="text-[20px] font-bold text-ink mb-2">Document Comparison</h3>
          <p className="text-[14px] text-slate">
            Comparing <span className="font-semibold text-ink">{documentA.filename}</span> with <span className="font-semibold text-ink">{documentB?.filename}</span>.
          </p>
        </div>
        <button 
          onClick={() => { setChanges([]); setDocumentB(null); setCompareError(null); }}
          className="shrink-0 px-4 py-2 border border-line rounded-8 text-[13px] font-semibold text-slate hover:bg-slate/5 hover:text-ink transition-colors"
        >
          New Comparison
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-[12px] font-bold text-slate uppercase tracking-wider">
          {changes.length} meaningful {changes.length === 1 ? 'change' : 'changes'} found
        </h4>
      </div>

      {changes.length === 0 ? (
        <div className="text-center text-slate py-12 bg-white border border-line rounded-12 shadow-sm flex flex-col items-center">
          <GitBranch className="w-8 h-8 mb-3 text-emerald-500 opacity-80" />
          <p className="text-[14px]">No substantive changes were identified between these documents.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {changes.map((change, idx) => (
            <div 
              key={`diff-${idx}`} 
              className="bg-white border border-line rounded-12 shadow-sm overflow-hidden animate-[fadeIn_300ms_ease-out_forwards]"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="px-5 py-4 border-b border-line flex items-start gap-3 bg-slate/5">
                <GitCompare className="w-5 h-5 shrink-0 text-signal mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-semibold text-ink mb-1">{change.topic}</h4>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-line bg-slate/50">
                {/* Version A */}
                <div className="p-5 flex flex-col">
                  <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider mb-3">Version A ({documentA.filename})</h5>
                  <div className="flex-1 bg-white border border-line/50 rounded-8 p-4 shadow-sm text-[14px] text-ink leading-relaxed">
                    {change.versionA.text}
                    <div className="block mt-1">
                      <EvidencePill pageNumber={change.versionA.pageNumber} />
                    </div>
                  </div>
                </div>
                {/* Version B */}
                <div className="p-5 flex flex-col">
                  <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider mb-3">Version B ({documentB?.filename})</h5>
                  <div className="flex-1 bg-white border border-line/50 rounded-8 p-4 shadow-sm text-[14px] text-ink leading-relaxed">
                    {change.versionB.text}
                    <div className="block mt-1">
                      <EvidencePill pageNumber={change.versionB.pageNumber} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-5 py-4 border-t border-line bg-white">
                 <h5 className="text-[11px] font-bold text-slate uppercase tracking-wider mb-2">Why it may matter</h5>
                 <p className="text-[14px] text-ink leading-relaxed">{change.whyItMatters}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
