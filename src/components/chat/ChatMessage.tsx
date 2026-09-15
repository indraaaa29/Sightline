import { ChatMessage as ChatMessageType } from "@/lib/types";
import DocumentExcerptCard from "./DocumentExcerptCard";
import DocumentComparison from "./DocumentComparison";
import ChecklistResponse from "./ChecklistResponse";

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex w-full mb-6 justify-end opacity-0 animate-[fadeIn_150ms_ease-out_forwards]">
        <div className="bg-panel px-4 py-3 rounded-8 rounded-tr-[2px] max-w-[85%]">
          <p className="text-[14px] text-ink leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  // AI Message
  return (
    <div className="flex w-full mb-8 justify-start items-start gap-4 opacity-0 animate-[fadeIn_150ms_ease-out_forwards]">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full border border-line bg-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
        <span className="text-[13px] font-bold text-ink">S</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 max-w-[720px] space-y-4">
        <p className="text-[14px] font-semibold text-ink">Sightline</p>
        <p className="text-[15px] text-ink leading-relaxed whitespace-pre-wrap">{message.content}</p>

        {/* Render specialized components based on type */}
        {message.type === "excerpt" && message.metadata && (
          <DocumentExcerptCard 
            clause={message.metadata.clause}
            highlight={message.metadata.highlight}
            plainLanguage={message.metadata.plainLanguage}
            riskLevel={message.metadata.riskLevel}
          />
        )}

        {message.type === "comparison" && message.metadata && (
          <DocumentComparison 
            docA={message.metadata.docA}
            docB={message.metadata.docB}
            explanation={message.metadata.explanation}
          />
        )}

        {message.type === "checklist" && message.metadata && (
          <ChecklistResponse 
            items={message.metadata.items}
          />
        )}
      </div>
    </div>
  );
}
