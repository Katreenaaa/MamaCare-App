export default function LogoutPage({ onLoginClick }) {
  return (
    <div className="h-full bg-[#1B5E4B] flex flex-col items-center justify-center px-10">
      <div className="bg-white rounded-3xl px-6 py-8 text-center w-full shadow-xl flex flex-col items-center">
        {/* Waving Hand Emoji */}
        <div className="text-[40px] mb-3 leading-none">👋</div>

        {/* Heading */}
        <h2 className="text-[18px] font-extrabold text-gray-900 mb-2">
          You've been logged out
        </h2>

        {/* Subtext */}
        <p className="text-[11px] text-gray-500 mb-6 leading-relaxed px-1">
          Take care of yourself and your little one. See you soon!
        </p>

        {/* Action Button */}
        <button
          onClick={onLoginClick}
          className="w-full bg-[#1B5E4B] text-white font-extrabold text-[14px] py-3.5 rounded-xl hover:bg-[#154b3c] active:scale-[0.98] transition-all"
        >
          Sign Back In
        </button>
      </div>
    </div>
  );
}
