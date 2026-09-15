interface RiskLabelProps {
  type: "high" | "unusual";
}

export default function RiskLabel({ type }: RiskLabelProps) {
  const isHigh = type === "high";
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${
      isHigh ? "bg-error/10 text-error" : "bg-signal-light text-signal"
    }`}>
      {isHigh ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      )}
      <span className="text-[12px] font-semibold">{isHigh ? "High risk" : "Unusual clause"}</span>
    </div>
  );
}
