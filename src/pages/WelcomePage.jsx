export default function WelcomePage({ onContinue }) {
  return (
    <div className="h-full w-full relative overflow-hidden bg-linear-to-br from-[#1B5E4B] to-[#3D9B7A] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center z-10 pb-24 relative">
        <div className="text-5xl bg-white/10 p-5 rounded-3xl mb-5 border-2 border-white/20 shadow-sm flex items-center justify-center w-24 h-24">
          🌿
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
          MamaCare
        </h1>
        <p className="text-white/90 text-center max-w-65 text-sm leading-relaxed">
          Your trusted companion through every step of your pregnancy journey
        </p>
      </div>

      {/* Bottom Cream Wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-35 bg-[#FDFAF5] z-0"
        style={{ clipPath: "ellipse(65% 80% at 50% 100%)" }}
      ></div>

      {/* Action Button */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20">
        <button
          onClick={onContinue}
          className="bg-white text-[#1B5E4B] font-bold py-3.5 px-8 text-sm rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.12)] active:scale-95 transition-transform cursor-pointer"
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}
