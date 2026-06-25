import { useState, useEffect } from "react";
import { REMINDER_DATA } from "../data"; // Ensure this is imported

export default function ReminderPage({ t, lang, onBack }) {
  // Use a function to load reminders based on the selected language
  const getRemindersForLang = (langCode) => {
    return REMINDER_DATA[langCode] || REMINDER_DATA.en;
  };

  // Initialize state dynamically
  const [reminders, setReminders] = useState(() => getRemindersForLang(lang));

  // Sync reminders when the language changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReminders(getRemindersForLang(lang));
  }, [lang]);

  const toggleReminder = (id) => {
    setReminders((prev) =>
      prev.map((rem) => (rem.id === id ? { ...rem, done: !rem.done } : rem)),
    );
  };

  const handleAddReminder = () => {
    const title = window.prompt("Enter new reminder:");
    if (title && title.trim()) {
      const newRem = {
        id: Date.now(),
        title: title.trim(),
        time: "Custom",
        cat: "appt",
        done: false,
      };
      setReminders((prev) => [...prev, newRem]);
    }
  };

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
        return "Task";
    }
  };

  return (
    <div className="h-full bg-[#FDFAF5] flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors mr-1 cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
        )}
        <div>
          <h2 className="text-[26px] font-extrabold tracking-tight leading-tight">
            {t?.remindersHeading}
          </h2>
          <p className="text-[13px] text-white/80 mt-0.5">{t?.remindersSub}</p>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 flex flex-col gap-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            onClick={() => toggleReminder(rem.id)}
            className={`bg-white rounded-[20px] p-4 flex items-center gap-4 cursor-pointer transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] ${
              rem.done
                ? "border-gray-100 opacity-60 bg-gray-50/50"
                : "border-gray-100 hover:border-[#1B5E4B]/30"
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full border-2 flex shrink-0 items-center justify-center transition-colors ${
                rem.done
                  ? "bg-[#1B5E4B] border-[#1B5E4B] text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {rem.done && <span className="text-sm font-bold">✓</span>}
            </div>

            <div className="flex-1">
              <div
                className={`font-extrabold text-[15px] leading-tight ${rem.done ? "text-gray-500 line-through" : "text-gray-900"}`}
              >
                {rem.title}
              </div>
              <div className="text-[12px] font-medium text-gray-500 mt-1">
                🕐 {rem.time}
              </div>
            </div>

            <div
              className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg whitespace-nowrap ${getCategoryStyles(rem.cat)}`}
            >
              {getCategoryLabel(rem.cat)}
            </div>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="shrink-0 px-6 pb-6 pt-2 bg-[#FDFAF5]">
        <button
          onClick={handleAddReminder}
          className="w-full bg-[#1B5E4B] text-white font-extrabold py-4 rounded-2xl shadow-[0_4px_12px_rgba(27,94,75,0.2)] flex items-center justify-center gap-2 hover:bg-[#154b3c] transition-colors active:scale-[0.98]"
        >
          <span className="text-xl leading-none -mt-0.5">+</span>{" "}
          {t?.addReminder}
        </button>
      </div>
    </div>
  );
}
