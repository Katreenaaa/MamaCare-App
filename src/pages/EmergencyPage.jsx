import { ArrowLeft, Ambulance, Building2, Users } from "lucide-react";

export default function EmergencyPage({ t, user, onBack }) {
  return (
    <div className="h-full bg-red-50 flex flex-col overflow-hidden">
      <div className="shrink-0 bg-[#DC2626] pt-14 pb-8 px-6 text-white flex items-center gap-3 z-10 shadow-sm">
        <button
          onClick={onBack}
          className="p-1 hover:bg-white/20 rounded-full transition-colors mr-1 cursor-pointer"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
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

      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-28 flex flex-col gap-4 scrollbar-none">
        <div className="flex justify-center mb-8 shrink-0">
          <div className="w-28 h-28 bg-red-100 rounded-full flex items-center justify-center relative shadow-lg">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-40"></div>

            <span className="text-5xl relative z-10">🚨</span>
          </div>
        </div>

        {/* 112 National Emergency */}
        <a
          href="tel:112"
          className="bg-white p-5 rounded-[20px] shadow-[0_4px_12px_rgba(220,38,38,0.05)] border-2 border-red-100 flex items-center gap-4 active:scale-95 transition-transform shrink-0 cursor-pointer"
        >
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
            <Ambulance size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[16px] text-gray-900 leading-tight">
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
          className="bg-white p-5 rounded-[20px] shadow-[0_4px_12px_rgba(27,94,75,0.05)] border-2 border-[#E8F5F0] flex items-center gap-4 active:scale-95 transition-transform shrink-0 cursor-pointer"
        >
          <div className="w-12 h-12 bg-[#E8F5F0] text-[#1B5E4B] rounded-full flex items-center justify-center shrink-0">
            <Building2 size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[16px] text-gray-900 leading-tight">
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
          className="bg-white p-5 rounded-[20px] shadow-sm border-2 border-gray-100 flex items-center gap-4 active:scale-95 transition-transform shrink-0 cursor-pointer"
        >
          <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center shrink-0">
            <Users size={24} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[16px] text-gray-900 leading-tight">
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
