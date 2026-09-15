import { MessageSquare, FileText, Scale, ArrowRight, ListChecks, ShieldAlert } from "lucide-react";

export default function RightContextPanel() {
  return (
    <div className="w-[320px] lg:w-[380px] h-full flex flex-col bg-white border-l border-line p-8 overflow-y-auto shrink-0">
      
      <div className="flex-1">
        <h2 className="font-serif text-[22px] font-semibold text-ink mb-2">
          Get more from your documents
        </h2>
        <p className="text-[14px] text-slate leading-relaxed mb-10">
          Ask questions, get clear answers, and see the relevant parts of your document.
        </p>

        <div className="flex flex-col gap-8">
          {[
            {
              icon: MessageSquare,
              title: "Understand",
              desc: "Get plain-language explanations of complex clauses."
            },
            {
              icon: FileText,
              title: "Find key information",
              desc: "Locate specific terms, obligations, and important details."
            },
            {
              icon: Scale,
              title: "Identify potential risks",
              desc: "Spot unusual or high-risk provisions that deserve a closer look."
            },
            {
              icon: ArrowRight, // Or a compare icon if available
              title: "Compare documents",
              desc: "See what's different between two versions."
            },
            {
              icon: ListChecks,
              title: "Create checklists",
              desc: "Get a structured list of points to review."
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-paper border border-line flex items-center justify-center shrink-0 mt-0.5">
                <item.icon className="w-4 h-4 text-signal" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-ink mb-1">{item.title}</h3>
                <p className="text-[13px] text-slate leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 bg-paper/50 rounded-12 p-5 border border-line/50">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-signal shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-[13px] font-semibold text-ink mb-1">
              Sightline provides information, not legal advice.
            </p>
            <p className="text-[12px] text-slate leading-relaxed">
              Always verify important matters and consult a licensed professional for legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
