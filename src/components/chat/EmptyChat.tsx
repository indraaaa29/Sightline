import { FileText, ArrowRight, Search, AlertTriangle, Scale } from "lucide-react";
import { useRef, useState } from "react";

interface EmptyChatProps {
  onFileSelect: (file: File) => void;
}

export default function EmptyChat({ onFileSelect }: EmptyChatProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUploadPrompt, setShowUploadPrompt] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleQuestionClick = () => {
    // Show a prompt reminding the user they need to upload a document first
    setShowUploadPrompt(true);
    // Flash the upload prompt and hide it after 3 seconds
    setTimeout(() => setShowUploadPrompt(false), 3000);
  };

  const suggestedQuestions = [
    { icon: Search, text: "What are the key termination conditions?" },
    { icon: FileText, text: "Summarize this document in plain language." },
    { icon: AlertTriangle, text: "Are there any unusual or risky clauses?" },
    { icon: Scale, text: "Compare this document with another version." }
  ];

  return (
    <div className="w-full max-w-[700px] flex flex-col items-center justify-center h-full px-6 py-12">
      
      {/* Upload Zone */}
      <div 
        className="w-full bg-white border border-dashed border-line rounded-16 p-12 flex flex-col items-center text-center cursor-pointer hover:border-signal/50 hover:bg-paper/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="w-14 h-14 rounded-full bg-paper border border-line flex items-center justify-center mb-6">
          <FileText className="w-6 h-6 text-slate" strokeWidth={1.5} />
        </div>
        
        <h2 className="font-serif text-[28px] font-semibold text-ink mb-3">
          Upload your document
        </h2>
        <p className="text-[15px] text-slate mb-8 max-w-[480px]">
          Bring in a contract, lease, agreement, or other document to get clear, plain-language explanations.
        </p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.docx,.jpg,.jpeg,.png"
        />

        <button className="bg-signal hover:bg-signal-hover text-white text-[14px] font-semibold px-6 py-3 rounded-8 transition-colors flex items-center gap-2 mb-4">
          Upload document
        </button>
        
        <p className="text-[13px] text-slate mb-8">
          or drag and drop a file here
        </p>

        <p className="text-[11px] font-medium text-slate/80 uppercase tracking-widest">
          PDF, DOCX, JPG, PNG up to 20MB
        </p>
      </div>

      {/* Upload Prompt Warning */}
      <div className={`mt-6 h-6 transition-opacity duration-300 ${showUploadPrompt ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-[14px] text-signal font-medium bg-signal/10 px-4 py-1 rounded-full">
          Please upload a document to ask questions about it.
        </p>
      </div>

      {/* Suggested Questions */}
      <div className="w-full mt-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-line" />
          <h3 className="font-serif text-[18px] font-semibold text-ink px-2">Or try a question</h3>
          <div className="flex-1 h-px bg-line" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedQuestions.map((q, i) => (
            <button 
              key={i}
              onClick={handleQuestionClick}
              className="flex items-center justify-between text-left bg-white border border-line rounded-12 p-4 hover:border-slate/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4 pr-4">
                <q.icon className="w-5 h-5 text-signal shrink-0" strokeWidth={1.5} />
                <span className="text-[14px] font-medium text-ink leading-snug">{q.text}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate shrink-0" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
