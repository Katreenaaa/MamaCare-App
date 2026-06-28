import {
  ArrowLeft,
  Ambulance,
  Users,
  Activity,
  AlertOctagon,
} from "lucide-react";

export default function EmergencyPage({ t, user, onBack }) {
  // Pull dynamic numbers from the user profile if they exist
  const doctorNumber = user?.doctorPhone;
  const emergencyNumber = user?.emergencyContacts?.[0]; // Get the first saved emergency contact

  // Fallback danger signs if translations aren't loaded yet
  const dangerSignsList = t?.dangerSigns || [
    "Severe or Persistent Headache",
    "Vaginal Bleeding (any amount)",
    "Reduced or No Baby Movement",
    "Severe Abdominal Pain",
    "Blurred Vision or Seeing Spots",
    "Sudden Swelling of Face or Hands",
  ];

  return (
    <div className="h-full min-h-full flex-1 bg-[#FFF6F5] flex flex-col relative overflow-hidden">
      {/* 1. PREMIUM HEADER (Soft Rose Theme) */}
      <div className="shrink-0 pt-14 pb-4 px-6 flex items-center justify-between z-10 bg-[#FFF6F5]">
        <div className="flex items-center gap-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 -ml-1 hover:bg-red-50 rounded-full transition-colors cursor-pointer text-red-600"
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>
          )}
          <h2 className="text-[24px] font-extrabold tracking-tight text-red-600 leading-tight">
            {t?.emergencyHeading || "Emergency Help"}
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 flex flex-col scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Pulsating Alert Icon */}
        <div className="flex justify-center mt-2 mb-8 shrink-0">
          <div className="w-25 h-25 bg-red-100/50 rounded-full flex items-center justify-center relative shadow-[0_4px_20px_rgba(220,38,38,0.15)]">
            <div className="absolute inset-0 bg-red-300 rounded-full animate-ping opacity-30"></div>
            <span className="text-[44px] relative z-10">🚨</span>
          </div>
        </div>

        {/* 2. EMERGENCY ACTION BUTTONS */}
        <div className="flex flex-col gap-3 shrink-0">
          {/* Ambulance (112) */}
          <a
            href="tel:112"
            className="bg-white p-5 rounded-3xl shadow-[0_4px_15px_rgba(220,38,38,0.06)] border-[1.5px] border-red-100 flex items-center gap-4 hover:border-red-200 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-[#FFF6F5] text-red-600 rounded-full flex items-center justify-center shrink-0">
              <Ambulance size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-[16px] text-gray-900 leading-tight mb-0.5">
                {t?.callAmbulance || "Call Ambulance (112)"}
              </div>
              <div className="text-[13px] text-gray-500 font-medium">
                National toll-free emergency
              </div>
            </div>
          </a>

          {/* Call My Doctor */}
          <a
            href={doctorNumber ? `tel:${doctorNumber}` : "#"}
            onClick={(e) => {
              if (!doctorNumber) {
                e.preventDefault();
                alert(
                  "Please add a doctor's number in your Settings profile first.",
                );
              }
            }}
            className="bg-white p-5 rounded-3xl shadow-[0_4px_15px_rgba(220,38,38,0.04)] border-[1.5px] border-red-50 flex items-center gap-4 hover:border-red-100 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
              <Activity size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-[16px] text-gray-900 leading-tight mb-0.5">
                {t?.callDoctor || "Call My Doctor"}
              </div>
              <div
                className={`text-[13px] font-bold ${doctorNumber ? "text-red-500" : "text-gray-400 font-medium"}`}
              >
                {doctorNumber || "No doctor saved"}
              </div>
            </div>
          </a>

          {/* Call Emergency Contact */}
          <a
            href={emergencyNumber ? `tel:${emergencyNumber}` : "#"}
            onClick={(e) => {
              if (!emergencyNumber) {
                e.preventDefault();
                alert(
                  "Please add an emergency contact in your Settings profile first.",
                );
              }
            }}
            className="bg-white p-5 rounded-3xl shadow-[0_4px_15px_rgba(220,38,38,0.04)] border-[1.5px] border-red-50 flex items-center gap-4 hover:border-red-100 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-[16px] text-gray-900 leading-tight mb-0.5">
                {t?.callContact || "Call Emergency Contact"}
              </div>
              <div
                className={`text-[13px] font-bold ${emergencyNumber ? "text-red-500" : "text-gray-400 font-medium"}`}
              >
                {emergencyNumber || "No contact saved"}
              </div>
            </div>
          </a>
        </div>

        {/* 3. DANGER SIGNS LIST */}
        <div className="mt-8 mb-4 shrink-0">
          <h3 className="text-[12px] font-extrabold text-red-500 uppercase tracking-wider mb-3 pl-1">
            {t?.dangerSignsHeading || "Danger Signs — Seek Help Now"}
          </h3>

          <div className="bg-white rounded-3xl border-[1.5px] border-red-100 p-5 shadow-[0_4px_15px_rgba(220,38,38,0.04)]">
            <ul className="space-y-4">
              {dangerSignsList.map((sign, index) => (
                <li key={index} className="flex gap-3 items-start">
                  <AlertOctagon
                    className="text-red-400 shrink-0 mt-0.5"
                    size={18}
                    strokeWidth={2.5}
                  />
                  <span className="text-[14px] text-gray-800 font-bold leading-tight pt-0.5">
                    {sign}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
