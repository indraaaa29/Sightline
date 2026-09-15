export default function ThinkingIndicator() {
  return (
    <div className="flex w-full mb-6 max-w-[720px] mx-auto opacity-0 animate-[fadeIn_150ms_ease-out_forwards]">
      <div className="flex items-center gap-1.5 px-4 py-2 text-slate text-[15px]">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-slate animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-slate animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-slate animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
        <span className="hidden motion-reduce:inline-block ml-1">Thinking…</span>
      </div>
    </div>
  );
}
