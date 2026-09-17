import Link from "next/link";
import FAQAccordion from "@/components/marketing/FAQAccordion";
import HeroDocumentVisual from "@/components/marketing/HeroDocumentVisual";
import CapabilityRow from "@/components/marketing/CapabilityRow";
import DocumentExcerptCard from "@/components/chat/DocumentExcerptCard";
import ScrollReveal from "@/components/layout/ScrollReveal";
import { FileText, Search, ArrowRight, Shield, Eye, User, AlertTriangle, Upload, MessageSquare, CheckSquare, Layers, PenTool, Briefcase, FileSearch } from "lucide-react";

export default function MarketingHome() {
  return (
    <div className="flex flex-col w-full">

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="max-w-[1280px] w-full mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-16 pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="flex-1 flex flex-col items-start text-left lg:max-w-[480px] lg:pt-8">
            <p className="text-eyebrow text-signal uppercase tracking-widest mb-6">
              Legal documents, made clearer.
            </p>
            <h1 className="font-serif text-h1-mobile md:text-h1-desktop lg:text-display text-ink mb-6">
              See clearly<br className="hidden md:block" /> before you sign.
            </h1>
            <p className="text-body-large-mobile md:text-body-large-desktop text-slate mb-10 max-w-[440px]">
              Understand contracts, leases, agreements, and other important documents with clear explanations, document-grounded answers, and practical guidance on what deserves a closer look.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
              <Link
                href="/workspace"
                className="group bg-signal hover:bg-signal-hover active:scale-[0.98] text-white text-button px-6 py-3.5 rounded-8 transition-all duration-300 inline-flex items-center gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(166,124,58,0.4)]"
              >
                Open Legal Advisor
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
              </Link>
              <Link
                href="/how-it-works"
                className="text-ink text-[15px] font-medium hover:text-signal transition-colors"
              >
                Explore how Sightline works
              </Link>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-slate">
              <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Sightline provides information, not legal advice.</span>
            </div>
          </div>

          <div className="flex-1 w-full lg:max-w-[680px]">
            <HeroDocumentVisual />
          </div>
        </div>
      </section>

      <CapabilityRow />

      {/* ============================================================
          WHAT IS SIGHTLINE (Trust Strip / Intro)
          ============================================================ */}
      <section className="border-b border-line bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 md:py-16">
          <ScrollReveal>
            <div className="max-w-[700px] mb-12">
              <h2 className="font-serif text-[28px] md:text-[32px] text-ink mb-4">A clearer way to understand legal documents.</h2>
              <p className="text-[16px] md:text-[18px] text-slate leading-relaxed">
                Sightline helps people understand important legal documents by turning complicated language into clear explanations and giving users tools to investigate what matters. It's a professional assistant that puts the document first.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 border-t border-line pt-12">
            {[
              { icon: FileText, label: "Grounded in your document", desc: "Responses are based on the actual text in your file." },
              { icon: Eye, label: "Clear explanations", desc: "Complex legal language translated into plain English." },
              { icon: User, label: "You stay in control", desc: "You decide what to review further or ask a professional." },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 100}>
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-8 border border-line flex items-center justify-center shrink-0 bg-paper">
                    <item.icon className="w-4 h-4 text-ink" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-ink mb-0.5">{item.label}</p>
                    <p className="text-[13px] text-slate leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT SIGHTLINE SERVES (Recovered from original use-cases)
          ============================================================ */}
      <section className="border-b border-line bg-paper py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <ScrollReveal>
            <h2 className="font-serif text-h2-mobile md:text-h2-desktop text-ink mb-4 transition-colors duration-300 hover:text-signal cursor-default">Explore what Sightline can help you with</h2>
            <p className="text-[16px] md:text-[18px] text-slate mb-12 max-w-[600px]">
              Designed for the moments legal paperwork actually happens, whether you're renting an apartment, taking on freelance work, or running a business.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Briefcase,
                title: "Contracts", 
                desc: "Understand key terms, obligations, termination conditions, and spot unusual clauses before you sign." 
              },
              { 
                icon: Layers,
                title: "Leases", 
                desc: "Understand rent, renewal conditions, hidden fees, termination policies, and tenant obligations." 
              },
              { 
                icon: PenTool,
                title: "Freelance & Employment", 
                desc: "Spot overly broad non-competes, endless revision clauses, and tricky payment terms." 
              },
              { 
                icon: FileSearch,
                title: "Clause Exploration", 
                desc: "Find and understand specific provisions instantly rather than reading pages of dense legalese." 
              },
              { 
                icon: ArrowRight,
                title: "Document Comparison", 
                desc: "See exactly what changed between two versions of an agreement and why it matters." 
              },
              { 
                icon: CheckSquare,
                title: "Review Preparation", 
                desc: "Create a structured list of points, concerns, and open questions to discuss with a professional." 
              }
            ].map((service, i) => (
              <ScrollReveal key={service.title} delay={i * 100}>
                <div className="group bg-white border border-line rounded-12 p-6 hover:shadow-elevated hover:border-signal/30 hover:-translate-y-1 transition-all duration-300 cursor-default h-full">
                  <service.icon className="w-5 h-5 text-signal mb-4 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  <h3 className="text-[16px] font-semibold text-ink mb-2 group-hover:text-signal transition-colors duration-300">{service.title}</h3>
                  <p className="text-[14px] text-slate leading-relaxed">{service.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW SIGHTLINE HELPS (Workflow)
          ============================================================ */}
      <section className="border-b border-line bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 md:py-24">
          <ScrollReveal>
            <div className="mb-14">
              <h2 className="font-serif text-h2-mobile md:text-h2-desktop text-ink mb-3">From document to understanding.</h2>
              <p className="text-[16px] text-slate">Three simple steps to clarity.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload",
                desc: "Bring in your contract, lease, agreement, or other document as a PDF, DOCX, or image.",
              },
              {
                step: "02",
                icon: MessageSquare,
                title: "Ask & Understand",
                desc: "Ask questions and see clear explanations grounded in the actual text of your document.",
              },
              {
                step: "03",
                icon: CheckSquare,
                title: "Decide",
                desc: "Use the information to determine what deserves further review or a professional consultation.",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 150}>
                <div className="relative flex flex-col items-start md:px-8 md:first:pl-0 md:last:pr-0">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-[13px] font-bold text-signal">{item.step}</span>
                    <div className="w-9 h-9 rounded-full border border-line flex items-center justify-center bg-paper">
                      <item.icon className="w-4 h-4 text-ink" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-[20px] font-semibold text-ink mb-2">{item.title}</h3>
                  <p className="text-[15px] text-slate leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          DOCUMENT-FIRST DESIGN + PRODUCT VISUAL (Editorial integration)
          ============================================================ */}
      <section className="border-b border-line">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left — Philosophy */}
            <div className="py-16 md:py-24 lg:pr-16 lg:border-r lg:border-line">
              <h2 className="font-serif text-h2-mobile md:text-[40px] leading-[1.1] text-ink mb-6 max-w-[480px]">
                The document stays at the center.
              </h2>
              <p className="text-body-large-mobile md:text-body-large-desktop text-slate mb-10 max-w-[440px]">
                Sightline is designed to help you understand the source material rather than simply producing generic answers. 
              </p>
              
              <ScrollReveal>
                <div className="flex flex-col gap-3 text-[14px]">
                  <div className="flex items-center gap-3 text-ink font-medium"><div className="w-6 h-6 rounded-full bg-line flex items-center justify-center text-[10px]">1</div> User question</div>
                  <div className="w-[1px] h-4 bg-line ml-[11px]" />
                  <div className="flex items-center gap-3 text-ink font-medium"><div className="w-6 h-6 rounded-full bg-deep text-white flex items-center justify-center text-[10px]">S</div> Sightline response</div>
                  <div className="w-[1px] h-4 bg-line ml-[11px]" />
                  <div className="flex items-center gap-3 text-ink font-medium"><FileText className="w-4 h-4 ml-1 text-slate" /> Source document excerpt</div>
                  <div className="w-[1px] h-4 bg-line ml-[11px]" />
                  <div className="flex items-center gap-3 text-ink font-medium"><div className="w-6 h-6 rounded-full bg-signal-light text-signal flex items-center justify-center text-[10px]">!</div> Highlighted clause</div>
                  <div className="w-[1px] h-4 bg-line ml-[11px]" />
                  <div className="flex items-center gap-3 text-ink font-medium"><Eye className="w-4 h-4 ml-1 text-slate" /> Plain-language explanation</div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right — Product Demonstration */}
            <div className="py-16 md:py-24 lg:pl-16 flex flex-col justify-center bg-paper">
              <ScrollReveal delay={150} className="w-full max-w-[500px] mx-auto">
                <p className="text-[13px] font-semibold text-slate uppercase tracking-wider mb-6">Meet the Legal Advisor</p>
                <div className="bg-panel rounded-8 px-4 py-2.5 max-w-[85%] ml-auto mb-6">
                  <p className="text-[14px] text-ink">What happens if I terminate this agreement early?</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-white border border-line flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-bold text-ink">S</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-[14px] text-ink leading-relaxed">
                      Section 7 allows either party to terminate with 30 days' written notice, provided that all outstanding obligations have been satisfied.
                    </p>
                    <DocumentExcerptCard 
                      clause="Either party may terminate this Agreement upon thirty (30) days' prior written notice to the other party, provided that all outstanding obligations have been satisfied in full."
                      highlight="provided that all outstanding obligations have been satisfied in full"
                      plainLanguage="You can end the agreement with 30 days' notice, but only after completing your outstanding obligations."
                      riskLevel="unusual"
                      animateOnScroll
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          DOCUMENT INTELLIGENCE + REAL-WORLD USE CASES
          ============================================================ */}
      <section className="border-b border-line bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Left - Intelligence */}
            <ScrollReveal>
              <div>
                <h2 className="font-serif text-[28px] md:text-[32px] text-ink mb-8">More than just questions.</h2>
                <div className="space-y-6">
                  {[
                    { label: "UNDERSTAND", desc: "Find important clauses buried in pages of text." },
                    { label: "EXPLAIN", desc: "Translate complicated legal language into plain language." },
                    { label: "COMPARE", desc: "See differences between document versions instantly." },
                    { label: "CHECK", desc: "Create a review checklist of things to verify." },
                    { label: "PREPARE", desc: "Create a structured brief for further legal review." },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col">
                      <p className="text-[12px] font-bold text-signal uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-[15px] text-slate">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Right - Real world human problems */}
            <ScrollReveal delay={150}>
              <div>
                 <h2 className="font-serif text-[28px] md:text-[32px] text-ink mb-8">Real questions from real people.</h2>
                 <div className="space-y-4">
                   {[
                     "\"I received a lease and don't understand the termination clause.\"",
                     "\"I need to understand an employment agreement.\"",
                     "\"I have two versions of a contract and want to know what changed.\"",
                     "\"I found a clause I don't understand.\"",
                     "\"I want to prepare questions before speaking to a lawyer.\""
                   ].map((quote, i) => (
                     <div key={i} className="bg-paper border border-line rounded-8 px-5 py-4">
                       <p className="text-[15px] text-ink font-medium italic">{quote}</p>
                     </div>
                   ))}
                 </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* ============================================================
          TRUST, PRIVACY, & LIMITATIONS
          ============================================================ */}
      <section className="border-b border-line bg-deep text-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ScrollReveal>
              <div>
                <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.1] mb-12 max-w-[480px]">
                  Important documents deserve careful handling.
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { icon: Shield, label: "Private by design", desc: "Your documents are processed securely and not shared." },
                    { icon: Eye, label: "Transparent", desc: "You can see where information comes from in your document." },
                    { icon: User, label: "User control", desc: "You manage your documents and can delete them at any time." },
                  ].map((item) => (
                    <div key={item.label}>
                      <item.icon className="w-5 h-5 text-white/50 mb-3" strokeWidth={1.5} />
                      <p className="text-[15px] font-semibold mb-1">{item.label}</p>
                      <p className="text-[14px] text-white/70 leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={150} className="h-full">
              <div className="bg-white/5 border border-white/10 rounded-12 p-8 md:p-10 flex flex-col justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg h-full">
                <AlertTriangle className="w-6 h-6 text-signal mb-4 animate-pulse" strokeWidth={1.5} />
                <h3 className="text-[20px] font-semibold mb-3">Clear Limitations</h3>
                <p className="text-[15px] text-white/80 leading-relaxed mb-4">
                  <strong className="text-white">Sightline provides information, not legal advice.</strong>
                </p>
                <p className="text-[14px] text-white/70 leading-relaxed">
                  AI can make mistakes. Users should verify important matters. Sightline does not replace qualified legal advice, and for important legal decisions, you should consult a licensed professional.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ & CTA
          ============================================================ */}
      <section className="bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left — FAQ */}
            <div className="py-16 md:py-24 lg:pr-16 lg:border-r lg:border-line">
              <h2 className="font-serif text-h3-mobile md:text-h3-desktop text-ink mb-8">Frequently asked questions</h2>
              <FAQAccordion />
            </div>

            {/* Right — CTA */}
            <div className="py-16 md:py-24 lg:pl-16 flex flex-col justify-center">
              <div className="bg-paper border border-line rounded-16 p-8 md:p-12">
                <h3 className="font-serif text-[28px] md:text-[32px] leading-[1.1] text-ink font-semibold mb-4">
                  Have a document you want to understand?
                </h3>
                <p className="text-[16px] text-slate mb-8">
                  Open the Legal Advisor and start asking questions about what matters.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/workspace"
                    className="group bg-signal hover:bg-signal-hover active:scale-[0.98] text-white text-button px-6 py-3.5 rounded-8 transition-all duration-300 inline-flex items-center justify-center gap-2.5 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(166,124,58,0.4)]"
                  >
                    Open Legal Advisor
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2} />
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="flex items-center justify-center px-6 py-3.5 rounded-8 border border-line text-ink text-[14px] font-semibold hover:bg-white transition-colors"
                  >
                    Explore how it works
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
