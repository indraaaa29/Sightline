import { UploadedDocument, DocumentStatus } from "@/lib/types";
import { FileText, Loader2 } from "lucide-react";

interface UploadProgressProps {
  document: UploadedDocument;
}

export default function UploadProgress({ document }: UploadProgressProps) {
  // Map status to progress percentage
  const progressMap: Record<DocumentStatus, number> = {
    uploading: 33,
    extracting: 66,
    indexing: 90,
    complete: 100,
    error: 100,
    extraction_failed: 100,
    unreadable: 100
  };

  const currentProgress = progressMap[document.status] || 0;

  return (
    <div className="flex justify-end w-full mb-6">
      <div className="bg-panel rounded-12 p-4 max-w-[320px] w-full">
        <div className="flex items-center gap-3 mb-3">
          <FileText className="w-8 h-8 text-signal" />
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-medium text-ink truncate">{document.filename}</p>
            <p className="text-[13px] text-slate">{(document.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
        </div>

        {["error", "extraction_failed", "unreadable"].includes(document.status) ? (
          <div className="mt-2 text-[13px] text-error font-medium">
            {document.status === "unreadable" 
              ? "This PDF appears to be a scanned image and lacks readable text." 
              : document.status === "extraction_failed"
              ? "Extraction failed. Make sure this is a valid, unencrypted PDF."
              : "This file couldn't be processed. Try a PDF under 20MB."}
          </div>
        ) : (
          <div>
            <div className="h-1.5 w-full bg-line rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-signal transition-all duration-500 ease-in-out" 
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-[13px] text-slate capitalize font-medium">
              {document.status !== "complete" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {document.status === "complete" ? "Ready" : document.status + "..."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
