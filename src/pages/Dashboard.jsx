export default function Dashboard({ user, t, navTo }) {
  const tags = ["WHO", "UNICEF", "FMOH"];

  // Fallback tips in case the translation dictionary hasn't loaded yet
  const displayTips =
    t?.tips?.length > 0
      ? t.tips
      : [
          "Drink at least 8 glasses of water today.",
          "Take your prenatal vitamins after a meal.",
          "Rest with your feet elevated to reduce swelling.",
        ];

  return (
    <div className="flex flex-col min-h-full bg-[#fdfaf5] pb-28">
      {/* Header with wave illusion */}
      <div className="bg-[#1B5E4B] pt-14 pb-16 px-6 text-white relative shrink-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-[13px] text-white/80 font-medium mb-1">
              {t?.greeting || "Good morning 🌅"}
            </div>
            <div className="text-[24px] font-extrabold leading-tight">
              {/* Dynamically injects the user's first name into the translated welcome string */}
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

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-3 px-4 -mt-8 relative z-10 shrink-0">
        {/* Reminder Card */}
        <div
          onClick={() => navTo("reminder")}
          className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] border-[#E8F5F0] active:scale-95 transition-all cursor-pointer flex flex-col justify-center"
        >
          {/* Shakes first */}
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

        {/* Clinic Card */}
        <div
          onClick={() => navTo("clinic")}
          className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] border-[#FEF3C7] active:scale-95 transition-all cursor-pointer flex flex-col justify-center"
        >
          {/* Shakes a second later */}
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

        {/* Chat Card */}
        <div
          onClick={() => navTo("chat")}
          className="bg-white p-4 rounded-[20px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border-[1.5px] border-[#EFF6FF] active:scale-94 transition-all cursor-pointer flex flex-col justify-center"
        >
          {/* Shakes a second after clinic */}
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

        {/* Emergency Card (Kept exactly as you wanted!) */}
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

      {/* Tips Section */}
      <div className="px-4 mt-8 shrink-0">
        <h3 className="font-extrabold text-[18px] text-gray-900 mb-4 flex items-center gap-2 pl-1">
          {/* New custom Sparkle animation! */}
          <span className="text-[#f59e0b] text-[20px] animate-sparkle-pause inline-block origin-center">
            ✨
          </span>{" "}
          {t?.dashboardTipsHeading || "Pregnancy Tips"}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {displayTips.map((tip, index) => (
            <div
              key={index}
              className="bg-white p-3.5 rounded-2xl border-[1.5px] border-gray-100 shadow-sm flex flex-col hover:border-[#1B5E4B]/30 transition-colors"
            >
              <span className="text-[10px] font-extrabold text-[#1B5E4B] tracking-wider uppercase mb-1.5">
                {tags[index % tags.length]}
              </span>
              <p className="text-[12px] text-gray-700 leading-snug font-medium">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
