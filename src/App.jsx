import { useState } from "react";
import { TRANSLATIONS } from "./data";
import BottomNav from "./components/BottomNav";
import { usePersistentState } from "./hooks/usePersistentState";

// Auth Flow Pages
import WelcomePage from "./pages/WelcomePage";
import LanguagePage from "./pages/LanguagePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LogoutPage from "./pages/LogoutPage";
import EmergencyPage from "./pages/EmergencyPage"; // Fixed import name if necessary

// Main Pages
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import ClinicPage from "./pages/ClinicPage";
import ReminderPage from "./pages/ReminderPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("welcome");
  const [user, setUser] = usePersistentState("mamaCare_user", {
    name: "",
    week: 22,
    lang: "en",
  });

  const [language, setLanguage] = useState(() => user?.lang || "en");

  const t = TRANSLATIONS[language];

  const handleLogin = (userData) => {
    const updatedUser = { ...userData, lang: userData.lang || language };
    setUser(updatedUser);
    setActiveScreen("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
    setActiveScreen("logout");
  };

  const isAuthPage = [
    "welcome",
    "language",
    "login",
    "register",
    "logout",
  ].includes(activeScreen);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center font-sans">
      <div className="w-full h-dvh md:w-97.5 md:h-200 bg-[#FDFAF5] md:rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col md:border-8 md:border-gray-900 mx-auto">
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* === AUTH FLOW === */}
          {activeScreen === "welcome" && (
            <WelcomePage onContinue={() => setActiveScreen("language")} />
          )}
          {activeScreen === "language" && (
            <LanguagePage
              language={language}
              setLanguage={setLanguage}
              onContinue={() => setActiveScreen("login")}
            />
          )}
          {activeScreen === "login" && (
            <LoginPage
              onLogin={handleLogin}
              onRegister={() => setActiveScreen("register")}
            />
          )}
          {activeScreen === "register" && (
            <RegisterPage onComplete={handleLogin} />
          )}
          {activeScreen === "logout" && (
            <LogoutPage onLoginClick={() => setActiveScreen("login")} />
          )}

          {/* === MAIN APP FLOW === */}
          {activeScreen === "dashboard" && (
            <Dashboard user={user} t={t} navTo={setActiveScreen} />
          )}
          {activeScreen === "chat" && (
            <ChatPage
              user={user}
              t={t}
              onBack={() => setActiveScreen("dashboard")}
            />
          )}
          {activeScreen === "clinic" && (
            <ClinicPage t={t} onBack={() => setActiveScreen("dashboard")} />
          )}
          {activeScreen === "reminder" && (
            <ReminderPage
              t={t}
              lang={language}
              onBack={() => setActiveScreen("dashboard")}
            />
          )}
          {activeScreen === "settings" && (
            <SettingsPage
              user={user}
              language={language}
              setLanguage={(l) => {
                setLanguage(l);
                setUser({ ...user, lang: l });
              }}
              onLogout={handleLogout}
              onBack={() => setActiveScreen("dashboard")}
            />
          )}
          {activeScreen === "emergency" && (
            <EmergencyPage
              t={t}
              user={user}
              onBack={() => setActiveScreen("dashboard")}
            />
          )}
        </div>

        {/* BOTTOM NAV */}
        {!isAuthPage && (
          <BottomNav
            activeScreen={activeScreen}
            setActiveScreen={setActiveScreen}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
