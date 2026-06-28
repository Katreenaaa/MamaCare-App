import { useState } from "react";
import {
  Globe,
  Bell,
  Building2,
  UserPen,
  LogOut,
  Mic,
  Volume2,
  Trash2,
  Plus,
  Phone,
  Activity,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

export default function SettingsPage({
  user,
  t,
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

  const voiceLangMap = {
    en: "en-NG",
    yo: "yo-NG",
    ha: "ha-NG",
    ig: "ig-NG",
    pc: "en-NG",
  };

  // State for Edit Profile View
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    week: user?.week || "",
    state: user?.state || "",
    lga: user?.lga || "",
    phc: user?.phc || "",
  });

  // State for Voice & Errors
  const [recordingField, setRecordingField] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // State for Emergency Features
  const [localEmergencyContacts, setLocalEmergencyContacts] = useState(
    () => user?.emergencyContacts || null,
  );
  const [newContact, setNewContact] = useState("");

  // State for Doctor's Contact (Input vs Saved)
  const [localSavedDoctorPhone, setLocalSavedDoctorPhone] = useState(
    () => user?.doctorPhone || null,
  );
  const [newDoctorPhone, setNewDoctorPhone] = useState("");

  const emergencyContacts =
    localEmergencyContacts ?? user?.emergencyContacts ?? [];
  const savedDoctorPhone = localSavedDoctorPhone ?? (user?.doctorPhone || "");

  // 🔊 Text-To-Speech
  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    const textToRead =
      t?.settingsAudio ||
      "Profile Settings. Here you can change your preferred language, manage your emergency contacts, and update your doctor's phone number.";
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = voiceLangMap[language] || "en-NG";
    window.speechSynthesis.speak(utterance);
  };

  // 🎤 Web Speech API (Speech-to-Text)
  const handleVoiceInput = (field, setter) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Sorry, your browser doesn't support voice recognition.");
      return;
    }

    if (recordingField) return;
    setErrorMessage("");

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = voiceLangMap[language] || "en-NG";

    recognition.onstart = () => {
      setRecordingField(field);
      setter("");
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setter(currentTranscript);
    };

    recognition.onerror = (event) => {
      setRecordingField(null);
      if (event.error === "not-allowed") {
        alert("Microphone access was denied.");
      }
    };

    recognition.onend = () => {
      setRecordingField(null);
    };

    recognition.start();
  };

  // 📱 Phone Validation Helper
  const validatePhone = (phone) => {
    const phoneClean = phone.replace(/\s+/g, "");
    const phoneRegex = /^(0\d{10}|\+234\d{10})$/;
    return phoneRegex.test(phoneClean) ? phoneClean : null;
  };

  // --- Emergency Contact Handlers ---
  const handleAddEmergencyContact = () => {
    setErrorMessage("");
    const validPhone = validatePhone(newContact);

    if (!validPhone) {
      setErrorMessage(
        "Invalid format. Use 11 digits (e.g. 08012345678) or +234 format.",
      );
      return;
    }

    if (emergencyContacts.includes(validPhone)) {
      setErrorMessage("This number is already in your emergency contacts.");
      return;
    }

    const updatedContacts = [...emergencyContacts, validPhone];
    setLocalEmergencyContacts(updatedContacts);
    setNewContact("");
    if (onUpdateUser)
      onUpdateUser({ ...user, emergencyContacts: updatedContacts });
  };

  const handleDeleteContact = (phoneToRemove) => {
    const updatedContacts = emergencyContacts.filter(
      (phone) => phone !== phoneToRemove,
    );
    setLocalEmergencyContacts(updatedContacts);
    if (onUpdateUser)
      onUpdateUser({ ...user, emergencyContacts: updatedContacts });
  };

  // --- Doctor Contact Handlers ---
  const handleSaveDoctor = () => {
    setErrorMessage("");
    const validPhone = validatePhone(newDoctorPhone);

    if (!validPhone) {
      setErrorMessage("Invalid doctor phone format. Use 11 digits or +234.");
      return;
    }

    setLocalSavedDoctorPhone(validPhone);
    setNewDoctorPhone("");
    if (onUpdateUser) onUpdateUser({ ...user, doctorPhone: validPhone });
  };

  const handleDeleteDoctor = () => {
    setLocalSavedDoctorPhone("");
    if (onUpdateUser) onUpdateUser({ ...user, doctorPhone: "" });
  };

  // --- Profile Edit Handlers ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({ ...user, ...editData });
    }
    setIsEditing(false);
  };

  const pregnancyMonth = Math.ceil((user?.week || 24) / 4);

  // ==========================================
  // VIEW: EDIT PROFILE FORM (Sub-page)
  // ==========================================
  if (isEditing) {
    return (
      <div className="h-full min-h-full flex-1 flex flex-col bg-[#fdfaf5] overflow-hidden">
        <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white flex items-center gap-3 shadow-sm z-20">
          <button
            onClick={() => setIsEditing(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <h2 className="text-[24px] font-extrabold tracking-tight">
            {t?.editProfile || "Edit Profile"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <form
            id="edit-form"
            onSubmit={handleSaveProfile}
            className="space-y-4"
          >
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                {t?.fullName || "Full Name"}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  placeholder={
                    recordingField === "name" ? "Listening..." : "e.g. Amina"
                  }
                  className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#1B5E4B] ${
                    recordingField === "name"
                      ? "bg-[#E8F5F0] border-[#1B5E4B]"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleVoiceInput("name", (val) =>
                      setEditData({ ...editData, name: val }),
                    )
                  }
                  className={`absolute right-4 p-1 rounded-full ${
                    recordingField === "name"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400"
                  }`}
                >
                  <Mic size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* How far along (Week) */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                {t?.weeksPregnant?.split("(")[0].trim() || "Weeks Pregnant"}
              </label>
              <div className="relative flex items-center">
                <input
                  type="number"
                  name="week"
                  value={editData.week}
                  onChange={(e) =>
                    setEditData({ ...editData, week: e.target.value })
                  }
                  placeholder={
                    recordingField === "week" ? "Listening..." : "e.g. 22"
                  }
                  className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#1B5E4B] ${
                    recordingField === "week"
                      ? "bg-[#E8F5F0] border-[#1B5E4B]"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleVoiceInput("week", (val) =>
                      setEditData({ ...editData, week: val }),
                    )
                  }
                  className={`absolute right-4 p-1 rounded-full ${
                    recordingField === "week"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400"
                  }`}
                >
                  <Mic size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                {t?.stateLocation || "State"}
              </label>
              <select
                name="state"
                value={editData.state}
                onChange={(e) =>
                  setEditData({ ...editData, state: e.target.value })
                }
                className="w-full bg-white border-[1.5px] border-gray-200 rounded-xl px-4 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#1B5E4B] appearance-none"
              >
                <option value="" disabled>
                  Select state...
                </option>
                <option value="Lagos">Lagos</option>
                <option value="Kano">Kano</option>
                <option value="Rivers">Rivers</option>
                <option value="FCT">Abuja (FCT)</option>
              </select>
            </div>

            {/* Primary Healthcare Center */}
            <div>
              <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wider">
                {t?.phc || "Primary Healthcare Center"}
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="phc"
                  value={editData.phc}
                  onChange={(e) =>
                    setEditData({ ...editData, phc: e.target.value })
                  }
                  placeholder={
                    recordingField === "phc"
                      ? "Listening..."
                      : "e.g. PHC Surulere"
                  }
                  className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#1B5E4B] ${
                    recordingField === "phc"
                      ? "bg-[#E8F5F0] border-[#1B5E4B]"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleVoiceInput("phc", (val) =>
                      setEditData({ ...editData, phc: val }),
                    )
                  }
                  className={`absolute right-4 p-1 rounded-full ${
                    recordingField === "phc"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400"
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
            {language === "ha"
              ? "Adana"
              : language === "yo"
                ? "Pa mọ́"
                : "Save Changes"}
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN PROFILE/SETTINGS PAGE
  // ==========================================
  return (
    <div className="h-full min-h-full flex-1 flex flex-col bg-[#fdfaf5] overflow-hidden relative">
      {/* 1. PREMIUM HEADER */}
      <div className="shrink-0 pt-14 pb-4 px-6 flex items-center justify-between z-20">
        <h2 className="text-[28px] font-extrabold text-[#1B5E4B] tracking-tight">
          {t?.settingsHeading || "Profile"}
        </h2>
        <button
          onClick={handleSpeak}
          className="bg-[#E8F5F0] text-[#1B5E4B] hover:bg-[#d1eae0] p-2.5 rounded-full cursor-pointer transition-colors"
        >
          <Volume2 size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-28 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {errorMessage && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-sm font-bold mb-4 animate-pulse">
            {errorMessage}
          </div>
        )}

        {/* 2. AVATAR & INFO SECTION */}
        <div className="flex flex-col items-center justify-center mb-8 pt-2">
          <div className="w-21 h-21 bg-[#E8F5F0] rounded-full border-4 border-white shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex items-center justify-center mb-4">
            <span className="text-[40px]">🤰</span>
          </div>
          <h3 className="text-[22px] font-extrabold text-gray-900 leading-tight">
            {user?.name || "Amina Balogun"}
          </h3>
          <p className="text-[14px] text-gray-500 font-medium mt-1">
            {language === "ha"
              ? "Ciki Wata"
              : language === "yo"
                ? "Oyún Oṣù"
                : "Pregnancy Month"}{" "}
            {pregnancyMonth} (
            {language === "ha" ? "Mako" : language === "yo" ? "Ọ̀sẹ̀" : "Week"}{" "}
            {user?.week || 22})
          </p>
        </div>

        {/* 3. PREFERRED LANGUAGE CARD */}
        <div className="bg-white rounded-3xl border-[1.5px] border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 mb-8 relative">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-[#1B5E4B]" size={20} strokeWidth={2.5} />
            <span className="font-extrabold text-[16px] text-gray-900">
              {t?.language || "Preferred Language"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-[14px] text-gray-400">
                NG
              </span>
              <span className="font-extrabold text-[16px] text-gray-900">
                {langNames[language] || "English"}
              </span>
            </div>
            <div className="bg-[#E8F5F0] text-[#1B5E4B] px-4 py-2 rounded-full font-extrabold text-[13px]">
              {language === "yo"
                ? "Yí padà"
                : language === "ha"
                  ? "Gyara"
                  : "Change"}
            </div>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="yo">Yorùbá</option>
            <option value="ha">Hausa</option>
            <option value="ig">Igbo</option>
            <option value="pc">Pidgin</option>
          </select>
        </div>

        {/* 4. PREFERENCES */}
        <div className="text-[12px] font-extrabold text-[#52766A] uppercase tracking-wider mb-3 pl-1 mt-4">
          {t?.preferences || "Preferences"}
        </div>
        <div className="space-y-3 mb-8">
          {/* Notifications Item */}
          <div className="bg-white rounded-[20px] border-[1.5px] border-gray-100 shadow-sm p-4 flex items-center justify-between cursor-pointer hover:border-orange-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 shrink-0 bg-[#FFF6E5] rounded-xl flex items-center justify-center">
                <Bell className="text-orange-500" size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-[15px] text-gray-900 leading-tight">
                  {t?.notifications || "Notifications"}
                </span>
                <span className="text-[13px] text-gray-500 mt-0.5">
                  {language === "yo"
                    ? "Gbà á"
                    : language === "ha"
                      ? "Kunna"
                      : "Enabled"}
                </span>
              </div>
            </div>
            <div className="text-gray-400">
              <ChevronRight size={20} strokeWidth={2.5} />
            </div>
          </div>

          {/* Healthcare Center Item */}
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
                  {t?.phc || "Healthcare Center"}
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

        {/* 5. EMERGENCY & MEDICAL SECTION */}
        <div className="text-[12px] font-extrabold text-[#52766A] uppercase tracking-wider mb-3 pl-1">
          {language === "yo"
            ? "Pàjáwìrì & Ìwòsàn"
            : language === "ha"
              ? "Gaggawa & Lafiya"
              : "Emergency & Medical"}
        </div>

        {/* Emergency Contacts Card */}
        <div className="bg-white rounded-3xl border-[1.5px] border-gray-100 shadow-sm p-5 mb-4 relative">
          <div className="flex items-center gap-3 mb-2">
            <Phone className="text-red-500" size={20} strokeWidth={2.5} />
            <span className="font-extrabold text-[16px] text-gray-900">
              {language === "yo"
                ? "Àwọn Alábojútó"
                : language === "ha"
                  ? "Lambobin Gaggawa"
                  : "Emergency Contacts"}
            </span>
          </div>
          <p className="text-[12px] text-gray-500 leading-relaxed mb-5 pr-2">
            {t?.emergencySub ||
              "These numbers will be alerted in case of critical danger signs."}
          </p>

          <div className="space-y-3 mb-4">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-gray-50 pb-3"
              >
                <div className="flex items-center gap-3 text-gray-700 font-bold text-[15px]">
                  <UserPen size={16} className="text-gray-400" />
                  {contact}
                </div>
                <button
                  onClick={() => handleDeleteContact(contact)}
                  className="text-red-400 hover:text-red-600 transition-colors bg-red-50 p-2 rounded-full"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <div className="relative flex-1">
              <input
                type="tel"
                value={newContact}
                onChange={(e) => setNewContact(e.target.value)}
                placeholder={
                  recordingField === "newContact"
                    ? "Listening..."
                    : "Add +234..."
                }
                className={`w-full bg-[#fdfaf5] border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
                  recordingField === "newContact"
                    ? "border-[#1B5E4B] bg-[#E8F5F0] font-semibold text-[#1B5E4B]"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => handleVoiceInput("newContact", setNewContact)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                  recordingField === "newContact"
                    ? "text-red-500 animate-pulse"
                    : "text-gray-400"
                }`}
              >
                <Mic size={18} strokeWidth={2.5} />
              </button>
            </div>
            <button
              onClick={handleAddEmergencyContact}
              className="bg-[#1B5E4B] text-white w-12.5 h-12.5 rounded-xl flex items-center justify-center shrink-0 hover:bg-[#154b3c] transition-colors shadow-sm"
            >
              <Plus size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Doctor's Contact Card */}
        <div className="bg-white rounded-3xl border-[1.5px] border-gray-100 shadow-sm p-5 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-[#1B5E4B]" size={20} strokeWidth={2.5} />
            <span className="font-extrabold text-[16px] text-gray-900">
              {language === "yo"
                ? "Nọ́mbà Dọ́kítà Rẹ"
                : language === "ha"
                  ? "Wayar Likitanki"
                  : "My Doctor's Contact"}
            </span>
          </div>
          <p className="text-[12px] text-gray-500 leading-relaxed mb-5">
            {language === "yo"
              ? "Fi nọ́mbà dọ́kítà rẹ pamọ́ fún ìpè pàjáwìrì."
              : language === "ha"
                ? "Sanya lambar likitanki don kiran gaggawa."
                : "Set your primary doctor's phone number for quick emergency dialing."}
          </p>

          {savedDoctorPhone ? (
            <div className="flex items-center justify-between bg-[#E8F5F0] border border-[#d1eae0] rounded-xl p-4">
              <div className="flex items-center gap-3 text-[#1B5E4B] font-bold text-[15px]">
                <Activity size={18} />
                {savedDoctorPhone}
              </div>
              <button
                onClick={handleDeleteDoctor}
                className="text-red-500 hover:text-red-700 transition-colors bg-white p-2 rounded-full shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <div className="relative flex-1">
                <input
                  type="tel"
                  value={newDoctorPhone}
                  onChange={(e) => setNewDoctorPhone(e.target.value)}
                  placeholder={
                    recordingField === "newDoctorPhone"
                      ? "Listening..."
                      : "Add +234..."
                  }
                  className={`w-full bg-[#fdfaf5] border border-gray-200 rounded-xl pl-4 pr-10 py-3.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
                    recordingField === "newDoctorPhone"
                      ? "border-[#1B5E4B] bg-[#E8F5F0] font-semibold text-[#1B5E4B]"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() =>
                    handleVoiceInput("newDoctorPhone", setNewDoctorPhone)
                  }
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
                    recordingField === "newDoctorPhone"
                      ? "text-red-500 animate-pulse"
                      : "text-gray-400"
                  }`}
                >
                  <Mic size={18} strokeWidth={2.5} />
                </button>
              </div>
              <button
                onClick={handleSaveDoctor}
                className="bg-[#1B5E4B] text-white px-4 h-12.5 rounded-xl font-bold text-[14px] hover:bg-[#154b3c] transition-colors shadow-sm"
              >
                {language === "ha"
                  ? "Adana"
                  : language === "yo"
                    ? "Fipamọ́"
                    : "Save"}
              </button>
            </div>
          )}
        </div>

        {/* 6. ACCOUNT SECTION */}
        <div className="text-[12px] font-extrabold text-[#52766A] uppercase tracking-wider mb-3 pl-1">
          {t?.account || "Account"}
        </div>
        <div className="space-y-3 mb-8">
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
                {t?.editProfile || "Edit Profile"}
              </span>
            </div>
            <div className="text-gray-400">
              <ChevronRight size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* 7. LOGOUT */}
        <button
          onClick={onLogout}
          className="w-full bg-[#FFF6F5] text-[#E8614A] border-[1.5px] border-[#FDEBE8] font-extrabold py-4 rounded-[20px] flex items-center justify-center gap-2 transition-colors hover:border-[#E8614A] hover:bg-[#FDEBE8]"
        >
          <LogOut size={20} strokeWidth={2.5} /> {t?.logout || "Log Out"}
        </button>
      </div>
    </div>
  );
}
