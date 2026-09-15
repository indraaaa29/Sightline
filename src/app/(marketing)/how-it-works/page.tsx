import DocumentExcerptCard from "@/components/chat/DocumentExcerptCard";
import ScrollReveal from "@/components/layout/ScrollReveal";

export default function HowItWorksPage() {
  return (
    <div className="flex-1 max-w-[800px] w-full mx-auto px-6 lg:px-16 py-16 md:py-24 flex flex-col text-left">
      <h1 className="font-serif text-h1-mobile md:text-h1-desktop text-ink mb-6">
        How it works
      </h1>
      <p className="text-body-large-mobile md:text-body-large-desktop text-slate mb-16 max-w-[600px]">
        Three steps to understanding what your document actually says.
      </p>

      <div className="flex flex-col gap-20 relative">
        <div className="hidden md:block absolute left-[15.5px] top-[16px] bottom-0 w-[1px] bg-line z-0" />

        {/* Step 1 — Upload */}
        <ScrollReveal delay={100}>
          <div className="flex gap-6 md:gap-8 relative z-10">
            <div className="w-[32px] h-[32px] shrink-0 rounded-full border border-ink flex items-center justify-center text-[13px] font-semibold text-ink bg-paper mt-1">
              01
            </div>
            <div className="flex flex-col">
              <h3 className="text-[20px] font-semibold text-ink mb-3">Upload</h3>
              <p className="text-body-regular-mobile md:text-body-regular-desktop text-slate mb-4">
                Upload your contract, lease, agreement, or other legal document as a PDF, Word doc, or photo.
              </p>
              <p className="text-[15px] text-slate leading-relaxed">
                Sightline securely processes your document in seconds, extracting the text while maintaining the original structure. Just upload the file as you received it.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Step 2 — Understand */}
        <ScrollReveal delay={200}>
          <div className="flex gap-6 md:gap-8 relative z-10">
            <div className="w-[32px] h-[32px] shrink-0 rounded-full border border-ink flex items-center justify-center text-[13px] font-semibold text-ink bg-paper mt-1">
              02
            </div>
            <div className="flex flex-col w-full">
              <h3 className="text-[20px] font-semibold text-ink mb-3">Understand</h3>
              <p className="text-body-regular-mobile md:text-body-regular-desktop text-slate mb-4">
                Ask questions and identify clauses that deserve attention.
              </p>
              <p className="text-[15px] text-slate leading-relaxed mb-8">
                Instead of reading pages of dense legalese, ask direct questions like "What happens if I terminate early?" or "Is there an automatic renewal?". Sightline points directly to the relevant clauses and translates them into plain language.
              </p>

              <div className="w-full">
                <DocumentExcerptCard
                  clause="In the event of early termination by the Contractor, the Contractor shall be liable for all costs incurred by the Client in procuring a replacement contractor, including but not limited to recruitment fees, onboarding costs, and the difference in compensation."
                  highlight="liable for all costs incurred by the Client in procuring a replacement contractor"
                  plainLanguage="If you quit before the project is done, you might have to pay the client's costs to find and hire your replacement."
                  riskLevel="high"
                  animateOnScroll={true}
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Step 3 — Decide */}
        <ScrollReveal delay={300}>
          <div className="flex gap-6 md:gap-8 relative z-10">
            <div className="w-[32px] h-[32px] shrink-0 rounded-full border border-ink flex items-center justify-center text-[13px] font-semibold text-ink bg-paper mt-1">
              03
            </div>
            <div className="flex flex-col">
              <h3 className="text-[20px] font-semibold text-ink mb-3">Decide</h3>
              <p className="text-body-regular-mobile md:text-body-regular-desktop text-slate mb-4">
                Use the information to determine what you want to review further.
              </p>
              <p className="text-[15px] text-slate leading-relaxed">
                Compare different versions of a document, generate a checklist of key terms and open questions, or export a summary to bring to a legal professional. Sightline gives you the information — you make the decisions.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
