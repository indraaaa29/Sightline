import { FileText, Search, AlertTriangle, ArrowRight, CheckSquare } from "lucide-react";

export default function CapabilityRow() {
  const capabilities = [
    {
      icon: FileText,
      title: "Understand",
      desc: "Get plain-language explanations."
    },
    {
      icon: Search,
      title: "Find key information",
      desc: "Locate specific terms and obligations."
    },
    {
      icon: AlertTriangle,
      title: "Identify potential risks",
      desc: "Spot unusual or high-risk provisions."
    },
    {
      icon: ArrowRight, // Or a compare icon
      title: "Compare documents",
      desc: "See what's different between versions."
    },
    {
      icon: CheckSquare,
      title: "Create checklists",
      desc: "Get a structured list of points to review."
    }
  ];

  return (
    <div className="w-full bg-white border-y border-line overflow-hidden py-2 md:py-4">
      {/* Container that handles the infinite horizontal scrolling */}
      <div className="flex w-[200%] md:w-[150%] animate-marquee hover:[animation-play-state:paused] group">
        
        {/* First Set of Items */}
        <div className="flex-1 flex justify-around items-center">
          {capabilities.map((cap, idx) => (
            <div key={`set1-${idx}`} className="flex items-center gap-3 px-6 md:px-12 py-4 border-r border-transparent">
              <div className="w-10 h-10 rounded-full border border-line bg-paper flex items-center justify-center shrink-0">
                <cap.icon className="w-4 h-4 text-signal" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-[14px] font-bold text-ink whitespace-nowrap">{cap.title}</h3>
                <p className="text-[13px] text-slate whitespace-nowrap hidden sm:block">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Duplicated Set of Items to allow infinite loop without visible gap */}
        <div className="flex-1 flex justify-around items-center">
          {capabilities.map((cap, idx) => (
            <div key={`set2-${idx}`} className="flex items-center gap-3 px-6 md:px-12 py-4 border-r border-transparent">
              <div className="w-10 h-10 rounded-full border border-line bg-paper flex items-center justify-center shrink-0">
                <cap.icon className="w-4 h-4 text-signal" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-[14px] font-bold text-ink whitespace-nowrap">{cap.title}</h3>
                <p className="text-[13px] text-slate whitespace-nowrap hidden sm:block">{cap.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
