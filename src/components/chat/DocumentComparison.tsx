interface ComparisonClause {
  name: string;
  clause: string;
  highlight?: string;
}

interface DocumentComparisonProps {
  docA: ComparisonClause;
  docB: ComparisonClause;
  explanation: string;
}

export default function DocumentComparison({ docA, docB, explanation }: DocumentComparisonProps) {
  const renderClause = (item: ComparisonClause) => {
    if (!item.highlight) return <span className="text-[15px] text-ink">{item.clause}</span>;
    
    const parts = item.clause.split(new RegExp(`(${item.highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <span className="text-[15px] text-ink">
        {parts.map((part, i) => 
          part.toLowerCase() === item.highlight!.toLowerCase() ? (
            <span key={i} className="border-b-[2px] border-signal pb-0.5">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-4 w-full max-w-[720px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document A */}
        <div className="bg-panel rounded-12 p-4">
          <p className="text-[13px] font-medium text-slate mb-2">{docA.name}</p>
          <div className="bg-white p-3 border border-line rounded-8 shadow-sm">
            {renderClause(docA)}
          </div>
        </div>

        {/* Document B */}
        <div className="bg-panel rounded-12 p-4">
          <p className="text-[13px] font-medium text-slate mb-2">{docB.name}</p>
          <div className="bg-white p-3 border border-line rounded-8 shadow-sm">
            {renderClause(docB)}
          </div>
        </div>
      </div>
      
      <div className="text-[15px] text-ink leading-relaxed px-1">
        {explanation}
      </div>
    </div>
  );
}
