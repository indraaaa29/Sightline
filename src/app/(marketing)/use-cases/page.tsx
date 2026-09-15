import DocumentExcerptCard from "@/components/chat/DocumentExcerptCard";

export default function UseCasesPage() {
  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="max-w-[1140px] mx-auto px-6 lg:px-16 py-14 md:py-24 text-left w-full">
        <h1 className="font-serif text-h1-mobile md:text-h1-desktop text-ink mb-16 max-w-[800px]">
          Built for the moments legal paperwork actually happens
        </h1>
        
        <div className="flex flex-col gap-12 mb-24">
          
          {/* For Renters */}
          <div className="bg-panel rounded-12 p-8 md:p-12 flex flex-col items-start w-full">
            <h3 className="font-serif text-h2-mobile md:text-h2-desktop text-ink mb-6">For Renters</h3>
            <p className="text-body-large-mobile md:text-body-large-desktop text-slate mb-10 max-w-[800px]">
              Your landlord sends a lease renewal with new terms. Is the rent increase legal? Did they add a new fee? Sightline flags what changed and what to ask about before you sign away your deposit.
            </p>
            <div className="w-full max-w-[700px]">
              <DocumentExcerptCard
                clause="Tenant agrees to pay a monthly pet rent of $50 per pet, in addition to a non-refundable pet fee of $500, which shall not be applied to any damages caused by the pet."
                highlight="non-refundable pet fee of $500, which shall not be applied to any damages"
                plainLanguage="You have to pay $500 just to have the pet, and if your pet causes damage, you'll have to pay for the repairs out of pocket (or from your main security deposit)."
                animateOnScroll={true}
              />
            </div>
          </div>

          {/* For Freelancers */}
          <div className="bg-panel rounded-12 p-8 md:p-12 flex flex-col items-start w-full">
            <h3 className="font-serif text-h2-mobile md:text-h2-desktop text-ink mb-6">For Freelancers</h3>
            <p className="text-body-large-mobile md:text-body-large-desktop text-slate mb-10 max-w-[800px]">
              A client sends their standard independent contractor agreement. Sightline helps you spot overly broad non-competes, endless revision clauses, and sneaky payment terms that could leave you working for free.
            </p>
            <div className="w-full max-w-[700px]">
              <DocumentExcerptCard
                clause="Contractor agrees to provide unlimited revisions to the Deliverables until the Client is satisfied in its sole and absolute discretion, at no additional cost to the Client."
                highlight="unlimited revisions to the Deliverables until the Client is satisfied in its sole and absolute discretion"
                plainLanguage="The client can force you to keep revising the work forever without paying you extra, because they get to decide when it's 'done'."
                riskLevel="high"
                animateOnScroll={true}
              />
            </div>
          </div>

          {/* For Small Businesses */}
          <div className="bg-panel rounded-12 p-8 md:p-12 flex flex-col items-start w-full">
            <h3 className="font-serif text-h2-mobile md:text-h2-desktop text-ink mb-6">For Small Businesses</h3>
            <p className="text-body-large-mobile md:text-body-large-desktop text-slate mb-10 max-w-[800px]">
              A new vendor wants you to sign their Master Services Agreement. Sightline breaks down the liability limits, automatic renewal traps, and termination fees before you commit your budget.
            </p>
            <div className="w-full max-w-[700px]">
              <DocumentExcerptCard
                clause="This Agreement shall automatically renew for successive one (1) year periods unless either party provides written notice of its intent not to renew at least ninety (90) days prior to the expiration of the then-current term."
                highlight="automatically renew for successive one (1) year periods unless either party provides written notice... at least ninety (90) days prior"
                plainLanguage="You will be locked into another full year unless you remember to cancel exactly 3 months before the contract ends."
                riskLevel="unusual"
                animateOnScroll={true}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
