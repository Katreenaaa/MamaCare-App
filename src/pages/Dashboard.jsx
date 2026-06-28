import { useState, useEffect } from "react";
import { X, Play, Pause, Square } from "lucide-react";

export default function Dashboard({ user, t, navTo }) {
  const [selectedTip, setSelectedTip] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [isTipPaused, setIsTipPaused] = useState(false);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const playTipAudio = (title, desc, source) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `Tip from ${source}. ${title}. ${desc}`,
    );
    utterance.lang = "en-NG";

    utterance.onend = () => {
      setIsReading(false);
      setIsTipPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsReading(true);
    setIsTipPaused(false);
  };

  const pauseTipAudio = () => {
    window.speechSynthesis.pause();
    setIsTipPaused(true);
  };

  const resumeTipAudio = () => {
    window.speechSynthesis.resume();
    setIsTipPaused(false);
  };

  const stopTipAudio = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsTipPaused(false);
  };

  const closeTipModal = () => {
    stopTipAudio();
    setSelectedTip(null);
  };

  const dashboardTips =
    t?.richTips?.length > 0
      ? t.richTips
      : [
          {
            source: "WHO",
            title: "Stay Hydrated",
            desc: "Drink at least 8 glasses of water today. Hydration is critical for amniotic fluid levels.",
            emoji: "💧",
          },
          {
            source: "UNICEF",
            title: "Prenatal Vitamins",
            desc: "Take your prenatal vitamins after a meal. Folic acid helps prevent major birth defects.",
            emoji: "💊",
          },
          {
            source: "FMOH",
            title: "Elevate Your Feet",
            desc: "Rest with your feet elevated to reduce swelling and improve blood circulation.",
            emoji: "🦵",
          },
          {
            source: "WHO",
            title: "Nutritious Diet",
            desc: "Eat dark leafy greens like Ugu or Spinach to keep your iron levels healthy.",
            emoji: "🥬",
          },
        ];

  return (
    <div className="flex flex-col min-h-full bg-[#fdfaf5] pb-28 relative">
      <div className="bg-[#1B5E4B] pt-14 pb-16 px-6 text-white relative shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[13px] text-white/80 font-medium mb-1">
              {t?.greeting || "Good morning 🌅"}
            </div>
            <div className="text-[24px] font-extrabold leading-tight">
              {(t?.welcome || "Hello, {name}!").replace(
                "{name}",
                user?.name ? user.name.split(" ")[0] : "Amina",
              )}
            </div>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3.5 py-1.5 text-[12px] font-extrabold mt-3 shadow-sm tracking-wide">
              🤰 Week {user?.week || 22}
            </div>
          </div>
          <div
            className="w-12 h-12 bg-white/20 border-2 border-white/40 rounded-full flex items-center justify-center font-extrabold text-[20px] cursor-pointer shrink-0 hover:bg-white/30 transition-colors shadow-sm"
            onClick={() => navTo("settings")}
          >
            {user?.name ? user.name[0] : "A"}
          </div>
        </div>
        <div
          className="absolute -bottom-1 left-0 right-0 h-8 bg-[#fdfaf5]"
          style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        ></div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 -mt-8 relative z-10 shrink-0">
        <div
          onClick={() => navTo("reminder")}
          className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] border-[#E8F5F0] active:scale-95 transition-all cursor-pointer flex flex-col justify-center"
        >
          <div
            className="text-[28px] mb-1.5 animate-wiggle-pause"
            style={{ animationDelay: "0s" }}
          >
            ⏰
          </div>
          <div className="font-extrabold text-[15px] text-gray-900 leading-tight">
            {t?.navReminders || "Reminders"}
          </div>
          <div className="text-[12px] text-gray-500 mt-0.5 font-medium">
            3 due today
          </div>
        </div>

        <div
          onClick={() => navTo("clinic")}
          className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] border-[#FEF3C7] active:scale-95 transition-all cursor-pointer flex flex-col justify-center"
        >
          <div
            className="text-[28px] mb-1.5 animate-wiggle-pause"
            style={{ animationDelay: "1s" }}
          >
            🏥
          </div>
          <div className="font-extrabold text-[15px] text-gray-900 leading-tight">
            {t?.navLoc || "Find Care"}
          </div>
          <div className="text-[12px] text-gray-500 mt-0.5 font-medium">
            Nearby clinics
          </div>
        </div>

        <div
          onClick={() => navTo("chat")}
          className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] border-[#EFF6FF] active:scale-95 transition-all cursor-pointer flex flex-col justify-center"
        >
          <div
            className="text-[28px] mb-1.5 animate-wiggle-pause"
            style={{ animationDelay: "2.5s" }}
          >
            💬
          </div>
          <div className="font-extrabold text-[15px] text-gray-900 leading-tight">
            {t?.navChat || "AI Assistant"}
          </div>
          <div className="text-[12px] text-gray-500 mt-0.5 font-medium">
            Ask anything
          </div>
        </div>

        <div
          onClick={() => navTo("emergency")}
          className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] border-[#FDECEA] active:scale-95 transition-all cursor-pointer flex flex-col justify-center"
        >
          <div className="text-[28px] mb-1.5 animate-pulse">🚨</div>
          <div className="font-extrabold text-[15px] text-gray-900 leading-tight">
            Emergency
          </div>
          <div className="text-[12px] text-gray-500 mt-0.5 font-medium">
            Get help now
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 shrink-0">
        <div className="flex items-center justify-between mb-4 pl-1">
          <h3 className="font-extrabold text-[18px] text-gray-900 flex items-center gap-2">
            <span className="text-[#f59e0b] text-[20px] animate-sparkle-pause inline-block origin-center">
              ✨
            </span>
            {t?.dashboardTipsHeading || "Daily Health Tips"}
          </h3>
          <button
            onClick={() => navTo("guide")}
            className="text-[#1B5E4B] text-[12px] font-extrabold flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer bg-[#E8F5F0] px-3 py-1.5 rounded-full"
          >
            View Guide ➔
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {dashboardTips.map((tip, index) => (
            <div
              key={index}
              onClick={() => setSelectedTip(tip)}
              className="bg-white p-4 rounded-2xl border-[1.5px] border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#1B5E4B]/40 hover:shadow-md transition-all cursor-pointer active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold text-[#1B5E4B] bg-[#E8F5F0] px-2 py-0.5 rounded-md tracking-wider uppercase">
                  {tip.source}
                </span>
                <span className="text-[14px]">{tip.emoji}</span>
              </div>
              <h4 className="font-extrabold text-[13px] text-gray-900 mb-1 leading-tight">
                {tip.title}
              </h4>
              <p className="text-[12px] text-gray-500 leading-snug font-medium line-clamp-2">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {selectedTip && (
        <div className="fixed inset-0 bg-black/60 z-100 flex items-center justify-center p-6 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white rounded-4xl w-full max-w-sm p-6 shadow-2xl relative transform scale-100 transition-transform duration-300">
            <button
              onClick={closeTipModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-colors"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <div className="flex items-start gap-3 mb-4 pr-8">
              <div className="w-10 h-10 shrink-0 bg-[#E8F5F0] rounded-full flex items-center justify-center text-[#1B5E4B] text-xl">
                {selectedTip.emoji}
              </div>
              <h3 className="font-extrabold text-[20px] text-gray-900 leading-tight mt-1">
                {selectedTip.title}
              </h3>
            </div>
            <div className="inline-block bg-[#EFF6FF] text-blue-700 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-blue-100">
              Source: {selectedTip.source}
            </div>
            <p className="text-[15px] text-gray-600 leading-relaxed font-medium mb-8">
              {selectedTip.desc}
            </p>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1.5 shrink-0 border border-gray-200 shadow-inner">
                {isReading && !isTipPaused ? (
                  <button
                    onClick={pauseTipAudio}
                    className="p-2 text-gray-700 hover:text-[#1B5E4B] transition-colors"
                  >
                    <Pause size={16} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      isReading && isTipPaused
                        ? resumeTipAudio()
                        : playTipAudio(
                            selectedTip.title,
                            selectedTip.desc,
                            selectedTip.source,
                          )
                    }
                    className="p-2 text-gray-700 hover:text-[#1B5E4B] transition-colors"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                )}
                <button
                  onClick={stopTipAudio}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              </div>
              <button
                onClick={closeTipModal}
                className="flex-1 bg-[#1B5E4B] text-white py-3.5 rounded-2xl font-extrabold text-[15px] shadow-[0_4px_12px_rgba(27,94,75,0.2)] hover:bg-[#154b3c] active:scale-95 transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
