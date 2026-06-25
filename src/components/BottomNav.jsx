export default function BottomNav({ activeScreen, setActiveScreen, t }) {
  if (["welcome", "login", "register", "logout"].includes(activeScreen))
    return null;

  return (
    // shrink-0 prevents it from squishing
    <div className="w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-6 shrink-0 z-50">
      <button
        onClick={() => setActiveScreen("dashboard")}
        className={`flex flex-col items-center ${activeScreen === "dashboard" ? "text-[#1B5E4B]" : "text-gray-400"}`}
      >
        <span className="text-xl">🏠</span>
        <span className="text-[10px] font-bold">{t?.navHome || "Home"}</span>
      </button>
      <button
        onClick={() => setActiveScreen("reminder")}
        className={`flex flex-col items-center ${activeScreen === "reminder" ? "text-[#1B5E4B]" : "text-gray-400"}`}
      >
        <span className="text-xl">⏰</span>
        <span className="text-[10px] font-bold">Reminders</span>
      </button>
      <button
        onClick={() => setActiveScreen("chat")}
        className={`flex flex-col items-center ${activeScreen === "chat" ? "text-[#1B5E4B]" : "text-gray-400"}`}
      >
        <span className="text-xl">💬</span>
        <span className="text-[10px] font-bold">{t?.navChat || "Chat"}</span>
      </button>
      <button
        onClick={() => setActiveScreen("clinic")}
        className={`flex flex-col items-center ${activeScreen === "clinic" ? "text-[#1B5E4B]" : "text-gray-400"}`}
      >
        <span className="text-xl">📍</span>
        <span className="text-[10px] font-bold">{t?.navLoc || "Clinics"}</span>
      </button>
      <button
        onClick={() => setActiveScreen("settings")}
        className={`flex flex-col items-center ${activeScreen === "settings" ? "text-[#1B5E4B]" : "text-gray-400"}`}
      >
        <span className="text-xl">⚙️</span>
        <span className="text-[10px] font-bold">Settings</span>
      </button>
    </div>
  );
}
