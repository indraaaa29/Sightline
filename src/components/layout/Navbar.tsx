"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "How it works", href: "/how-it-works" },
    { name: "Services & Use Cases", href: "/use-cases" },
    { name: "Trust & privacy", href: "/trust" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-line">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif font-semibold text-[22px] text-ink tracking-tight">
          Sightline
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] text-slate hover:text-ink transition-colors duration-150"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <Link
            href="/workspace"
            className="group bg-signal hover:bg-signal-hover active:scale-[0.98] text-white text-[14px] font-semibold px-5 py-2.5 rounded-8 transition-all duration-300 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(166,124,58,0.4)]"
          >
            Open Legal Advisor
            <svg className="transition-transform duration-300 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-line bg-paper px-6 py-6 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[16px] text-slate hover:text-ink transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/workspace"
            className="group bg-signal hover:bg-signal-hover active:scale-[0.98] text-white text-[15px] font-semibold px-5 py-3 rounded-8 transition-all duration-300 inline-flex items-center justify-center gap-2 mt-2 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(166,124,58,0.4)]"
            onClick={() => setIsOpen(false)}
          >
            Open Legal Advisor
            <svg className="transition-transform duration-300 group-hover:translate-x-1" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </header>
  );
}
