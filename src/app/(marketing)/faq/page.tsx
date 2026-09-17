import FAQAccordion from "@/components/marketing/FAQAccordion";

export default function FAQPage() {
  return (
    <div className="flex-1 max-w-[800px] w-full mx-auto px-6 lg:px-16 py-16 md:py-24 flex flex-col text-left">
      <h1 className="font-serif text-h1-mobile md:text-h1-desktop text-ink mb-12">
        Questions
      </h1>

      <FAQAccordion />

      <div className="mt-16 pt-12 flex flex-col items-start gap-4">
        <h2 className="font-serif text-h3-mobile md:text-h3-desktop text-ink">Still have questions?</h2>
        <p className="text-body-regular-mobile md:text-body-regular-desktop text-slate">
          Send us an email and we'll get back to you.
        </p>
        <a
          href="mailto:support@sightline.example.com"
          className="text-ink text-[16px] font-medium hover:underline decoration-1 underline-offset-4 mt-1"
        >
          support@sightline.example.com
        </a>
      </div>
    </div>
  );
}
