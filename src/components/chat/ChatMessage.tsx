import { ChatMessage as ChatMessageType } from "@/lib/types";
import DocumentExcerptCard from "./DocumentExcerptCard";
import DocumentComparison from "./DocumentComparison";
import ChecklistResponse from "./ChecklistResponse";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

  // Parse timestamp safely if message.id is a timestamp
  let timestampStr = "";
  const parsedTime = parseInt(message.id);
  if (!isNaN(parsedTime) && parsedTime > 1600000000000) {
    timestampStr = new Date(parsedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // AI Message
  return (
    <div className="flex w-full mb-8 justify-start items-start gap-4 opacity-0 animate-[fadeIn_150ms_ease-out_forwards]">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-deep text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
        <span className="text-[13px] font-bold">S</span>
      </div>
      
      {/* Content */}
      <div className="flex-1 max-w-[720px] flex flex-col gap-2">
        {/* Header */}
        <div className="flex items-center gap-3 ml-1">
          <span className="text-[14px] font-semibold text-ink">Sightline</span>
          {timestampStr && <span className="text-[12px] text-slate">{timestampStr}</span>}
        </div>
        
        {/* Message Container */}
        <div className="bg-white border border-line rounded-12 p-4 md:p-5 shadow-sm space-y-4">
          <div className="text-[15px] text-ink leading-relaxed">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({node, ...props}) => <p className="mb-4 last:mb-0 whitespace-pre-wrap" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2 mt-3" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-ink" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-slate/5 p-3 rounded-8 text-[13px] font-mono overflow-x-auto mb-4 border border-line" {...props} />,
                code: ({node, className, ...props}) => {
                  const isInline = !className?.includes('language-');
                  return <code className={isInline ? "bg-slate/10 rounded px-1.5 py-0.5 text-[13px] font-mono break-words" : "font-mono text-[13px]"} {...props} />
                },
                a: ({node, ...props}) => <a className="text-signal hover:underline break-words" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-signal/50 pl-4 py-1 my-4 text-slate italic bg-slate/5 rounded-r-4" {...props} />,
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto mb-4 rounded-8 border border-line">
                    <table className="w-full text-left text-[14px]" {...props} />
                  </div>
                ),
                thead: ({node, ...props}) => <thead className="bg-panel border-b border-line text-ink font-semibold" {...props} />,
                tbody: ({node, ...props}) => <tbody className="divide-y divide-line" {...props} />,
                tr: ({node, ...props}) => <tr className="hover:bg-slate/5 transition-colors" {...props} />,
                th: ({node, ...props}) => <th className="px-4 py-3 whitespace-nowrap" {...props} />,
                td: ({node, ...props}) => <td className="px-4 py-3" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

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
    </div>
  );
}
