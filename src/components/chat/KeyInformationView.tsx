import { UploadedDocument, Evidence } from "@/lib/types";
import { Loader2, AlertTriangle, Info } from "lucide-react";

interface KeyInformationViewProps {
  document: UploadedDocument;
}

const EvidencePill = ({ evidence }: { evidence?: Evidence }) => {
  if (!evidence || !evidence.pageNumber) return null;
  return (
    <span 
      className="inline-flex items-center gap-1 px-2 py-0.5 ml-2 rounded-4 bg-slate/10 text-slate text-[11px] font-medium border border-line cursor-help transition-colors hover:bg-slate/20 hover:text-ink"
      title={evidence.sourceExcerpt || evidence.text}
    >
      Page {evidence.pageNumber}
    </span>
  );
};

const InfoRow = ({ label, value, evidence }: { label: string, value: React.ReactNode, evidence?: Evidence }) => (
  <div className="flex flex-col sm:flex-row py-4 border-b border-line last:border-0 gap-2 sm:gap-6">
    <div className="sm:w-1/3 text-[13px] font-semibold text-slate uppercase tracking-wide pt-0.5">
      {label}
    </div>
    <div className="sm:w-2/3 text-[14px] text-ink leading-relaxed">
      {value}
      <EvidencePill evidence={evidence} />
    </div>
  </div>
);

export default function KeyInformationView({ document }: KeyInformationViewProps) {
  if (document.analysisStatus === "analyzing" || !document.analysis) {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-slate">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-signal" />
        <p className="text-[14px] font-medium text-ink">Extracting key information...</p>
        <p className="text-[13px] opacity-70 mt-1">This may take a minute for longer documents.</p>
      </div>
    );
  }

  if (document.analysisStatus === "error") {
    return (
      <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-red-500">
        <AlertTriangle className="w-8 h-8 mb-4" />
        <p className="text-[14px] font-medium">Extraction failed</p>
        <p className="text-[13px] opacity-70 mt-1">We couldn't generate the document intelligence.</p>
      </div>
    );
  }

  const { analysis } = document;

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-8 pb-12 flex flex-col opacity-0 animate-[fadeIn_300ms_ease-out_forwards] overflow-y-auto min-h-0">
      
      {document.analysisStatus === "partial" && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-8 flex gap-3 text-amber-800">
          <Info className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-[14px] leading-relaxed">
            <strong>Document too long for full extraction.</strong> We've extracted information from the first portion of the document.
          </div>
        </div>
      )}

      {/* PARTIES */}
      {analysis.parties && analysis.parties.length > 0 && (
        <div className="mb-10">
          <h3 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Parties</h3>
          <div className="bg-white border border-line rounded-12 px-6 shadow-sm">
            {analysis.parties.map((p, i) => (
              <InfoRow 
                key={`party-${i}`}
                label={p.role} 
                value={<span className="font-medium">{p.name}</span>} 
                evidence={p.evidence} 
              />
            ))}
          </div>
        </div>
      )}

      {/* IMPORTANT DATES */}
      {analysis.importantDates && analysis.importantDates.length > 0 && (
        <div className="mb-10">
          <h3 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Important Dates</h3>
          <div className="bg-white border border-line rounded-12 px-6 shadow-sm">
            {analysis.importantDates.map((d, i) => (
              <InfoRow 
                key={`date-${i}`}
                label={d.description} 
                value={d.date} 
                evidence={d.evidence} 
              />
            ))}
          </div>
        </div>
      )}

      {/* KEY INFORMATION / OTHER MATERIAL FACTS */}
      {analysis.keyInformation && analysis.keyInformation.length > 0 && (
        <div className="mb-10">
          <h3 className="text-[12px] font-bold text-slate uppercase tracking-wider mb-2">Other Material Facts</h3>
          <div className="bg-white border border-line rounded-12 px-6 shadow-sm">
            {analysis.keyInformation.map((k, i) => (
              <InfoRow 
                key={`info-${i}`}
                label={k.label} 
                value={k.value} 
                evidence={k.evidence} 
              />
            ))}
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!analysis.parties?.length && !analysis.importantDates?.length && !analysis.keyInformation?.length && (
        <div className="text-center text-slate py-12">
          <p className="text-[14px]">No specific key information was automatically extracted from this document.</p>
        </div>
      )}
      
    </div>
  );
}
