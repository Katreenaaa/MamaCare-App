import { useState } from "react";
import { useSpeech } from "../hooks/useSpeech";
import {
  Globe,
  Bell,
  Building2,
  UserPen,
  LogOut,
  Mic,
  // eslint-disable-next-line no-unused-vars
  Square,
  // eslint-disable-next-line no-unused-vars
  X,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage({
  user,
  language,
  setLanguage,
  onLogout,
  onUpdateUser,
}) {
  const langNames = {
    en: "English",
    yo: "Yorùbá",
    ha: "Hausa",
    ig: "Igbo",
    pc: "Pidgin",
  };

  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: user?.name || "",
    week: user?.week || "",
    state: user?.state || "",
    lga: user?.lga || "",
    phc: user?.phc || "",
  });

  const [recordingField, setRecordingField] = useState(null);
  const { startRecording, stopRecording, isRecording } = useSpeech("en-NG");

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleVoiceInput = (field) => {
    if (isRecording && recordingField === field) {
      stopRecording();
      setRecordingField(null);
      return;
    }

    if (isRecording) stopRecording();

    setRecordingField(field);
    setEditData((prev) => ({ ...prev, [field]: "" }));

    startRecording(
      (res) => {
        setEditData((prev) => ({
          ...prev,
          [field]: res.finalTranscript + res.interimTranscript,
        }));
      },
      () => {
        setRecordingField(null);
      },
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ ...user, ...editData });
    }
    setIsEditing(false);
  };

  // ==========================================
  // VIEW: EDIT PROFILE FORM
  // ==========================================
  if (isEditing) {
    return (
      <div className="h-full min-h-full flex-1 flex flex-col bg-[#fdfaf5] overflow-hidden">
        {/* 1. FIXED HEADER */}
        <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white flex items-center gap-3 shadow-sm z-20">
          <button
            onClick={() => {
              if (isRecording) stopRecording();
              setIsEditing(false);
            }}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6 text-white"
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
          <h2 className="text-[24px] font-extrabold tracking-tight">
            Edit Profile
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <form id="edit-form" onSubmit={handleSave} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  placeholder={
                    recordingField === "name"
                      ? "Listening..."
                      : "e.g. Amina Ibrahim"
                  }
                  className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
                    recordingField === "name"
                      ? "text-[#1B5E4B] font-semibold bg-[#E8F5F0] border-[#1B5E4B]"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput("name")}
                  className={`absolute right-4 p-1 rounded-full transition-colors ${
                    recordingField === "name"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400 hover:text-[#1B5E4B]"
                  }`}
                >
                  <Mic size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* How far along (Week) */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                How far along (Weeks)
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  name="week"
                  value={editData.week}
                  onChange={handleChange}
                  placeholder={
                    recordingField === "week" ? "Listening..." : "e.g. 22"
                  }
                  className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
                    recordingField === "week"
                      ? "text-[#1B5E4B] font-semibold bg-[#E8F5F0] border-[#1B5E4B]"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput("week")}
                  className={`absolute right-4 p-1 rounded-full transition-colors ${
                    recordingField === "week"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400 hover:text-[#1B5E4B]"
                  }`}
                >
                  <Mic size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                State
              </label>
              <select
                name="state"
                value={editData.state}
                onChange={handleChange}
                className="w-full bg-white border-[1.5px] border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#1B5E4B] transition-colors appearance-none"
              >
                <option value="" disabled>
                  Select state...
                </option>
                <option value="Lagos">Lagos</option>
                <option value="Kano">Kano</option>
                <option value="Rivers">Rivers</option>
              </select>
            </div>

            {/* LGA */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                Local Government Area
              </label>
              <select
                name="lga"
                value={editData.lga}
                onChange={handleChange}
                className="w-full bg-white border-[1.5px] border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#1B5E4B] transition-colors appearance-none"
              >
                <option value="" disabled>
                  Select LGA...
                </option>
                <option value="Surulere">Surulere</option>
                <option value="Ikeja">Ikeja</option>
                <option value="Yaba">Yaba</option>
              </select>
            </div>

            {/* Primary Healthcare Center */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                Primary Healthcare Center
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="phc"
                  value={editData.phc}
                  onChange={handleChange}
                  placeholder={
                    recordingField === "phc"
                      ? "Listening..."
                      : "e.g. PHC Surulere"
                  }
                  className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
                    recordingField === "phc"
                      ? "text-[#1B5E4B] font-semibold bg-[#E8F5F0] border-[#1B5E4B]"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput("phc")}
                  className={`absolute right-4 p-1 rounded-full transition-colors ${
                    recordingField === "phc"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400 hover:text-[#1B5E4B]"
                  }`}
                >
                  <Mic size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="shrink-0 px-6 pt-4 pb-28 bg-[#fdfaf5] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20">
          <button
            form="edit-form"
            type="submit"
            className="w-full font-extrabold py-4 rounded-2xl text-[15px] bg-[#1B5E4B] text-white shadow-[0_4px_12px_rgba(27,94,75,0.2)] hover:bg-[#154b3c] active:scale-95 transition-all cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN SETTINGS PAGE
  // ==========================================
  return (
    <div className="h-full min-h-full flex-1 flex flex-col bg-[#fdfaf5] overflow-hidden relative">
      {/* 1. FIXED HEADER */}
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white shadow-sm z-20">
        <h2 className="text-[26px] font-extrabold tracking-tight">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-28 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* User Info Card */}
        <div className="bg-white p-4 rounded-[20px] border-[1.5px] border-gray-100 shadow-sm flex items-center gap-4 mb-8">
          <div className="w-12 h-12 shrink-0 bg-[#1B5E4B] rounded-full flex items-center justify-center text-white text-[20px] font-extrabold">
            {user?.name?.[0] || "A"}
          </div>
          <div className="flex flex-col">
            <div className="font-extrabold text-[16px] text-gray-900 leading-tight">
              {user?.name || "Adebola Sola"}
            </div>
            <div className="text-[12px] text-gray-500 mt-0.5">
              Week {user?.week || "5"} · {user?.state || "Lagos"}
            </div>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="text-[12px] font-extrabold text-[#52766A] uppercase tracking-wider mb-3 pl-1">
          Preferences
        </div>
        <div className="space-y-3 mb-8">
          {/* Language Item */}
          <div className="bg-white rounded-[20px] border-[1.5px] border-gray-100 shadow-sm p-4 flex items-center justify-between cursor-pointer relative hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 bg-[#EBF4FF] rounded-xl flex items-center justify-center">
                <Globe className="text-blue-500" size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[15px] text-gray-900 leading-tight">
                  Language
                </span>
                <span className="text-[13px] text-gray-500 mt-0.5">
                  {langNames[language] || "English"}
                </span>
              </div>
            </div>
            <div className="text-gray-400">
              <ChevronRight size={20} strokeWidth={2.5} />
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            >
              <option value="en">English</option>
              <option value="yo">Yorùbá</option>
              <option value="ha">Hausa</option>
              <option value="ig">Igbo</option>
              <option value="pc">Pidgin</option>
            </select>
          </div>

          {/* Notifications Item */}
          <div className="bg-white rounded-[20px] border-[1.5px] border-gray-100 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-orange-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 bg-[#FFF6E5] rounded-xl flex items-center justify-center">
                <Bell className="text-orange-500" size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[15px] text-gray-900 leading-tight">
                  Notifications
                </span>
                <span className="text-[13px] text-gray-500 mt-0.5">
                  Enabled
                </span>
              </div>
            </div>
            <div className="text-gray-400">
              <ChevronRight size={20} strokeWidth={2.5} />
            </div>
          </div>

          {/* Primary Healthcare Center Item */}
          <div className="bg-white rounded-[20px] border-[1.5px] border-gray-100 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-purple-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 bg-[#F3EEFA] rounded-xl flex items-center justify-center">
                <Building2
                  className="text-purple-500"
                  size={20}
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[15px] text-gray-900 leading-tight">
                  Healthcare Center
                </span>
                <span className="text-[13px] text-gray-500 mt-0.5">
                  {user?.phc || "Not set"}
                </span>
              </div>
            </div>
            <div className="text-gray-400">
              <ChevronRight size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="text-[12px] font-extrabold text-[#52766A] uppercase tracking-wider mb-3 pl-1">
          Account
        </div>
        <div className="space-y-3 mb-8">
          {/* Edit Profile Item */}
          <div
            onClick={() => setIsEditing(true)}
            className="bg-white rounded-[20px] border-[1.5px] border-gray-100 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 bg-[#F3F4F6] rounded-xl flex items-center justify-center">
                <UserPen
                  className="text-gray-600"
                  size={20}
                  strokeWidth={2.5}
                />
              </div>
              <span className="font-extrabold text-[15px] text-gray-900">
                Edit Profile
              </span>
            </div>
            <div className="text-gray-400">
              <ChevronRight size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full bg-[#FFF6F5] text-[#E8614A] border-[1.5px] border-[#FDEBE8] font-extrabold py-4 rounded-[20px] flex items-center justify-center gap-2 transition-colors hover:border-[#E8614A] hover:bg-[#FDEBE8] cursor-pointer"
        >
          <LogOut size={20} strokeWidth={2.5} /> Log Out
        </button>
      </div>
    </div>
  );
}
