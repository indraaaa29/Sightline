import Link from "next/link";
import { Menu } from "lucide-react";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile-only header (desktop branding is in the sidebar) */}
      <header className="md:hidden sticky top-0 z-50 bg-deep h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="text-white">
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/" className="flex flex-col items-start leading-none">
            <span className="font-serif font-semibold text-[18px] text-white mb-1">Sightline</span>
            <span className="font-sans font-medium text-[10px] text-white/60 uppercase tracking-widest">Legal Advisor</span>
          </Link>
        </div>
      </header>
      {children}
    </>
  );
}
