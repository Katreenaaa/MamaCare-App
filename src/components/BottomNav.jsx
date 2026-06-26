import { Home, Bell, MessageCircle, MapPin, Settings } from "lucide-react";

export default function BottomNav({ activeScreen, setActiveScreen, t }) {
  if (
    ["welcome", "language", "login", "register", "logout"].includes(
      activeScreen,
    )
  )
    return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around px-2 pt-3 pb-8 z-9999">
      <button
        onClick={() => setActiveScreen("dashboard")}
        className={`flex flex-col items-center gap-1.5 w-16 transition-transform active:scale-90 cursor-pointer ${
          activeScreen === "dashboard"
            ? "text-[#1B5E4B]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Home size={24} strokeWidth={activeScreen === "dashboard" ? 2.5 : 2} />
        <span className="text-[10px] font-extrabold uppercase tracking-wide">
          {t?.navHome || "Home"}
        </span>
      </button>

      <button
        onClick={() => setActiveScreen("reminder")}
        className={`flex flex-col items-center gap-1.5 w-16 transition-transform active:scale-90 cursor-pointer ${
          activeScreen === "reminder"
            ? "text-[#1B5E4B]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Bell size={24} strokeWidth={activeScreen === "reminder" ? 2.5 : 2} />
        <span className="text-[10px] font-extrabold uppercase tracking-wide">
          Reminders
        </span>
      </button>

      <button
        onClick={() => setActiveScreen("chat")}
        className={`flex flex-col items-center gap-1.5 w-16 transition-transform active:scale-90 cursor-pointer ${
          activeScreen === "chat"
            ? "text-[#1B5E4B]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <MessageCircle
          size={24}
          strokeWidth={activeScreen === "chat" ? 2.5 : 2}
        />
        <span className="text-[10px] font-extrabold uppercase tracking-wide">
          {t?.navChat || "Chat"}
        </span>
      </button>

      <button
        onClick={() => setActiveScreen("clinic")}
        className={`flex flex-col items-center gap-1.5 w-16 transition-transform active:scale-90 cursor-pointer ${
          activeScreen === "clinic"
            ? "text-[#1B5E4B]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <MapPin size={24} strokeWidth={activeScreen === "clinic" ? 2.5 : 2} />
        <span className="text-[10px] font-extrabold uppercase tracking-wide">
          {t?.navLoc || "Clinics"}
        </span>
      </button>

      <button
        onClick={() => setActiveScreen("settings")}
        className={`flex flex-col items-center gap-1.5 w-16 transition-transform active:scale-90 cursor-pointer ${
          activeScreen === "settings"
            ? "text-[#1B5E4B]"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        <Settings
          size={24}
          strokeWidth={activeScreen === "settings" ? 2.5 : 2}
        />
        <span className="text-[10px] font-extrabold uppercase tracking-wide">
          Settings
        </span>
      </button>
    </div>
  );
}
