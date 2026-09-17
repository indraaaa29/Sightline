import { useEffect, useRef } from "react";
import { ChatMessage as ChatMessageType, UploadedDocument } from "@/lib/types";
import ChatMessage from "./ChatMessage";
import DocumentContextCard from "./DocumentContextCard";

interface ChatThreadProps {
  messages: ChatMessageType[];
  document?: UploadedDocument;
}

export default function ChatThread({ messages, document }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Standard smooth auto-scroll to newest message
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, document?.status]);

  return (
    <div className="flex-1 w-full max-w-[720px] mx-auto px-4 md:px-6 pt-6 pb-2 flex flex-col">
      {document && (
        <DocumentContextCard document={document} />
      )}
      
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
