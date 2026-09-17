"use client";

import { useState, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TrustDisclosure from "@/components/layout/TrustDisclosure";
import EmptyChat from "@/components/chat/EmptyChat";
import ChatThread from "@/components/chat/ChatThread";
import Composer from "@/components/chat/Composer";
import ThinkingIndicator from "@/components/chat/ThinkingIndicator";
import SuggestedQuestions from "@/components/chat/SuggestedQuestions";
import RightContextPanel from "@/components/chat/RightContextPanel";
import UnderstandView from "@/components/chat/UnderstandView";
import KeyInformationView from "@/components/chat/KeyInformationView";
import ClauseExplorerView from "@/components/chat/ClauseExplorerView";
import ObligationsView from "@/components/chat/ObligationsView";
import RiskReviewView from "@/components/chat/RiskReviewView";
import InconsistenciesView from "@/components/chat/InconsistenciesView";
import ChecklistView from "@/components/chat/ChecklistView";
import CompareView from "@/components/chat/CompareView";
import PrepareView from "@/components/chat/PrepareView";
import { UploadedDocument, ChatMessage } from "@/lib/types";
import { FileText, Menu } from "lucide-react";
import Link from "next/link";

export default function Workspace() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<UploadedDocument | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "document" | "summary" | "clauses" | "obligations" | "checklist" | "risk" | "inconsistencies" | "compare" | "prepare">("chat");
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);

  const performOCR = async (file: File, pageCount: number) => {
    if (pageCount > 30) {
      setDocument((prev) => prev ? { ...prev, status: "ocr_failed" } : null);
      setMessages([{
        id: Date.now().toString(),
        role: "agent",
        content: "This scanned document is too long for browser-based OCR. Sightline can currently process up to 30 scanned pages.",
        type: "error"
      }]);
      setIsThinking(false);
      return;
    }

    setDocument((prev) => prev ? { ...prev, status: "ocr_processing" } : null);
    
    try {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/legacy/build/pdf.worker.min.js`;
      
      const Tesseract = await import('tesseract.js');
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const worker = await Tesseract.createWorker('eng');
      const ocrPages: { pageNumber: number; text: string }[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = window.document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error("Could not create canvas context");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        const { data: { text } } = await worker.recognize(dataUrl);
        ocrPages.push({ pageNumber: i, text: text.trim() });
        
        page.cleanup();
        canvas.width = 0;
        canvas.height = 0;
      }
      
      await worker.terminate();
      
      setDocument((prev) => prev ? { 
        ...prev, 
        status: "complete",
        pages: ocrPages,
        extractionMethod: "ocr"
      } : null);
      
      const documentContext = {
        filename: file.name,
        pageCount: pdf.numPages,
        pages: ocrPages,
        extractionMethod: "ocr"
      };
      
      performAnalysis(documentContext);
      
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
         content: chatRes.ok ? chatData.content : "I've successfully extracted the text from your document using OCR. You can ask me about its terms, obligations, or important clauses.",
         type: "text"
       }]);

    } catch (error) {
      console.error("OCR Error:", error);
      setDocument((prev) => prev ? { ...prev, status: "ocr_failed" } : null);
      setMessages([{
        id: Date.now().toString(),
        role: "agent",
        content: "We couldn't read the text in this scanned document.",
        type: "error"
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleAskAboutClause = (title: string, excerpt: string) => {
    setActiveTab("chat");
    const question = `Can you explain the "${title}" clause in more detail?\n\nExcerpt: "${excerpt}"`;
    handleSendMessage(question);
  };

  const performAnalysis = async (documentContext: any) => {
    setDocument((prev) => prev ? { ...prev, analysisStatus: "analyzing" } : null);
    try {
      const res = await fetch("/api/documents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentContext })
      });
      if (res.ok) {
        const data = await res.json();
        setDocument((prev) => prev ? { ...prev, analysisStatus: data.status, analysis: data.analysis } : null);
      } else {
        setDocument((prev) => prev ? { ...prev, analysisStatus: "error" } : null);
      }
    } catch {
      setDocument((prev) => prev ? { ...prev, analysisStatus: "error" } : null);
    }
  };

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
      
      if (data.status === "requires_ocr") {
         await performOCR(file, data.pageCount || 1);
         return;
      }

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
           pages: data.pages,
           extractionMethod: "pdf"
         };
         
         performAnalysis(documentContext);
         
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
    <div className="flex-1 min-w-0 min-h-0 flex overflow-hidden bg-paper w-full h-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
        accept=".pdf,.docx,.jpg,.jpeg,.png"
      />

      <Sidebar 
        documents={document ? [document] : []} 
        onUploadClick={() => fileInputRef.current?.click()} 
      />
      
      <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full relative">
        
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
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-slate shrink-0" strokeWidth={1.5} />
                  <span className="text-[14px] font-medium text-ink truncate max-w-[200px] md:max-w-[400px]">{document.filename}</span>
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
        <div className="flex-1 min-h-0 min-w-0 flex overflow-hidden">
          
          {/* Center Column (Chat / Empty State) */}
          <div className="flex-1 min-w-0 min-h-0 flex flex-col items-center overflow-y-auto">
            {!hasStartedChat ? (
              <div className="w-full h-full flex items-center justify-center">
                <EmptyChat onFileSelect={handleFileSelect} />
              </div>
            ) : (
              <div className="w-full max-w-[800px] flex flex-col flex-1 pb-4">
                {/* Document tabs */}
                <div className="flex justify-center border-b border-line px-6 pt-6 mb-6">
                  <div className="flex items-center gap-10">
                    {[
                      { id: "chat", label: "Chat" },
                      { id: "document", label: "Key Info" },
                      { id: "summary", label: "Understand" },
                      { id: "clauses", label: "Clauses" },
                      { id: "obligations", label: "Obligations" },
                      { id: "checklist", label: "Checklist" },
                      { id: "risk", label: "Risk Review" },
                      { id: "inconsistencies", label: "Conflicts" },
                      { id: "compare", label: "Compare" },
                      { id: "prepare", label: "Prepare" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-3 text-[14px] font-medium transition-colors relative ${
                          activeTab === tab.id ? "text-ink" : "text-slate/70 hover:text-ink"
                        }`}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <div className="absolute -bottom-px left-0 right-0 h-[2px] bg-signal rounded-t-full" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Thread */}
                {activeTab === "chat" && (
                  <>
                    <ChatThread messages={messages} document={document || undefined} />
                    {messages.filter(m => m.role === 'user').length === 0 && document && document.status === "complete" && (
                      <div className="px-4 md:px-6 w-full max-w-[720px] mx-auto">
                        <SuggestedQuestions document={document} onQuestionClick={handleSendMessage} />
                      </div>
                    )}
                    {isThinking && (
                      <div className="px-6 w-full mt-2">
                        <ThinkingIndicator />
                      </div>
                    )}
                  </>
                )}
                {activeTab === "summary" && document && (
                  <UnderstandView document={document} />
                )}
                {activeTab === "document" && document && (
                  <KeyInformationView document={document} />
                )}
                {activeTab === "clauses" && document && (
                  <ClauseExplorerView document={document} onAskAboutClause={handleAskAboutClause} />
                )}
                {activeTab === "compare" && document && (
                  <CompareView documentA={document} />
                )}
                {activeTab === "obligations" && document && (
                  <ObligationsView document={document} />
                )}
                {activeTab === "checklist" && document && (
                  <ChecklistView document={document} onAskAboutItem={handleAskAboutClause} />
                )}
                {activeTab === "risk" && document && (
                  <RiskReviewView document={document} />
                )}
                {activeTab === "inconsistencies" && document && (
                  <InconsistenciesView document={document} />
                )}
                {activeTab === "prepare" && document && (
                  <PrepareView document={document} />
                )}
                {activeTab !== "chat" && activeTab !== "summary" && activeTab !== "document" && activeTab !== "clauses" && activeTab !== "compare" && activeTab !== "obligations" && activeTab !== "checklist" && activeTab !== "risk" && activeTab !== "inconsistencies" && activeTab !== "prepare" && (
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
             <div className="hidden xl:flex shrink-0 h-full">
               <RightContextPanel />
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
