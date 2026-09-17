import { UploadedDocument } from "@/lib/types";
import { FileText, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";

interface SidebarProps {
  documents: UploadedDocument[];
  onUploadClick?: () => void;
}

export default function Sidebar({ documents, onUploadClick }: SidebarProps) {
  return (
    <aside className="w-[280px] shrink-0 bg-deep border-r border-line hidden md:flex flex-col h-full overflow-y-auto">
      {/* Branding */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/" aria-label="Go to Sightline home" className="block hover:opacity-80 transition-opacity">
          <h2 className="font-serif font-semibold text-white text-[20px] leading-tight">Sightline<br/><span className="text-white/60 text-[14px] font-sans font-medium uppercase tracking-widest mt-1 block">Legal Advisor</span></h2>
        </Link>
      </div>

      {/* Upload button */}
      <div className="px-5 py-5">
        <button 
          onClick={onUploadClick}
          className="w-full bg-signal hover:bg-signal-hover text-white text-[15px] font-semibold py-3 rounded-8 transition-colors flex items-center justify-center gap-2"
        >
          <span className="text-[18px] leading-none mb-[2px]">+</span> Upload document
        </button>
      </div>

      {/* Documents List */}
      <div className="flex-1 px-5 pt-2 space-y-3">
        <p className="text-[12px] font-medium text-white/50 tracking-wider">Your documents</p>
        <div className="space-y-1.5">
          {documents.map((doc, idx) => {
            const isActive = idx === documents.length - 1; // Simplistic active state
            return (
              <div 
                key={doc.id} 
                className={`flex items-start gap-3 py-2.5 px-3 rounded-8 border-l-[3px] transition-colors cursor-pointer ${
                  isActive 
                    ? "bg-white/10 border-signal" 
                    : "border-transparent hover:bg-white/5"
                }`}
              >
                <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-white/80" : "text-white/40"}`} strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className={`text-[14px] truncate ${isActive ? "font-medium text-white" : "text-white/70"}`}>
                    {doc.filename}
                  </p>
                  <p className={`text-[11px] mt-0.5 capitalize ${isActive ? "text-white/50" : "text-white/40"}`}>
                    PDF · {doc.status === "complete" ? "Ready" : doc.status}
                  </p>
                </div>
              </div>
            );
          })}
          {documents.length === 0 && (
            <div className="py-4 text-center">
              <p className="text-[13px] text-white/40">No documents yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Settings */}
      <div className="mt-auto p-5 border-t border-white/10 space-y-4">
        <button className="flex items-center gap-3 text-white/60 hover:text-white transition-colors w-full text-[14px]">
          <Settings className="w-4 h-4" strokeWidth={1.5} />
          Settings
        </button>
        <Link href="/" className="flex items-center gap-3 text-white/60 hover:text-white transition-colors w-full text-[14px]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Go to website
        </Link>
      </div>
    </aside>
  );
}
