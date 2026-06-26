const LANG_OPTIONS = [
  { code: "en", flag: "🇬🇧", name: "English", native: "English" },
  { code: "yo", flag: "🇳🇬", name: "Yoruba", native: "Yorùbá" },
  { code: "ha", flag: "🇳🇬", name: "Hausa", native: "Harshen Hausa" },
  { code: "ig", flag: "🇳🇬", name: "Igbo", native: "Asụsụ Igbo" },
  { code: "pc", flag: "🇳🇬", name: "Pidgin", native: "Nigerian Pidgin" },
];

export default function LanguagePage({ language, setLanguage, onContinue }) {
  return (
    <div className="h-full min-h-full flex-1 bg-[#fdfaf5] flex flex-col justify-between overflow-hidden">
      {/* HEADER */}
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white shadow-sm">
        <h2 className="text-[26px] font-extrabold tracking-tight mb-1.5 leading-tight">
          Choose Your Language
        </h2>
        <p className="text-[14px] text-white/90 leading-snug pr-4">
          Select how you'd like to communicate with MamaCare
        </p>
      </div>

      {/* DYNAMIC LIST SPACE */}

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3.5 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {LANG_OPTIONS.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <div
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className={`p-4 rounded-2xl border-[1.5px] flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] ${
                isSelected
                  ? "border-[#1B5E4B] bg-[#E8F5F0] shadow-sm"
                  : "border-gray-200/80 bg-white hover:border-[#1B5E4B]/40"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-[22px] w-8 text-center shrink-0 flex items-center justify-center">
                  {opt.flag}
                </span>
                <div className="flex flex-col">
                  <span className="font-extrabold text-[15px] text-gray-900 leading-tight">
                    {opt.name}
                  </span>
                  <span className="text-[13px] text-gray-400 mt-0.5 font-medium">
                    {opt.native}
                  </span>
                </div>
              </div>

              {/* Radio Option */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#1B5E4B] border-2 border-[#1B5E4B] text-white scale-105"
                    : "border-2 border-gray-300 bg-transparent"
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={4}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION BUTTON */}
      <div className="shrink-0 px-6 pb-10 pt-2 bg-[#fdfaf5]">
        <button
          onClick={onContinue}
          disabled={!language}
          className={`w-full font-extrabold py-4 rounded-2xl text-[15px] transition-all transform active:scale-95 ${
            language
              ? "bg-[#1B5E4B] text-white shadow-[0_4px_12px_rgba(27,94,75,0.15)] cursor-pointer"
              : "bg-[#94B3A7] text-white/80 cursor-not-allowed"
          }`}
        >
          Continue ➔
        </button>
      </div>
    </div>
  );
}
