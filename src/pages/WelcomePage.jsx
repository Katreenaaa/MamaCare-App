import { Volume2 } from "lucide-react";

export default function WelcomePage({ onContinue }) {
  // Native Text-to-Speech Function
  const speakAloud = () => {
    // Stop any current speech
    window.speechSynthesis.cancel();

    // Create the audio
    const textToRead =
      "Welcome to SheGuard. Maternal care you can hear, speak, and understand, in your own language.";
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Play it
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-linear-to-br from-[#1B5E4B] to-[#3D9B7A] items-center justify-center">
      {/* ACCESSIBILITY BUTTON - Read Aloud */}
      <button
        onClick={speakAloud}
        className="absolute top-12 right-6 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-full cursor-pointer transition-colors z-30 flex items-center gap-2 backdrop-blur-sm"
      >
        <Volume2 size={18} strokeWidth={2.5} />
        <span className="text-xs font-bold tracking-wide ">Listen</span>
      </button>

      <div className="flex flex-col items-center justify-center z-10 pb-24 relative">
        <div className="flex items-center justify-center w-70 h-70 overflow-hidden">
          <img
            src="/sheguard.png"
            alt="SheGuard Logo"
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
        <h1 className="-mt-12 text-4xl font-extrabold text-white mb-3 tracking-tight">
          SheGuard
        </h1>
        <p className="text-white/90 text-center max-w-65 text-sm leading-relaxed">
          Maternal care you can hear, speak, and understand, in your own
          language.
        </p>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-35 bg-[#fdfaf5] z-0"
        style={{ clipPath: "ellipse(65% 80% at 50% 100%)" }}
      ></div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20">
        <button
          onClick={onContinue}
          className="bg-white text-[#1B5E4B] font-extrabold py-3.5 px-8 text-sm rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] active:scale-95 transition-transform cursor-pointer"
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
