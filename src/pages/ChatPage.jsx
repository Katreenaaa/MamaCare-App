import { useState, useEffect, useRef } from "react";
import { useSpeech } from "../hooks/useSpeech";
import { ArrowLeft, Headset } from "lucide-react";

export default function ChatPage({ user, t, onBack }) {
  const [chatLang, setChatLang] = useState(user?.lang || "en");

  const langMap = {
    en: { code: "en-NG", name: "English" },
    yo: { code: "yo-NG", name: "Yorùbá" },
    ha: { code: "ha-NG", name: "Hausa" },
    ig: { code: "ig-NG", name: "Igbo" },
    pc: { code: "en-NG", name: "Pidgin" },
  };

  const currentLangDetails = langMap[chatLang] || langMap.en;
  const langCode = currentLangDetails.code;
  const displayLang = currentLangDetails.name;

  const {
    speak,
    stopSpeech,
    isSpeaking,
    startRecording,
    stopRecording,
    isRecording,
  } = useSpeech(langCode);

  const MOCK_TRANSLATED_RESPONSES = {
    en: "That's perfectly normal during this trimester. Make sure you are drinking plenty of water and getting enough rest. Can I help you log this symptom?",
    yo: "Eleyi jẹ deede lasiko yii. Rii daju pe o n mu omi pupọ ati pe o n sinmi daradara. Ṣe MO le ṣe iranlọwọ fun ọ lati ṣafikun aami aisan yii?",
    ha: "Wannan al'ada ce a wannan lokacin. Tabbatar kana shan ruwa sosai kuma kana samun isasshen hutu. Ko in taimaka miki wajen rubuta wannan alamar?",
    ig: "Nke a bụ ihe nkịtị n'oge a. Gbaa mbọ hụ na ị na-aṅụ mmiri nke ọma ma na-ezu ike nke ọma. Enwere m ike inyere gị aka ịdebanye mgbaàmà a?",
    pc: "Dis one na normal thing for dis time. Make sure say you dey drink plenty water and rest well. You want make I help you record am?",
  };

  const [messages, setMessages] = useState(() => {
    const userName = user?.name ? user.name.split(" ")[0] : "Adebola";
    const welcomeText = (
      t?.chatWelcome ||
      "Hello {name}! 👋 I'm here to help you through your pregnancy journey. You can ask me anything — symptoms, nutrition, appointments, and more. How are you feeling today?"
    ).replace("{name}", userName);
    return [
      {
        id: 1,
        text: welcomeText,
        role: "ai",
        time: "Just now",
        msgLang: "en-NG",
      },
    ];
  });

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleMic = () => {
    if (isRecording) {
      stopRecording();
    } else {
      if (isSpeaking) stopSpeech();
      setInputText("");
      startRecording(
        (res) => setInputText(res.finalTranscript + res.interimTranscript),
        () => console.log("Recording stopped"),
      );
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (isRecording) stopRecording();
    if (isSpeaking) stopSpeech();

    const newMsg = {
      id: Date.now(),
      text: inputText,
      role: "user",
      time: "Now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    setTimeout(() => {
      const responseText =
        MOCK_TRANSLATED_RESPONSES[chatLang] || MOCK_TRANSLATED_RESPONSES.en;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: responseText,
          role: "ai",
          time: "Now",
          msgLang: langCode,
        },
      ]);

      speak(responseText, langCode);
    }, 1200);
  };

  return (
    <div className="h-full min-h-full flex-1 bg-[#fdfaf5] flex flex-col relative overflow-hidden">
      {/* THE FIX: Header padding matches Dashboard (pt-14 pb-8 px-6) */}
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white flex items-center gap-4 z-20 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer -ml-2"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
        )}

        {/* AI ASSISTANT AVATAR */}
        <div className="w-12 h-12 shrink-0 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30 shadow-sm">
          <Headset size={24} className="text-white" strokeWidth={2.5} />
        </div>

        <div className="flex flex-col justify-center">
          {/* THE FIX: Font size increased to 24px to match other pages */}
          <h3 className="font-extrabold text-[24px] leading-tight tracking-tight">
            MamaCare AI
          </h3>
          <p className="text-[13px] text-white/80 mt-0.5 font-medium">
            Responding in {displayLang}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar flex flex-col">
        <div className="relative flex justify-center mt-2 mb-6">
          <div className="bg-[#EBF4FF] text-[#4A6478] text-[11px] font-extrabold py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-sm border border-blue-50/50 cursor-pointer">
            <span className="text-[13px]">🌐</span> {displayLang}{" "}
            <span className="text-[9px] text-[#4A6478]/70 ml-0.5">▼</span>
          </div>
          <select
            value={chatLang}
            onChange={(e) => {
              setChatLang(e.target.value);
              stopSpeech();
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          >
            <option value="en">English</option>
            <option value="yo">Yorùbá</option>
            <option value="ha">Hausa</option>
            <option value="ig">Igbo</option>
            <option value="pc">Pidgin</option>
          </select>
        </div>

        <div className="flex flex-col gap-5 pb-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[85%] ${msg.role === "ai" ? "self-start" : "self-end"}`}
            >
              <div
                className={`p-3.5 text-[14px] leading-relaxed relative group ${
                  msg.role === "ai"
                    ? "bg-white border-[1.5px] border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] text-gray-800 rounded-[20px] rounded-tl-sm"
                    : "bg-[#1B5E4B] text-white rounded-[20px] rounded-tr-sm shadow-sm"
                }`}
              >
                {msg.text}

                {msg.role === "ai" && (
                  <button
                    onClick={() => speak(msg.text, msg.msgLang || langCode)}
                    className="absolute -right-10 top-2 bg-white border border-gray-100 hover:bg-gray-50 p-1.5 rounded-full text-xs shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🔊
                  </button>
                )}
              </div>
              <div
                className={`text-[10px] text-gray-400 mt-1.5 px-1 font-medium ${msg.role === "user" ? "text-right" : "text-left"}`}
              >
                {msg.time}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-200 p-3 flex gap-2 items-center pb-28 z-20 relative">
        <input
          type="text"
          className="flex-1 bg-white border-[1.5px] border-gray-200 rounded-full py-3.5 px-4 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1B5E4B] transition-colors"
          placeholder={isRecording ? "Listening..." : "Ask me anything..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {isSpeaking && (
          <button
            onClick={stopSpeech}
            className="w-12 h-12 shrink-0 rounded-full flex items-center justify-center bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors animate-pulse cursor-pointer"
            title="Mute Audio"
          >
            🔇
          </button>
        )}

        {/* Mic Button */}
        <button
          onClick={toggleMic}
          className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isRecording
              ? "bg-red-100 text-red-500 animate-pulse"
              : "bg-[#E8F5F0] text-[#1B5E4B] hover:bg-[#d5ebe2]"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.39-.9.88v.2c0 2.82-2.34 5.12-5.01 5.12-2.67 0-5.01-2.3-5.01-5.12v-.2c0-.49-.41-.88-.9-.88s-.9.39-.9.88v.2c0 3.35 2.62 6.13 5.91 6.64v2.58h-2.5c-.5 0-.9.4-.9.9s.4.9.9.9h6.82c.5 0 .9-.4.9-.9s-.4-.9-.9-.9h-2.5v-2.58c3.29-.51 5.91-3.29 5.91-6.64v-.2c0-.49-.41-.88-.9-.88z" />
          </svg>
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!inputText.trim() && !isRecording}
          className="w-12 h-12 shrink-0 bg-[#1B5E4B] text-white rounded-full flex items-center justify-center hover:bg-[#154b3c] transition-colors disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
