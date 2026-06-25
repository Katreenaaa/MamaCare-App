export default function EmergencyPage({ t, user, onBack }) {
  return (
    <div className="h-full bg-red-50 flex flex-col overflow-hidden">
      {/* Red Warning Header */}
      <div className="shrink-0 bg-[#DC2626] pt-14 pb-8 px-6 text-white flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1 hover:bg-white/20 rounded-full transition-colors mr-1 cursor-pointer"
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
        <div>
          <h2 className="text-[26px] font-extrabold tracking-tight leading-tight">
            {t?.emergencyHeading || "Emergency Help"}
          </h2>
          <p className="text-[13px] text-white/90 mt-0.5 font-medium">
            {t?.emergencySub || "Get medical help immediately"}
          </p>
        </div>
      </div>

      {/* Replaced overflow-y-auto with overflow-hidden to lock scrolling */}
      <div className="flex-1 overflow-hidden px-6 pt-8 pb-6 flex flex-col gap-4">
        {/* Pulsing Alert Icon */}
        <div className="flex justify-center mb-4 shrink-0">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-75"></div>
            <span className="text-5xl relative z-10">🚨</span>
          </div>
        </div>

        {/* 112 National Emergency */}
        <a
          href="tel:112"
          className="bg-white p-5 rounded-[20px] shadow-sm border-2 border-red-100 flex items-center gap-4 active:scale-95 transition-transform shrink-0"
        >
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl shrink-0">
            🚑
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[16px] text-gray-900">
              {t?.callAmbulance || "Call Ambulance (112)"}
            </div>
            <div className="text-[13px] text-gray-500 mt-0.5">
              National toll-free emergency
            </div>
          </div>
        </a>

        {/* Call PHC/Clinic */}
        <a
          href="tel:08000000000" // Mock clinic number
          className="bg-white p-5 rounded-[20px] shadow-sm border-2 border-[#E8F5F0] flex items-center gap-4 active:scale-95 transition-transform shrink-0"
        >
          <div className="w-12 h-12 bg-[#E8F5F0] rounded-full flex items-center justify-center text-2xl shrink-0">
            🏥
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[16px] text-gray-900">
              {t?.callClinic || "Call Your Clinic"}
            </div>
            <div className="text-[13px] text-[#1B5E4B] font-bold mt-0.5">
              {user?.phc || "PHC Surulere"}
            </div>
          </div>
        </a>

        {/* Call Emergency Contact */}
        <a
          href="tel:08000000000" // Mock partner number
          className="bg-white p-5 rounded-[20px] shadow-sm border-2 border-gray-100 flex items-center gap-4 active:scale-95 transition-transform shrink-0"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl shrink-0">
            👨‍👩‍👦
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[16px] text-gray-900">
              {t?.callPartner || "Call Partner"}
            </div>
            <div className="text-[13px] text-gray-500 mt-0.5">
              Saved emergency contact
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
