const LANG_OPTIONS = [
  { code: "en", flag: "GB", name: "English", native: "English" },
  { code: "yo", flag: "NG", name: "Yoruba", native: "Yorùbá" },
  { code: "ha", flag: "NG", name: "Hausa", native: "Harshen Hausa" },
  { code: "ig", flag: "NG", name: "Igbo", native: "Asụsụ Igbo" },
  { code: "pc", flag: "NG", name: "Pidgin", native: "Nigerian Pidgin" },
];

export default function LanguagePage({ language, setLanguage, onContinue }) {
  return (
    <div className="h-full bg-[#FDFAF5] flex flex-col">
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white">
        <h2 className="text-[26px] font-extrabold tracking-tight mb-1.5 leading-tight">
          Choose Your Language
        </h2>
        <p className="text-[14px] text-white/90 leading-snug pr-4">
          Select how you'd like to communicate with MamaCare
        </p>
      </div>

      {/* Language List  */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4 space-y-4">
        {LANG_OPTIONS.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <div
              key={opt.code}
              onClick={() => setLanguage(opt.code)}
              className={`p-4 rounded-2xl border-[1.5px] flex items-center justify-between cursor-pointer transition-all ${
                isSelected
                  ? "border-[#1B5E4B] bg-[#E8F5F0]"
                  : "border-[#E5E7EB] bg-white hover:border-[#1B5E4B]/40"
              }`}
            >
              <div className="flex items-center gap-5">
                <span className="text-[16px] font-bold text-gray-900 w-6 text-center">
                  {opt.flag}
                </span>
                <div className="flex flex-col">
                  <span className="font-bold text-[15px] text-gray-900 leading-tight">
                    {opt.name}
                  </span>
                  <span className="text-[13px] text-gray-400 mt-0.5">
                    {opt.native}
                  </span>
                </div>
              </div>

              {/* Radio Button */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isSelected
                    ? "bg-[#1B5E4B] border-2 border-[#1B5E4B] text-white"
                    : "border-2 border-gray-200 bg-transparent"
                }`}
              >
                {isSelected && (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3.5}
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

      {/* Action Button */}
      <div className="shrink-0 px-6 pb-10 pt-4 bg-[#FDFAF5]">
        <button
          onClick={onContinue}
          disabled={!language}
          className={`w-full font-bold py-4 rounded-2xl text-[16px] transition-all ${
            language
              ? "bg-[#1B5E4B] text-white shadow-sm"
              : "bg-[#94B3A7] text-white cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
