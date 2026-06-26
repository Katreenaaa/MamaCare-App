import { Volume2, ArrowLeft, ChevronRight, UserPlus } from "lucide-react";

export default function LoginPage({
  onLogin,
  t,
  language,
  onBack,
  onGoToRegister,
}) {
  const voiceLangMap = {
    en: "en-NG",
    yo: "yo-NG",
    ha: "ha-NG",
    ig: "ig-NG",
    pc: "en-NG",
  };

  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    const textToRead =
      t?.loginAudio ||
      "Welcome back. Log in as Amina, or create a new account.";
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = voiceLangMap[language] || "en-NG";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-full min-h-full flex-1 bg-[#fdfaf5] flex flex-col relative overflow-hidden">
      {/* HEADER */}
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white flex items-center justify-between z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-[24px] font-extrabold tracking-tight">
            {t?.welcomeBack || "Welcome"}
          </h2>
        </div>
        <button
          onClick={handleSpeak}
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-full cursor-pointer transition-colors flex items-center gap-2 backdrop-blur-sm"
        >
          <Volume2 size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-10 flex flex-col gap-4">
        <p className="text-gray-500 text-sm font-medium mb-2">
          {t?.loginPrompt ||
            "Continue with your existing profile or create a new one."}
        </p>

        {/* Demo Login Button */}
        <button
          onClick={() =>
            onLogin({
              name: "Amina Balogun",
              week: "22",
              state: "Lagos",
              phc: "PHC Surulere",
            })
          }
          className="bg-white p-5 rounded-[20px] shadow-sm border-[1.5px] border-gray-100 flex items-center justify-between cursor-pointer hover:border-[#1B5E4B]/40 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#1B5E4B] text-white rounded-full flex items-center justify-center font-extrabold text-[20px]">
              A
            </div>
            <div className="text-left">
              <div className="font-extrabold text-[16px] text-gray-900">
                Amina Balogun
              </div>
              <div className="text-[13px] text-gray-500 mt-0.5">
                Week 22 · Lagos
              </div>
            </div>
          </div>
          <ChevronRight className="text-gray-400" size={24} />
        </button>

        <div className="flex items-center gap-4 my-2 opacity-60">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-xs font-bold text-gray-400 uppercase">
            {t?.or || "OR"}
          </span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Register Route Button */}
        <button
          onClick={onGoToRegister}
          className="bg-white p-5 rounded-[20px] shadow-sm border-[1.5px] border-gray-100 flex items-center justify-between cursor-pointer hover:border-[#1B5E4B]/40 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E8F5F0] text-[#1B5E4B] rounded-full flex items-center justify-center">
              <UserPlus size={24} strokeWidth={2.5} />
            </div>
            <div className="font-extrabold text-[16px] text-gray-900">
              {t?.createNewAccount || "Create New Account"}
            </div>
          </div>
          <ChevronRight className="text-gray-400" size={24} />
        </button>
      </div>
    </div>
  );
}
