import { useState } from "react";
import { Volume2, ArrowLeft, Mic } from "lucide-react";

export default function RegisterPage({ onComplete, t, language, onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    lmp: "",
    week: "",
    state: "",
    lga: "",
    phc: "",
    doctorPhone: "", // NEW FIELD
  });

  const [recordingField, setRecordingField] = useState(null);

  // Validation states
  const [errorMessage, setErrorMessage] = useState("");
  const [phcWarning, setPhcWarning] = useState(false);

  // Map our language codes to browser TTS language codes
  const voiceLangMap = {
    en: "en-NG",
    yo: "yo-NG",
    ha: "ha-NG",
    ig: "ig-NG",
    pc: "en-NG",
  };

  // Text-To-Speech (Reads instructions to the user)
  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    const textToRead =
      t?.registerAudio ||
      "Please enter your details like your name, weeks pregnant, location, and your primary doctor's phone number so we can personalize your journey.";
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = voiceLangMap[language] || "en-NG";
    window.speechSynthesis.speak(utterance);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrorMessage("");
    setPhcWarning(false);
  };

  // 🎤 Real Web Speech API implementation (Speech-to-Text)
  const handleVoiceInput = (field) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Sorry, your browser doesn't support voice recognition. Please type instead.",
      );
      return;
    }

    if (recordingField) return;

    setErrorMessage("");
    setPhcWarning(false);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = voiceLangMap[language] || "en-NG";

    recognition.onstart = () => {
      setRecordingField(field);
      setFormData((prev) => ({ ...prev, [field]: "" }));
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setFormData((prev) => ({ ...prev, [field]: currentTranscript }));
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setRecordingField(null);
      if (event.error === "not-allowed") {
        alert(
          "Microphone access was denied. Please allow microphone permissions in your browser.",
        );
      }
    };

    recognition.onend = () => {
      setRecordingField(null);
    };

    recognition.start();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    let submissionData = { ...formData };

    // 1. Phone Number Validation (Strips spaces from voice inputs and validates format)
    if (submissionData.doctorPhone) {
      const phoneClean = submissionData.doctorPhone.replace(/\s+/g, ""); // Removes accidental spaces
      // Regex matches either 11 digits starting with 0, OR +234 followed by 10 digits
      const phoneRegex = /^(0\d{10}|\+234\d{10})$/;

      if (!phoneRegex.test(phoneClean)) {
        setErrorMessage(
          "Please enter a complete 11-digit phone number (e.g. 08012345678) or use the +234 format.",
        );
        return;
      }

      // Update the formData with the cleaned number so it saves properly
      submissionData = { ...submissionData, doctorPhone: phoneClean };
      setFormData(submissionData);
    }

    // 2. Hard Validation: Check if core details are missing
    if (
      !submissionData.name ||
      !submissionData.lmp ||
      !submissionData.week ||
      !submissionData.state ||
      !submissionData.lga
    ) {
      setErrorMessage(
        "Please fill in all your details so we can personalize your journey.",
      );
      return;
    }

    // 3. Soft Validation: Check if PHC is missing
    if (!formData.phc && !phcWarning) {
      setPhcWarning(true);
      return;
    }

    // 4. Complete Registration
    onComplete({ ...formData, week: parseInt(formData.week) || 0 });
  };

  return (
    <div className="h-full min-h-full flex-1 bg-[#fdfaf5] flex flex-col relative z-10 overflow-hidden">
      {/* 1. FIXED HEADER */}
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white flex items-center justify-between z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <h2 className="text-[24px] font-extrabold tracking-tight leading-tight">
              {t?.createAccount || "Create Profile"}
            </h2>
            <p className="text-[12px] text-white/80 mt-0.5">
              Personalize your care journey
            </p>
          </div>
        </div>

        {/* Listen Button */}
        <button
          onClick={handleSpeak}
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-full cursor-pointer transition-colors flex items-center gap-2 backdrop-blur-sm"
        >
          <Volume2 size={16} strokeWidth={2.5} />
        </button>
      </div>

      {/* 2. SCROLLABLE FORM AREA */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Error Notification */}
        {errorMessage && (
          <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-xl text-sm font-bold mb-4 animate-pulse">
            {errorMessage}
          </div>
        )}

        {/* PHC Soft Warning Notification */}
        {phcWarning && !errorMessage && (
          <div className="bg-[#FFF6E5] text-[#B88012] border border-[#FDEBCE] p-3 rounded-xl text-sm font-bold mb-4 flex items-start gap-2">
            <span className="text-lg leading-none">⚠️</span>
            <span>
              You haven't added a Primary Healthcare Center. You can add one
              later. Click Complete again to skip.
            </span>
          </div>
        )}

        <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wide">
              {t?.fullName || "Full Name"}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={
                  recordingField === "name"
                    ? "Listening..."
                    : t?.namePlaceholder || "e.g. Amina Balogun"
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

          {/* Last Menstrual Period */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wide">
              Last Menstrual Period (LMP)
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                name="lmp"
                value={formData.lmp}
                onChange={handleChange}
                className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl px-4 py-3.5 text-[14px] focus:outline-none focus:border-[#1B5E4B] transition-colors ${
                  formData.lmp ? "text-gray-900" : "text-gray-400"
                }`}
              />
            </div>
          </div>

          {/* How far along (Week) */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wide">
              {t?.weeksPregnant || "How far along are you? (Weeks)"}
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                name="week"
                min="1"
                max="42"
                value={formData.week}
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
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wide">
              {t?.stateLocation || "State"}
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl px-4 py-3.5 text-[14px] focus:outline-none focus:border-[#1B5E4B] transition-colors appearance-none ${
                formData.state ? "text-gray-900" : "text-gray-400"
              }`}
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

          {/* LGA */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wide">
              Local Government Area (LGA)
            </label>
            <select
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl px-4 py-3.5 text-[14px] focus:outline-none focus:border-[#1B5E4B] transition-colors appearance-none ${
                formData.lga ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <option value="" disabled>
                Select LGA...
              </option>
              <option value="surulere">Surulere</option>
              <option value="ikeja">Ikeja</option>
              <option value="yaba">Yaba</option>
            </select>
          </div>

          {/* Primary Healthcare Center */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wide">
              Primary Healthcare Center
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="phc"
                value={formData.phc}
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

          {/* Doctor's Phone Number */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5 uppercase tracking-wide">
              Doctor's Phone Number{" "}
              <span className="text-gray-400 normal-case font-normal">
                (Optional)
              </span>
            </label>
            <div className="relative flex items-center">
              <input
                type="tel"
                name="doctorPhone"
                value={formData.doctorPhone}
                onChange={handleChange}
                placeholder={
                  recordingField === "doctorPhone"
                    ? "Listening..."
                    : "e.g. 08012345678"
                }
                className={`w-full bg-white border-[1.5px] border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
                  recordingField === "doctorPhone"
                    ? "text-[#1B5E4B] font-semibold bg-[#E8F5F0] border-[#1B5E4B]"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => handleVoiceInput("doctorPhone")}
                className={`absolute right-4 p-1 rounded-full transition-colors ${
                  recordingField === "doctorPhone"
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

      {/* 3. ACTION BUTTON */}
      <div className="shrink-0 px-6 pb-10 pt-4 bg-[#fdfaf5] shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20">
        <button
          form="register-form"
          type="submit"
          className="w-full font-extrabold py-4 rounded-2xl text-[15px] bg-[#1B5E4B] text-white shadow-[0_4px_12px_rgba(27,94,75,0.15)] hover:bg-[#154b3c] active:scale-95 transition-all cursor-pointer"
        >
          {phcWarning
            ? "Skip & Complete Registration ➔"
            : t?.startJourney || "Complete Registration ➔"}
        </button>
      </div>
    </div>
  );
}
