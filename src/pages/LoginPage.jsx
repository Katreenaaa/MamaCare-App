export default function LoginPage({ onLogin, onRegister }) {
  const savedUser = {
    name: "Amina Balogun",
    week: 22,
    phc: "PHC Surulere",
    lang: "en",
  };

  return (
    <div className="h-full bg-[#FDFAF5] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm">
        {" "}
        <div className="text-center">
          <div className="text-4xl mb-4">🌿</div>

          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>

          <p className="text-sm text-gray-500 mt-1 mb-8">
            Sign in to continue your journey
          </p>
        </div>
        <button
          onClick={() => onLogin(savedUser)}
          className="w-full bg-[#E8F5F0] border border-[#1B5E4B] rounded-2xl p-4 flex items-center gap-4 hover:bg-[#dff1ea] transition"
        >
          <div className="w-10 h-10 bg-[#1B5E4B] rounded-full flex items-center justify-center text-white font-bold">
            {savedUser.name[0]}
          </div>

          <div className="text-left">
            <p className="font-semibold text-gray-900">{savedUser.name}</p>

            <p className="text-sm text-gray-500">
              Continue as Amina · Week {savedUser.week}
            </p>
          </div>
        </button>
        <div className="text-center text-gray-400 my-5">— or —</div>
        <button
          onClick={onRegister}
          className="w-full border border-gray-200 rounded-2xl p-4 font-semibold hover:border-[#1B5E4B] transition"
        >
          Register New Account
        </button>
      </div>
    </div>
  );
}
