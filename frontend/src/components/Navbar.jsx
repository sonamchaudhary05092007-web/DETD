export default function Navbar({ activeTab, setActiveTab }) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white border-b border-parchment">
      {/* Thin gold accent line at very top */}
      <div className="h-1 bg-gradient-to-r from-gold-500 via-brand-800 to-gold-500" />

      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-2 text-[11px] font-mono tracking-wide text-stone-500 border-b border-stone-200/60">
          <span className="uppercase">{today}</span>
          <span className="text-brand-800 font-semibold tracking-widest uppercase">
            Dayalbagh Educational Institute
          </span>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center py-6 sm:py-8">
        {/* Decorative element */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500" />
          <span className="text-gold-600 text-xs font-mono tracking-[0.3em] uppercase font-semibold">
            Est. 1981
          </span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500" />
        </div>

        <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-black text-brand-950 tracking-tight leading-none">
          The Dayalbagh Spectrum
        </h1>

        <p className="mt-2 text-stone-500 text-sm sm:text-base font-light italic tracking-wide">
          AI-Powered News Intelligence for the Curious Mind
        </p>

        {/* Bottom decorative divider */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-px w-20 bg-gold-400/50" />
          <span className="text-gold-500 text-lg">◆</span>
          <div className="h-px w-20 bg-gold-400/50" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex justify-center gap-1 pb-0 text-sm font-medium">
          {[
            { id: "news", label: "For you" },
            { id: "national", label: "National & World" },
            { id: "dei", label: "DEI Hub" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 transition-all relative cursor-pointer tracking-wide ${
                activeTab === tab.id
                  ? "text-brand-900 font-bold"
                  : "text-stone-500 hover:text-brand-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-gold-500 to-brand-800 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}