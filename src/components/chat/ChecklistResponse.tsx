interface ChecklistResponseProps {
  items: string[];
}

export default function ChecklistResponse({ items }: ChecklistResponseProps) {
  return (
    <div className="mt-4 w-full max-w-[600px]">
      <div className="flex flex-col gap-3 mb-5">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-[4px] border border-line shrink-0 mt-0.5 flex items-center justify-center bg-white" />
            <p className="text-[15px] text-ink leading-relaxed flex-1">{item}</p>
          </div>
        ))}
      </div>
      <button 
        className="px-6 py-3 border border-ink text-ink rounded-8 text-[15px] font-semibold hover:bg-panel transition-colors"
        onClick={() => alert("Downloading PDF... (Mock)")}
      >
        Download as PDF
      </button>
    </div>
  );
}
