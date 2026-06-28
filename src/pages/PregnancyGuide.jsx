import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Info,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { PREGNANCY_GUIDE_DATA } from "../data";

export default function PregnancyGuide({ user, onBack, language }) {
  const currentWeek = user?.week || 22;
  const currentMonth = Math.ceil(currentWeek / 4.33) || 5;

  const [expandedMonth, setExpandedMonth] = useState(currentMonth);

  const [activeAudioId, setActiveAudioId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const voiceLangMap = {
    en: "en-NG",
    yo: "yo-NG",
    ha: "ha-NG",
    ig: "ig-NG",
    pc: "en-NG",
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const playAudio = (id, text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLangMap[language] || "en-NG";

    utterance.onend = () => {
      setActiveAudioId(null);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setActiveAudioId(id);
    setIsPaused(false);
  };

  const pauseAudio = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumeAudio = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setActiveAudioId(null);
    setIsPaused(false);
  };

  const pregnancyTimeline =
    PREGNANCY_GUIDE_DATA[language] || PREGNANCY_GUIDE_DATA.en;

  const toggleMonth = (month) => {
    if (expandedMonth === month) {
      setExpandedMonth(null);
    } else {
      setExpandedMonth(month);
    }
    stopAudio();
  };

  return (
    <div className="h-full min-h-full flex-1 flex flex-col bg-[#fdfaf5] overflow-hidden relative">
      <div className="shrink-0 pt-14 pb-4 px-6 flex items-center gap-3 z-20">
        <button
          onClick={() => {
            stopAudio();
            onBack();
          }}
          className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-[#1B5E4B]"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <h2 className="text-[26px] font-extrabold text-[#1B5E4B] tracking-tight">
          Pregnancy Guide
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="bg-[#FFF6E5] border border-[#FDEBCE] rounded-xl p-4 flex items-start gap-3 mb-6">
          <Info className="text-orange-500 shrink-0 mt-0.5" size={20} />
          <p className="text-[13px] text-orange-800 font-medium leading-relaxed">
            For education only. Every pregnancy is different — always consult a
            registered health worker.
          </p>
        </div>

        <div className="space-y-4">
          {pregnancyTimeline.map((item) => {
            const isExpanded = expandedMonth === item.month;
            const isCurrentStage = item.month === currentMonth;

            return (
              <div
                key={item.month}
                className={`bg-white rounded-3xl border-[1.5px] shadow-sm overflow-hidden transition-all duration-300 ${isExpanded ? "border-[#1B5E4B]" : "border-gray-100"}`}
              >
                <div
                  onClick={() => toggleMonth(item.month)}
                  className="p-5 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center font-extrabold text-[16px] transition-colors ${isCurrentStage ? "bg-[#1B5E4B] text-white shadow-md" : "bg-[#E8F5F0] text-[#1B5E4B]"}`}
                    >
                      M{item.month}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-extrabold text-[18px] leading-tight ${isExpanded ? "text-gray-900" : "text-gray-700"}`}
                        >
                          Month {item.month}
                        </span>
                        {isCurrentStage && (
                          <span className="bg-[#FFE8EC] text-[#8B1D3B] px-2 py-0.5 rounded text-[10px] font-extrabold uppercase">
                            Your Stage
                          </span>
                        )}
                      </div>
                      <span className="text-[13px] text-gray-500 mt-0.5">
                        {item.weeks} · {item.title}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? (
                      <ChevronUp size={24} />
                    ) : (
                      <ChevronDown size={24} />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="pb-6 pt-2 bg-gray-50/30 border-t border-gray-50">
                    {item.tips && item.tips.length > 0 ? (
                      <div className="flex overflow-x-auto gap-4 px-5 pb-4 snap-x snap-mandatory scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                        {item.tips.map((tip) => (
                          <div
                            key={tip.id}
                            className={`${tip.bgColor} min-w-65 w-65 snap-center rounded-3xl p-5 shadow-sm border border-black/5 flex flex-col relative`}
                          >
                            <div className="flex justify-between items-start mb-4">
                              <span className="bg-white/60 text-gray-800 text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                Tip {tip.id.split("-")[1]}
                              </span>

                              <div className="flex items-center gap-1 bg-white/60 rounded-full p-1">
                                {activeAudioId === tip.id && !isPaused ? (
                                  <button
                                    onClick={pauseAudio}
                                    className="p-1.5 text-gray-700 hover:text-[#1B5E4B]"
                                  >
                                    <Pause size={14} fill="currentColor" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      activeAudioId === tip.id && isPaused
                                        ? resumeAudio()
                                        : playAudio(
                                            tip.id,
                                            `${tip.title}. ${tip.desc}`,
                                          )
                                    }
                                    className="p-1.5 text-gray-700 hover:text-[#1B5E4B]"
                                  >
                                    <Play size={14} fill="currentColor" />
                                  </button>
                                )}
                                <button
                                  onClick={stopAudio}
                                  className="p-1.5 text-gray-400 hover:text-red-500"
                                >
                                  <Square size={14} fill="currentColor" />
                                </button>
                              </div>
                            </div>

                            <div className="text-[50px] text-center mb-4 leading-none">
                              {tip.emoji}
                            </div>

                            <div className="mt-auto">
                              <h4 className="font-extrabold text-[16px] text-gray-900 mb-1 leading-tight">
                                {tip.title}
                              </h4>
                              <p className="text-[13px] text-gray-700 leading-relaxed font-medium">
                                {tip.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 px-5">
                        <p className="text-sm text-gray-500 italic">
                          No tips available yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
