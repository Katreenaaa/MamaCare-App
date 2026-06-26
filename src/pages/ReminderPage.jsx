import { useState, useEffect, useRef } from "react";
import { REMINDER_DATA } from "../data";
import { Mic, Square, ArrowLeft } from "lucide-react";

export default function ReminderPage({ t, lang, onBack }) {
  // LANGUAGE & STATE SETUP
  const getRemindersForLang = (langCode) => {
    return REMINDER_DATA[langCode] || REMINDER_DATA.en;
  };

  const [reminders, setReminders] = useState(() => getRemindersForLang(lang));
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReminders(getRemindersForLang(lang));
  }, [lang]);

  // NEW REMINDER FORM STATES
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newCat, setNewCat] = useState("task");

  // VOICE RECORDING STATES & LOGIC
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/mp3",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied. Please allow mic permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  // SAVE & TOGGLE LOGIC
  const handleSaveReminder = () => {
    if (!newTitle.trim() && !audioUrl) {
      alert("Please enter a title or record a voice note.");
      return;
    }

    const newRem = {
      id: Date.now(),
      title: newTitle.trim() || "Voice Note",
      time: newTime || "Anytime",
      cat: newCat,
      done: false,
      audio: audioUrl,
    };

    setReminders((prev) => [...prev, newRem]);

    // Reset form
    setNewTitle("");
    setNewTime("");
    setNewCat("task");
    setAudioUrl(null);
    setShowAddForm(false);
  };

  const toggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((rem) => (rem.id === id ? { ...rem, done: !rem.done } : rem)),
    );
  };

  // UI HELPERS
  const getCategoryStyles = (cat) => {
    switch (cat) {
      case "med":
        return "bg-[#EBF4FF] text-[#1D4ED8] border border-blue-100";
      case "appt":
        return "bg-[#E8F5F0] text-[#1B5E4B] border border-green-100";
      case "tip":
        return "bg-[#FFF6E5] text-[#B88012] border border-orange-100";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getCategoryLabel = (cat) => {
    switch (cat) {
      case "med":
        return "💊 Med";
      case "appt":
        return "📅 Appt";
      case "tip":
        return "💡 Tip";
      default:
        return "📌 Task";
    }
  };

  return (
    <div className="h-full min-h-full flex-1 bg-[#fdfaf5] flex flex-col relative overflow-hidden">
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white flex items-center gap-3 relative z-10 shadow-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors mr-1 cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
        )}
        <div>
          <h2 className="text-[26px] font-extrabold tracking-tight leading-tight">
            {t?.remindersHeading || "Reminders"}
          </h2>
          <p className="text-[13px] text-white/80 mt-0.5">
            {t?.remindersSub || "Stay on track"}
          </p>
        </div>
      </div>

      {/* 2. Task List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className={`bg-white rounded-[20px] p-4 flex items-start gap-4 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] ${
              rem.done
                ? "border-gray-100 opacity-60 bg-gray-50/50"
                : "border-gray-100"
            }`}
          >
            <button
              onClick={() => toggleReminder(rem.id)}
              className={`w-7 h-7 mt-0.5 rounded-full border-2 flex shrink-0 items-center justify-center transition-colors cursor-pointer ${
                rem.done
                  ? "bg-[#1B5E4B] border-[#1B5E4B] text-white"
                  : "border-gray-300 bg-white hover:border-[#1B5E4B]"
              }`}
            >
              {rem.done && <span className="text-sm font-bold">✓</span>}
            </button>

            <div className="flex-1 min-w-0">
              <div
                className={`font-extrabold text-[15px] leading-tight mb-1 ${
                  rem.done ? "text-gray-500 line-through" : "text-gray-900"
                }`}
              >
                {rem.title}
              </div>

              <div className="w-full flex items-center justify-between mt-1 text-[12px] font-medium text-gray-500">
                <span>🕐 {rem.time}</span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap ${getCategoryStyles(
                    rem.cat,
                  )}`}
                >
                  {getCategoryLabel(rem.cat)}
                </span>
              </div>

              {/* PLAYBACK: If this reminder has audio, show the player! */}
              {rem.audio && (
                <div className="mt-3 bg-gray-50 rounded-xl p-2 border border-gray-100">
                  <audio
                    src={rem.audio}
                    controls
                    className="h-8 w-full max-w-55"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Bottom Action Area */}

      <div className="shrink-0 bg-[#fdfaf5] z-20 pb-28 pt-4 px-6">
        {showAddForm ? (
          <div className="flex flex-col gap-3 animate-slide-up bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <input
              type="text"
              placeholder="What do you need to remember?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#1B5E4B]"
            />

            <div className="flex gap-3">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#1B5E4B]"
              />
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#1B5E4B]"
              >
                <option value="task">📌 Task</option>
                <option value="med">💊 Med</option>
                <option value="appt">📅 Appt</option>
              </select>
            </div>

            {/* Voice Recording Controls */}
            <div className="flex items-center gap-2 mt-1">
              {!isRecording && !audioUrl && (
                <button
                  onClick={startRecording}
                  className="flex-1 bg-[#E8F5F0] text-[#1B5E4B] font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mic size={18} strokeWidth={2.5} /> <span>Record Voice</span>
                </button>
              )}
              {isRecording && (
                <button
                  onClick={stopRecording}
                  className="flex-1 bg-red-100 text-red-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 animate-pulse cursor-pointer"
                >
                  <Square size={16} fill="currentColor" strokeWidth={2.5} />{" "}
                  <span>Stop Recording</span>
                </button>
              )}
              {audioUrl && (
                <div className="flex-1 flex items-center bg-gray-50 rounded-xl border border-gray-200 pr-2 overflow-hidden">
                  <audio src={audioUrl} controls className="h-10 w-full" />
                  <button
                    onClick={() => setAudioUrl(null)}
                    className="text-red-500 font-bold px-3 text-lg cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Save / Cancel Buttons */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReminder}
                className="flex-2 bg-[#1B5E4B] text-white font-extrabold py-3 rounded-xl shadow-md cursor-pointer hover:bg-[#154b3c]"
              >
                Save Reminder
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-[#1B5E4B] text-white font-extrabold py-4 rounded-2xl shadow-[0_4px_12px_rgba(27,94,75,0.2)] flex items-center justify-center gap-2 hover:bg-[#154b3c] transition-transform active:scale-95 cursor-pointer"
          >
            <span className="text-xl leading-none -mt-0.5">+</span>{" "}
            {t?.addReminder || "Add Reminder"}
          </button>
        )}
      </div>
    </div>
  );
}
