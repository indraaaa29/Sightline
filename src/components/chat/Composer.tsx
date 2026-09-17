import { useState, useRef, useEffect } from "react";
import { ArrowRight, Paperclip } from "lucide-react";

interface ComposerProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function Composer({ onSendMessage, disabled = false }: ComposerProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full mx-auto pb-4 pt-2">
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-center gap-4 bg-white rounded-[28px] border border-line px-5 py-2.5 focus-within:border-signal/50 focus-within:shadow-[0_4px_24px_rgba(16,36,43,0.06)] transition-all duration-200 shadow-sm">
          <button 
            className="text-slate hover:text-ink transition-colors flex-shrink-0 ml-1"
            type="button"
            aria-label="Attach file"
            disabled={disabled}
          >
            <Paperclip className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document..."
            aria-label="Message input"
            className="flex-1 bg-transparent border-none outline-none text-ink text-[15px] placeholder:text-slate/60 min-w-0"
            disabled={disabled}
          />
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className={`w-10 h-10 rounded-full flex-shrink-0 transition-all flex items-center justify-center ${
              message.trim() && !disabled
                ? "bg-signal text-white hover:bg-signal-hover shadow-sm"
                : "bg-slate/10 text-slate/40 cursor-not-allowed"
            }`}
            type="button"
            aria-label="Send message"
          >
            <ArrowRight className="w-[18px] h-[18px]" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
