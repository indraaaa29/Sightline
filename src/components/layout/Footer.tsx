import Link from "next/link";

export default function Footer() {
  const links = [
    { name: "How it works", href: "/how-it-works" },
    { name: "Use cases", href: "/use-cases" },
    { name: "Trust & privacy", href: "/trust" },
    { name: "FAQ", href: "/faq" },
    { name: "Open chat", href: "/workspace" },
  ];

  return (
    <footer className="bg-ink text-paper">
      <div className="max-w-[1140px] mx-auto px-6 lg:px-16 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-12 mb-12">
          <div className="max-w-sm">
            <Link href="/" className="font-serif font-semibold text-[20px] text-paper block mb-4">
              Sightline
            </Link>
            <p className="text-[15px] text-slate leading-relaxed">
              Sightline provides information, not legal advice.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-slate hover:text-paper transition-colors duration-150"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="pt-8 border-t border-slate/30">
          <p className="text-[13px] text-slate">
            &copy; {new Date().getFullYear()} Sightline. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
