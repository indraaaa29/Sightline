export default function HeroDocumentVisual() {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center overflow-hidden">
      
      {/* Abstract Background Arch */}
      <div className="absolute right-0 top-0 bottom-0 w-3/4 bg-[#F0EEE8] rounded-tl-full opacity-60 pointer-events-none" />

      {/* Decorative Text Elements (Annotations) */}
      <div className="absolute top-12 right-12 hidden md:block text-right">
        <p className="font-serif italic text-slate text-[18px]">Understand<br/>what matters.</p>
        <svg className="w-8 h-8 text-slate mt-2 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>

      <div className="absolute bottom-16 right-24 hidden md:flex items-center gap-3">
        <svg className="w-6 h-6 text-slate" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
        <p className="font-serif italic text-slate text-[16px]">Make informed<br/>decisions.</p>
      </div>

      {/* Composition Container */}
      <div className="relative w-full max-w-[500px] h-full flex items-center justify-center mt-8 lg:mt-0 group cursor-default">
        
        {/* Background Document Layer */}
        <div className="absolute w-[85%] h-[75%] bg-white border border-line rounded-4 shadow-sm -rotate-3 right-0 translate-x-4 translate-y-4 opacity-80 transition-all duration-700 ease-out group-hover:rotate-0 group-hover:translate-x-8 group-hover:-translate-y-2 group-hover:opacity-100" />
        <div className="absolute w-[80%] h-[80%] bg-paper border border-line rounded-4 shadow-sm -rotate-1 left-0 -translate-x-4 -translate-y-2 opacity-90 transition-all duration-700 ease-out group-hover:-rotate-6 group-hover:-translate-x-8 group-hover:translate-y-4 group-hover:opacity-100">
           {/* Subtle fake text lines */}
           <div className="w-full h-full p-8 flex flex-col gap-4 opacity-20">
             <div className="w-3/4 h-2 bg-slate rounded-full" />
             <div className="w-full h-2 bg-slate rounded-full" />
             <div className="w-5/6 h-2 bg-slate rounded-full" />
             <div className="w-full h-2 bg-slate rounded-full" />
           </div>
        </div>

        {/* Foreground Primary Document */}
        <div className="relative w-[75%] h-[85%] bg-white border border-line rounded-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-10 flex flex-col items-center justify-center p-8 lg:p-12 text-center transition-all duration-700 ease-out group-hover:-translate-y-4 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
          
          <h2 className="font-serif text-[32px] md:text-[40px] leading-[1.1] text-ink mb-6">
            Clarity<br />
            builds<br />
            confidence.
          </h2>

          <div className="w-12 h-1 bg-signal mb-8 rounded-full opacity-80" />

          <p className="text-[16px] text-slate max-w-[200px]">
            Better questions.<br />
            Clearer decisions.
          </p>

        </div>

      </div>

    </div>
  );
}
