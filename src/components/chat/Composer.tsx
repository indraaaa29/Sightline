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
    <div className="w-full mx-auto p-4 md:p-6 bg-white border-t border-line">
      <div className="max-w-[720px] mx-auto">
        <div className="flex items-center gap-3 bg-paper/50 rounded-full border border-line px-4 py-2 focus-within:outline focus-within:outline-2 focus-within:outline-signal focus-within:outline-offset-2 transition-shadow">
          <button 
            className="text-slate hover:text-ink transition-colors flex-shrink-0"
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
            placeholder="Ask a question about this document…"
            className="flex-1 bg-transparent border-none outline-none text-ink text-[15px] min-w-0"
            disabled={disabled}
          />
          
          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className={`w-9 h-9 rounded-full flex-shrink-0 transition-colors flex items-center justify-center ${
              message.trim() && !disabled
                ? "bg-signal text-white hover:bg-signal-hover"
                : "bg-slate text-white opacity-50 cursor-not-allowed"
            }`}
            type="button"
            aria-label="Send message"
          >
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
