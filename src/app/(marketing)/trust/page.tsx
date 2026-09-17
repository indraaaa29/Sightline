import ScrollReveal from "@/components/layout/ScrollReveal";

export default function TrustPage() {
  return (
    <ScrollReveal className="flex-1 max-w-[800px] w-full mx-auto px-6 lg:px-16 py-16 md:py-24 flex flex-col text-left">
      <h1 className="font-serif text-h1-mobile md:text-h1-desktop text-ink mb-6">
        How Sightline handles your documents
      </h1>
      <p className="text-body-large-mobile md:text-body-large-desktop text-slate mb-16 max-w-[600px]">
        Trust is built through transparency. Here is exactly how Sightline treats your data.
      </p>

      <div className="flex flex-col gap-14">
        <section>
          <h3 className="font-serif text-h3-mobile md:text-h3-desktop text-ink mb-4">Private by design</h3>
          <p className="text-body-regular-mobile md:text-body-regular-desktop text-slate leading-relaxed">
            Your documents are processed securely and are not shared with third parties. Sightline does not sell your data or provide access to your documents to anyone outside of the automated analysis process.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-h3-mobile md:text-h3-desktop text-ink mb-4">Your data, your control</h3>
          <p className="text-body-regular-mobile md:text-body-regular-desktop text-slate leading-relaxed">
            You retain full control over your data. When you delete a document from your workspace, it is permanently removed. We do not retain copies for purposes other than providing the service to you.
          </p>
        </section>

        <section>
          <h3 className="font-serif text-h3-mobile md:text-h3-desktop text-ink mb-4">No model training</h3>
          <p className="text-body-regular-mobile md:text-body-regular-desktop text-slate leading-relaxed">
            Sightline does not use your uploaded documents or your conversation history to train AI models. Your data is processed to provide you with analysis, and then it is not used for any other purpose.
          </p>
        </section>

        <section className="bg-panel border border-line rounded-12 p-6 md:p-8">
          <h3 className="font-serif text-h3-mobile md:text-h3-desktop text-ink mb-4">Not legal advice</h3>
          <p className="text-body-regular-mobile md:text-body-regular-desktop text-slate leading-relaxed">
            Sightline is a software tool designed to provide information and help you understand legal documents. It is not a law firm, and the information provided does not constitute legal advice. Using Sightline does not create an attorney-client relationship. If you require legal advice, consult a licensed attorney in your jurisdiction.
          </p>
        </section>
      </div>
    </ScrollReveal>
  );
}
