import { useState, useEffect, useRef } from "react";
import { REMINDER_DATA } from "../data";
import { Mic, Square, ArrowLeft, Trash2, BellRing } from "lucide-react";

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

  // SAVE, TOGGLE & DELETE LOGIC
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

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((rem) => rem.id !== id));
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
      {/* 1. PREMIUM HEADER (Light Theme) */}
      <div className="shrink-0 pt-14 pb-4 px-6 flex items-center justify-between z-10 bg-[#fdfaf5]">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 -ml-1 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-[#1B5E4B]"
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>
          )}
          <h2 className="text-[24px] font-extrabold tracking-tight text-gray-900 leading-tight">
            {t?.remindersHeading || "Reminders"}
          </h2>
        </div>
        <div className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[#1B5E4B] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <BellRing size={18} strokeWidth={2.5} />
        </div>
      </div>

      {/* 2. Task List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pb-28">
        {/* Progress Text */}
        <p className="text-[13px] text-gray-500 font-medium mb-2 pl-1">
          {reminders.filter((r) => r.done).length} of {reminders.length}{" "}
          completed
        </p>

        {reminders.map((rem) => (
          <div
            key={rem.id}
            className={`bg-white rounded-3xl p-4 flex items-start gap-4 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] ${
              rem.done
                ? "border-gray-100 opacity-60 bg-gray-50/50"
                : "border-gray-100 hover:border-[#1B5E4B]/30"
            }`}
          >
            {/* Checkbox */}
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

            {/* Content */}
            <div className="flex-1 min-w-0 pr-2">
              <div
                className={`font-extrabold text-[15px] leading-tight mb-1 ${
                  rem.done ? "text-gray-500 line-through" : "text-gray-900"
                }`}
              >
                {rem.title}
              </div>

              <div className="w-full flex items-center gap-3 mt-1.5 text-[12px] font-medium text-gray-500">
                <span className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  🕐 {rem.time}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded whitespace-nowrap ${getCategoryStyles(
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

            {/* Delete Button */}
            <button
              onClick={() => deleteReminder(rem.id)}
              className="text-red-400 hover:text-red-600 bg-red-50 p-2 rounded-full transition-colors shrink-0 cursor-pointer mt-0.5"
            >
              <Trash2 size={16} strokeWidth={2.5} />
            </button>
          </div>
        ))}

        {reminders.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-8 font-medium">
            You have no reminders. Tap below to add one!
          </div>
        )}
      </div>

      {/* 3. Bottom Action Area */}
      <div className="shrink-0 bg-[#fdfaf5] z-20 pb-28 pt-4 px-6 absolute bottom-0 left-0 right-0">
        {showAddForm ? (
          <div className="flex flex-col gap-3 animate-slide-up bg-white p-5 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border border-gray-100">
            <input
              type="text"
              placeholder="What do you need to remember?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#1B5E4B] text-gray-900 font-medium"
            />

            <div className="flex gap-3">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#1B5E4B] text-gray-900 font-medium"
              />
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#1B5E4B] text-gray-900 font-medium appearance-none"
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
                  className="flex-1 bg-[#E8F5F0] text-[#1B5E4B] font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors hover:bg-[#d1eae0]"
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
                className="flex-1 py-3 text-gray-500 font-extrabold hover:bg-gray-50 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReminder}
                className="flex-2 bg-[#1B5E4B] text-white font-extrabold py-3 rounded-xl shadow-[0_4px_12px_rgba(27,94,75,0.15)] cursor-pointer hover:bg-[#154b3c] transition-colors"
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
