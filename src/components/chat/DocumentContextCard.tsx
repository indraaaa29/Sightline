import { UploadedDocument } from "@/lib/types";
import { FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface DocumentContextCardProps {
  document: UploadedDocument;
}

export default function DocumentContextCard({ document }: DocumentContextCardProps) {
  const isError = ["error", "extraction_failed", "unreadable", "ocr_failed"].includes(document.status);
  const isComplete = document.status === "complete";
  
  // Status configuration
  let statusColor = "text-signal bg-signal/10 border-signal/20";
  let StatusIcon = Loader2;
  let statusText = "Processing...";
  let subMessage = "Sightline is analyzing your document...";

  if (isComplete) {
    statusColor = "text-success bg-[#E8F3ED] border-[#356B52]/20";
    StatusIcon = CheckCircle2;
    statusText = "Ready";
    subMessage = "This document is ready. You can now ask questions or use the tools above.";
  } else if (isError) {
    statusColor = "text-error bg-error/10 border-error/20";
    StatusIcon = AlertCircle;
    statusText = "Failed";
    
    if (document.status === "unreadable") {
      subMessage = "This PDF appears to be a scanned image and lacks readable text.";
    } else if (document.status === "extraction_failed") {
      subMessage = "Extraction failed. Make sure this is a valid, unencrypted PDF.";
    } else if (document.status === "ocr_failed") {
      subMessage = "We couldn't read the text from this scanned document.";
    } else {
      subMessage = "This file couldn't be processed. Try a PDF under 20MB.";
    }
  } else {
    // Processing states
    if (document.status === "ocr_processing" || document.status === "requires_ocr") {
      statusText = "Reading scanned pages...";
      subMessage = "Performing OCR on scanned document...";
    } else if (document.status === "extracting") {
      statusText = "Reading document...";
    } else {
      statusText = document.status + "...";
    }
  }

  // Determine file type string
  const extension = document.filename.split('.').pop()?.toUpperCase() || 'DOCUMENT';

  return (
    <div className="w-full bg-white border border-line rounded-12 shadow-sm mb-6 overflow-hidden">
      <div className="p-4 md:p-5 flex flex-col gap-4">
        
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-6 h-6 text-signal shrink-0" strokeWidth={1.5} />
            <span className="text-[15px] font-medium text-ink truncate">{document.filename}</span>
          </div>
          
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[13px] font-medium whitespace-nowrap shrink-0 ${statusColor}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${!isComplete && !isError ? 'animate-spin' : ''}`} />
            {statusText}
          </div>
        </div>
        
        {/* Metadata Row */}
        <div className="flex items-center text-[13px] text-slate gap-1.5">
          <span>{(document.size / 1024 / 1024).toFixed(1)} MB</span>
          <span>•</span>
          <span>{extension}</span>
          {document.pageCount && (
            <>
              <span>•</span>
              <span>{document.pageCount} pages</span>
            </>
          )}
        </div>

        {/* Separator and Message */}
        <div className="h-px w-full bg-line" />
        <p className="text-[14px] text-ink">
          {subMessage}
        </p>
      </div>
    </div>
  );
}
