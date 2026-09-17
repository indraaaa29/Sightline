import { UploadedDocument } from "@/lib/types";
import { Sparkles, FileText, ArrowRight, Briefcase, Scale, Target, AlertTriangle } from "lucide-react";

interface SuggestedQuestionsProps {
  document: UploadedDocument;
  onQuestionClick: (question: string) => void;
}

export default function SuggestedQuestions({ document, onQuestionClick }: SuggestedQuestionsProps) {
  const getSuggestions = () => {
    const name = document.filename.toLowerCase();
    
    if (name.includes('resume') || name.includes('cv')) {
      return [
        { text: "Summarize this resume in 5 key points", icon: FileText },
        { text: "What are the key skills mentioned?", icon: Briefcase },
        { text: "List the major achievements", icon: Target },
        { text: "How can I improve this resume?", icon: AlertTriangle }
      ];
    }
    
    if (name.includes('nda') || name.includes('non-disclosure')) {
      return [
        { text: "What is the definition of confidential information?", icon: FileText },
        { text: "How long does the confidentiality period last?", icon: Target },
        { text: "Are there any unusual penalties or liabilities?", icon: AlertTriangle },
        { text: "What is the governing law of this agreement?", icon: Scale }
      ];
    }
    
    // Generic fallback
    return [
      { text: "Summarize this document in 5 key points", icon: FileText },
      { text: "What are the most important sections?", icon: Target },
      { text: "What obligations or requirements should I pay attention to?", icon: Briefcase },
      { text: "Are there any provisions that deserve a closer look?", icon: AlertTriangle }
    ];
  };

  const suggestions = getSuggestions();

  return (
    <div className="w-full mb-8 opacity-0 animate-[fadeIn_300ms_ease-out_forwards_300ms]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-signal" />
          <h3 className="text-[14px] font-semibold text-ink">Suggested questions</h3>
        </div>
        <button className="text-[13px] font-medium text-signal hover:text-signal-hover flex items-center gap-1 transition-colors">
          View more <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onQuestionClick(q.text)}
            className="flex items-center justify-between text-left p-4 bg-white border border-line rounded-12 hover:border-signal/50 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <q.icon className="w-5 h-5 text-signal shrink-0" strokeWidth={1.5} />
              <span className="text-[14px] text-ink font-medium truncate">{q.text}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate group-hover:text-signal shrink-0 ml-1 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
