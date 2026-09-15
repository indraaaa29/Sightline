import { FileText, ArrowRight } from "lucide-react";

export default function HeroAppPreview() {
  return (
    <div className="border border-line rounded-12 overflow-hidden bg-white shadow-elevated">
      <div className="flex min-h-[440px]">
        {/* Sidebar */}
        <div className="hidden sm:flex w-[200px] shrink-0 border-r border-line bg-deep flex-col">
          <div className="px-4 py-4 border-b border-white/10">
            <p className="text-[14px] font-serif text-white font-semibold">Sightline</p>
          </div>
          <div className="px-3 py-3 mt-2">
            <button className="w-full bg-signal hover:bg-signal-hover text-white text-[13px] font-semibold py-2 rounded-6 transition-colors flex items-center justify-center gap-2">
              <span className="text-[16px] leading-none mb-[2px]">+</span> Upload document
            </button>
          </div>
          <div className="px-4 mt-2">
            <p className="text-[11px] font-semibold text-white/50 mb-3 uppercase tracking-wider">Your documents</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 py-2 px-2 bg-white/10 rounded-6 border-l-2 border-signal">
                <FileText className="w-3.5 h-3.5 text-white/70 shrink-0" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-white truncate">Employment...</p>
                  <p className="text-[10px] text-white/50">PDF · Ready</p>
                </div>
              </div>
              <div className="flex items-center gap-2 py-2 px-2 hover:bg-white/5 rounded-6 border-l-2 border-transparent">
                <FileText className="w-3.5 h-3.5 text-white/40 shrink-0" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-white/70 truncate">NDA.pdf</p>
                  <p className="text-[10px] text-white/40">PDF · Ready</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto p-4 border-t border-white/10">
            <p className="text-[11px] text-white/40 flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full border border-white/20 flex items-center justify-center text-[8px]">S</span> Settings</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-paper relative overflow-hidden">
          {/* Header */}
          <div className="h-[52px] border-b border-line bg-white flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate" strokeWidth={1.5} />
              <span className="text-[14px] font-medium text-ink">Employment Agreement.pdf</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] text-slate">Help</span>
              <div className="w-7 h-7 rounded-full bg-ink text-white flex items-center justify-center text-[11px] font-bold">JD</div>
            </div>
          </div>

          {/* Chat Thread */}
          <div className="flex-1 p-5 space-y-5 overflow-hidden">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-panel px-4 py-2.5 rounded-8 rounded-tr-sm max-w-[85%]">
                <p className="text-[13px] text-ink">What are the key termination conditions?</p>
              </div>
            </div>
            <p className="text-[10px] text-slate/60 text-right pr-2 -mt-4">10:24 AM</p>

            {/* AI Response */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full border border-line bg-white flex items-center justify-center shrink-0">
                <span className="text-[12px] font-bold text-ink">S</span>
              </div>
              <div className="flex-1 space-y-3.5">
                <p className="text-[13px] font-semibold text-ink">Sightline</p>
                <p className="text-[13px] text-ink leading-relaxed">
                  The agreement allows either party to terminate with 30 days' written notice, provided that all outstanding obligations have been satisfied in full.
                </p>

                {/* Excerpt card */}
                <div className="bg-white border border-line rounded-8 overflow-hidden shadow-sm">
                  <div className="bg-panel px-4 py-2 border-b border-line">
                    <p className="text-[11px] font-semibold text-slate uppercase tracking-wider">Document excerpt — Section 7</p>
                  </div>
                  <div className="p-4">
                    <p className="text-[13px] text-ink leading-relaxed font-serif">
                      Either party may terminate this Agreement upon thirty (30) days' prior written notice to the other party, <span className="bg-signal-light pb-0.5">provided that all outstanding obligations have been satisfied in full.</span>
                    </p>
                    
                    <div className="inline-flex mt-3 items-center gap-1.5 px-2 py-1 rounded bg-signal-light text-signal">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      <span className="text-[11px] font-medium">Unusual clause</span>
                    </div>
                  </div>
                  <div className="p-4 border-t border-line bg-paper/50">
                    <p className="text-[11px] font-semibold text-ink mb-1.5">Plain language</p>
                    <p className="text-[13px] text-slate leading-relaxed">
                      You can end the agreement with 30 days' notice, but only if you've already completed everything you owe under the contract.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="text-[11px] border border-line rounded-6 px-3 py-1.5 text-slate bg-white flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> View in document
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="px-5 pb-3 flex gap-2 overflow-hidden">
            <button className="whitespace-nowrap text-[11px] border border-line bg-white rounded-6 px-3 py-1.5 text-slate flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Summarize this section
            </button>
            <button className="whitespace-nowrap text-[11px] border border-line bg-white rounded-6 px-3 py-1.5 text-slate flex items-center gap-1.5">
              <ArrowRight className="w-3 h-3" /> Compare with another document
            </button>
          </div>

          {/* Composer */}
          <div className="px-5 py-4 border-t border-line bg-white">
            <div className="flex items-center gap-2 border border-line rounded-full px-4 py-2 bg-paper/50">
              <svg className="w-4 h-4 text-slate" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              <span className="flex-1 text-[13px] text-slate">Ask a question about this document...</span>
              <div className="w-7 h-7 rounded-full bg-signal flex items-center justify-center">
                <ArrowRight className="w-4 h-4 text-white" strokeWidth={2} />
              </div>
            </div>
            <p className="text-[10px] text-slate/70 text-center mt-2.5">Sightline provides information, not legal advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
