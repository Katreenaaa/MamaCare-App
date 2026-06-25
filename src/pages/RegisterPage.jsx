import { useState } from "react";

export default function RegisterPage({ onComplete }) {
  const [formData, setFormData] = useState({
    name: "",
    lmp: "",
    week: "",
    state: "",
    lga: "",
    phc: "",
  });

  const [recordingField, setRecordingField] = useState(null);

  // Validation states
  const [errorMessage, setErrorMessage] = useState("");
  const [phcWarning, setPhcWarning] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear warnings and errors when the user starts typing again
    setErrorMessage("");
    setPhcWarning(false);
  };

  // Real Web Speech API implementation
  const handleVoiceInput = (field) => {
    // Check if the browser supports Speech Recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Sorry, your browser doesn't support voice recognition. Please type instead.",
      );
      return;
    }

    if (recordingField) return;

    // Clear warnings when using voice input
    setErrorMessage("");
    setPhcWarning(false);

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-NG";

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

    // 1. Hard Validation: Check if core details are missing
    if (
      !formData.name ||
      !formData.lmp ||
      !formData.week ||
      !formData.state ||
      !formData.lga
    ) {
      setErrorMessage(
        "Please fill in all your details so we can personalize your journey.",
      );
      return;
    }

    // 2. Soft Validation: Check if PHC is missing
    if (!formData.phc && !phcWarning) {
      setPhcWarning(true);
      return;
    }

    // 3. Complete Registration
    onComplete({ ...formData, week: parseInt(formData.week) || 0 });
  };

  return (
    <div className="h-full bg-[#FDFAF5] flex flex-col">
      {/* Header */}
      <div className="shrink-0 bg-[#1B5E4B] pt-14 pb-8 px-6 text-white">
        <h2 className="text-[26px] font-extrabold tracking-tight mb-1.5 leading-tight">
          Create Your Profile
        </h2>
        <p className="text-[13px] text-white/90 leading-snug">
          Help us personalize your care journey
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5">
              Full Name
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
                    : "e.g. Amina Ibrahim"
                }
                className={`w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
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
                    : "text-gray-500 hover:text-[#1B5E4B]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.39-.9.88v.2c0 2.82-2.34 5.12-5.01 5.12-2.67 0-5.01-2.3-5.01-5.12v-.2c0-.49-.41-.88-.9-.88s-.9.39-.9.88v.2c0 3.35 2.62 6.13 5.91 6.64v2.58h-2.5c-.5 0-.9.4-.9.9s.4.9.9.9h6.82c.5 0 .9-.4.9-.9s-.4-.9-.9-.9h-2.5v-2.58c3.29-.51 5.91-3.29 5.91-6.64v-.2c0-.49-.41-.88-.9-.88z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Last Menstrual Period */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5">
              Last Menstrual Period (LMP)
            </label>
            <div className="relative flex items-center">
              <input
                type="date"
                name="lmp"
                value={formData.lmp}
                onChange={handleChange}
                className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] focus:outline-none focus:border-[#1B5E4B] transition-colors ${
                  formData.lmp ? "text-gray-900" : "text-gray-400"
                }`}
              />
            </div>
          </div>

          {/* How far along (Week) */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5">
              How far along are you? (Weeks)
            </label>
            <div className="relative flex items-center">
              <input
                type="number"
                name="week"
                value={formData.week}
                onChange={handleChange}
                placeholder={
                  recordingField === "week" ? "Listening..." : "e.g. 22"
                }
                className={`w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
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
                    : "text-gray-500 hover:text-[#1B5E4B]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.39-.9.88v.2c0 2.82-2.34 5.12-5.01 5.12-2.67 0-5.01-2.3-5.01-5.12v-.2c0-.49-.41-.88-.9-.88s-.9.39-.9.88v.2c0 3.35 2.62 6.13 5.91 6.64v2.58h-2.5c-.5 0-.9.4-.9.9s.4.9.9.9h6.82c.5 0 .9-.4.9-.9s-.4-.9-.9-.9h-2.5v-2.58c3.29-.51 5.91-3.29 5.91-6.64v-.2c0-.49-.41-.88-.9-.88z" />
                </svg>
              </button>
            </div>
          </div>

          {/* State */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5">
              State
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] focus:outline-none focus:border-[#1B5E4B] transition-colors appearance-none ${
                formData.state ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <option value="" disabled>
                Select state...
              </option>
              <option value="lagos">Lagos</option>
              <option value="kano">Kano</option>
              <option value="rivers">Rivers</option>
            </select>
          </div>

          {/* LGA */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5">
              Local Government Area (LGA)
            </label>
            <select
              name="lga"
              value={formData.lga}
              onChange={handleChange}
              className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] focus:outline-none focus:border-[#1B5E4B] transition-colors appearance-none ${
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
            <label className="block text-[11px] font-extrabold text-[#1B5E4B] mb-1.5">
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
                className={`w-full bg-white border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B5E4B] transition-colors ${
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
                    : "text-gray-500 hover:text-[#1B5E4B]"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.39-.9.88v.2c0 2.82-2.34 5.12-5.01 5.12-2.67 0-5.01-2.3-5.01-5.12v-.2c0-.49-.41-.88-.9-.88s-.9.39-.9.88v.2c0 3.35 2.62 6.13 5.91 6.64v2.58h-2.5c-.5 0-.9.4-.9.9s.4.9.9.9h6.82c.5 0 .9-.4.9-.9s-.4-.9-.9-.9h-2.5v-2.58c3.29-.51 5.91-3.29 5.91-6.64v-.2c0-.49-.41-.88-.9-.88z" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Action Button */}
      <div className="shrink-0 px-6 pb-10 pt-4 bg-[#FDFAF5]">
        <button
          form="register-form"
          type="submit"
          className="w-full font-bold py-4 rounded-2xl text-[15px] bg-[#1B5E4B] text-white shadow-[0_4px_12px_rgba(27,94,75,0.2)] hover:bg-[#154b3c] transition-colors"
        >
          {phcWarning
            ? "Skip & Complete Registration ➔"
            : "Complete Registration ➔"}
        </button>
      </div>
    </div>
  );
}
