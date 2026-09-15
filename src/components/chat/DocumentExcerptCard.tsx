"use client";

import RiskLabel from "./RiskLabel";
import { FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DocumentExcerptCardProps {
  clause: string;
  highlight: string;
  plainLanguage: string;
  riskLevel?: "high" | "unusual";
  animateOnScroll?: boolean;
}

export default function DocumentExcerptCard({
  clause,
  highlight,
  plainLanguage,
  riskLevel,
  animateOnScroll = false,
}: DocumentExcerptCardProps) {
  // Simple logic to highlight the string in the clause
  const parts = clause.split(new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  const partLengths = parts.map(p => p.length);
  const totalClauseLength = partLengths.reduce((a, b) => a + b, 0);

  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  const [clauseCharIndex, setClauseCharIndex] = useState(animateOnScroll ? 0 : totalClauseLength);
  const [plainCharIndex, setPlainCharIndex] = useState(animateOnScroll ? 0 : plainLanguage.length);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animateOnScroll) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { root: null, rootMargin: "0px 0px -50px 0px", threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, [animateOnScroll]);

  useEffect(() => {
    if (!isVisible || !animateOnScroll) {
      if (animateOnScroll) {
        setClauseCharIndex(0);
        setPlainCharIndex(0);
      }
      return;
    }

    let cIndex = 0;
    const clauseInterval = setInterval(() => {
      cIndex += 3;
      setClauseCharIndex(Math.min(cIndex, totalClauseLength));
      if (cIndex >= totalClauseLength) clearInterval(clauseInterval);
    }, 10);

    const plainDelay = (totalClauseLength / 3) * 10 + 200;
    const plainTimeout = setTimeout(() => {
      let pIndex = 0;
      const plainInterval = setInterval(() => {
        pIndex += 3;
        setPlainCharIndex(Math.min(pIndex, plainLanguage.length));
        if (pIndex >= plainLanguage.length) clearInterval(plainInterval);
      }, 10);
      return () => clearInterval(plainInterval);
    }, plainDelay);

    return () => {
      clearInterval(clauseInterval);
      clearTimeout(plainTimeout);
    };
  }, [isVisible, animateOnScroll, totalClauseLength, plainLanguage.length]);

  return (
    <div ref={ref} className="mt-4 flex flex-col items-start gap-1 w-full">
      <div className="bg-white border border-line rounded-8 overflow-hidden shadow-sm w-full max-w-[600px]">
        {/* Header */}
        <div className="bg-panel px-4 py-2 border-b border-line">
          <p className="text-[11px] font-semibold text-slate uppercase tracking-wider">Document excerpt</p>
        </div>
        
        {/* Source Text */}
        <div className="p-4 md:p-5">
          <p className="text-[14px] text-ink leading-relaxed font-serif">
            {parts.map((part, i) => {
              const startIdx = partLengths.slice(0, i).reduce((a, b) => a + b, 0);
              const isHighlight = part.toLowerCase() === highlight.toLowerCase();
              
              let typedLength = 0;
              if (clauseCharIndex > startIdx) {
                typedLength = Math.min(clauseCharIndex - startIdx, part.length);
              }

              const typedStr = part.substring(0, typedLength);
              const untypedStr = part.substring(typedLength);

              return (
                <span key={i} className={isHighlight ? "bg-signal-light pb-0.5" : ""}>
                  <span>{typedStr}</span>
                  <span className="opacity-0">{untypedStr}</span>
                </span>
              );
            })}
          </p>
          
          {riskLevel && (
            <div className="mt-4">
              <RiskLabel type={riskLevel} />
            </div>
          )}
        </div>
        
        {/* Plain Language */}
        <div className="p-4 md:px-5 md:py-4 border-t border-line bg-paper/50">
          <p className="text-[12px] font-semibold text-ink mb-1.5">Plain language</p>
          <p className="text-[14px] text-slate leading-relaxed">
            <span>{plainLanguage.substring(0, plainCharIndex)}</span>
            <span className="opacity-0">{plainLanguage.substring(plainCharIndex)}</span>
          </p>
          
          {/* Action button */}
          <div className="mt-4 flex">
            <button className="text-[12px] border border-line rounded-6 px-3 py-1.5 text-slate bg-white flex items-center gap-1.5 hover:bg-panel transition-colors">
              <FileText className="w-3.5 h-3.5" /> View in document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
