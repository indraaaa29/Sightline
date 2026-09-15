"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What types of documents can I upload?",
    answer: "Sightline works with contracts, leases, employment agreements, freelance MSAs, terms of service, and similar legal documents. You can upload PDF, Word (DOCX), JPG, and PNG files up to 20MB.",
  },
  {
    question: "How does Sightline analyze a document?",
    answer: "Sightline uses AI to read your document, identify important clauses, and translate legal language into plain English. Every explanation is grounded in the actual text of your document — Sightline points to the specific clause it's referencing.",
  },
  {
    question: "Can Sightline replace a lawyer?",
    answer: "No. Sightline provides information to help you understand documents, but it does not provide legal advice. It is a preparation tool — use it to understand what your document says, identify questions, and come prepared if you decide to consult an attorney.",
  },
  {
    question: "How are my documents handled?",
    answer: "Your documents are processed securely and are not shared with third parties. Sightline does not use your uploaded documents to train AI models. You retain full control over your data.",
  },
  {
    question: "Can I compare two documents?",
    answer: "Yes. You can upload a second version of a document and ask Sightline to compare the two. It will highlight what changed and explain why those differences matter.",
  },
  {
    question: "What happens if Sightline cannot find an answer?",
    answer: "Sightline will tell you when it cannot locate a relevant clause or when the document does not contain enough information to answer your question. It will not fabricate an answer. If additional context is needed, it will suggest what to look for or recommend consulting a professional.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full flex flex-col border-t border-line">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="border-b border-line flex flex-col">
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left py-5 flex items-center justify-between gap-4 rounded-sm"
              aria-expanded={isOpen}
            >
              <span className="text-[16px] font-medium text-ink">{faq.question}</span>
              <div className="shrink-0 text-slate">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-150 ${isOpen ? "rotate-45" : ""}`}
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-[500px] pb-5 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <p className="text-[15px] text-slate leading-relaxed pr-8">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
