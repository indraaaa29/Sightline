"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TrustDisclosure from "@/components/layout/TrustDisclosure";
import EmptyChat from "@/components/chat/EmptyChat";
import ChatThread from "@/components/chat/ChatThread";
import Composer from "@/components/chat/Composer";
import ThinkingIndicator from "@/components/chat/ThinkingIndicator";
import RightContextPanel from "@/components/chat/RightContextPanel";
import { UploadedDocument, ChatMessage } from "@/lib/types";
import { uploadDocument } from "@/lib/api/mock";
import { FileText, Menu } from "lucide-react";
import Link from "next/link";

export default function Workspace() {
  const [document, setDocument] = useState<UploadedDocument | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "document" | "summary" | "compare" | "checklist">("chat");

  const handleFileSelect = async (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setDocument({
        id: "err",
        filename: file.name,
        size: file.size,
        status: "error"
      });
      setHasStartedChat(true);
      return;
    }

    const docId = Math.random().toString(36).substr(2, 9);
    
    setDocument({
      id: docId,
      filename: file.name,
      size: file.size,
      status: "uploading"
    });
    setHasStartedChat(true);

    try {
      setDocument((prev) => prev ? { ...prev, status: "extracting" } : null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/documents/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to extract");
      }

      setDocument((prev) => prev ? { 
        ...prev, 
        status: data.status, 
        pageCount: data.pageCount, 
        pages: data.pages 
      } : null);
      
      setIsThinking(true);
      
      if (data.status === "unreadable") {
         setMessages([{
          id: Date.now().toString(),
          role: "agent",
          content: "This PDF doesn't contain machine-readable text. Text extraction could not find readable content. OCR support is required to analyze scanned pages.",
          type: "error"
        }]);
      } else {
         const documentContext = {
           filename: file.name,
           pageCount: data.pageCount,
           pages: data.pages
         };
         
         try {
           const chatRes = await fetch("/api/chat", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
               messages: [{ role: "user", content: "I have uploaded a new document. Please provide a brief 2-sentence summary of what this document is." }],
               documentContext
             })
           });
           const chatData = await chatRes.json();
           
           setMessages([{
             id: Date.now().toString(),
             role: "agent",
             content: chatRes.ok ? chatData.content : "I've successfully extracted the text from your document. You can ask me about its terms, obligations, or important clauses.",
             type: "text"
           }]);
         } catch {
           setMessages([{
             id: Date.now().toString(),
             role: "agent",
             content: "I've successfully extracted the text from your document. You can ask me about its terms, obligations, or important clauses.",
             type: "text"
           }]);
         }
      }
    } catch (e) {
      setDocument((prev) => prev ? { ...prev, status: "extraction_failed" } : null);
      setMessages([{
        id: Date.now().toString(),
        role: "agent",
        content: "I encountered an error trying to extract text from this document. Please make sure it is a valid, readable PDF.",
        type: "error"
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      type: "text"
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          documentContext: document ? { 
            filename: document.filename,
            pageCount: document.pageCount,
            pages: document.pages
          } : null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg: ChatMessage = {
          id: Date.now().toString(),
          role: "agent",
          content: data.error || "Sorry, I encountered an error while connecting to the Legal Advisor.",
          type: "error"
        };
        setMessages((prev) => [...prev, errorMsg]);
      } else {
        const agentMsg: ChatMessage = {
          id: Date.now().toString(),
          role: "agent",
          content: data.content,
          type: "text"
        };
        setMessages((prev) => [...prev, agentMsg]);
      }
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "agent",
        content: "Network error: Unable to reach the Legal Advisor.",
        type: "error"
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-screen bg-paper">
      
      {/* Mobile Header (visible only on small screens) */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-deep z-50 flex items-center px-4 justify-between">
         <div className="flex items-center gap-4">
          <button className="text-white">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex flex-col items-start leading-none">
            <span className="font-serif font-semibold text-[18px] text-white mb-1">Sightline</span>
            <span className="font-sans font-medium text-[10px] text-white/60 uppercase tracking-widest">Legal Advisor</span>
          </Link>
        </div>
      </div>

      <Sidebar 
        documents={document ? [document] : []} 
        onUploadClick={() => document && document.status === "complete" ? alert("Upload handled via workspace in this demo") : null} 
      />
      
      <div className="flex-1 flex flex-col h-full relative pt-16 md:pt-0">
        
        {/* Main Header */}
        <div className="h-[64px] border-b border-line bg-white/60 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-[20px] font-semibold text-ink">Workspace</h1>
            {!hasStartedChat && (
              <>
                <div className="w-px h-5 bg-line" />
                <span className="text-[14px] text-slate hidden sm:block">Upload a document and start asking questions.</span>
              </>
            )}
            {hasStartedChat && document && (
              <>
                <div className="w-px h-5 bg-line" />
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate" strokeWidth={1.5} />
                  <span className="text-[14px] font-medium text-ink">{document.filename}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-6 border border-line text-[13px] font-medium text-ink bg-white hover:bg-panel transition-colors hidden sm:flex">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              How it works
            </button>
            <div className="w-8 h-8 rounded-full bg-slate text-white flex items-center justify-center text-[12px] font-bold">
              JD
            </div>
          </div>
        </div>

        {/* Workspace content area (Dynamic Columns) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Center Column (Chat / Empty State) */}
          <div className="flex-1 flex flex-col items-center overflow-y-auto">
            {!hasStartedChat ? (
              <div className="w-full h-full flex items-center justify-center">
                <EmptyChat onFileSelect={handleFileSelect} />
              </div>
            ) : (
              <div className="w-full max-w-[800px] flex flex-col flex-1 pb-4">
                {/* Document tabs */}
                <div className="flex items-center gap-8 border-b border-line px-6 pt-6 mb-4">
                  {[
                    { id: "chat", label: "Chat" },
                    { id: "document", label: "Document" },
                    { id: "summary", label: "Summary" },
                    { id: "compare", label: "Compare" },
                    { id: "checklist", label: "Checklist" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`pb-3 text-[14px] font-medium transition-colors relative ${
                        activeTab === tab.id ? "text-ink" : "text-slate hover:text-ink"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-ink rounded-t-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Chat Thread */}
                {activeTab === "chat" && (
                  <>
                    <ChatThread messages={messages} document={document || undefined} />
                    {isThinking && (
                      <div className="px-6 w-full mt-2">
                        <ThinkingIndicator />
                      </div>
                    )}
                  </>
                )}
                {activeTab !== "chat" && (
                  <div className="flex-1 flex items-center justify-center text-slate">
                    View not implemented in mock
                  </div>
                )}
              </div>
            )}
            
            {/* Composer and Footer inside Center Column */}
            {hasStartedChat && activeTab === "chat" && (
              <div className="mt-auto w-full max-w-[800px] flex flex-col shrink-0 px-6">
                <Composer 
                  onSendMessage={handleSendMessage} 
                  disabled={isThinking || (document?.status && document.status !== "complete" && document.status !== "error")} 
                />
                <div className="mt-4 mb-4 flex justify-center">
                   <p className="text-[12px] text-slate">Sightline provides information, not legal advice.</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column (Context Panel) - Only visible when NO chat has started */}
          {!hasStartedChat && (
             <div className="hidden xl:block">
               <RightContextPanel />
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
