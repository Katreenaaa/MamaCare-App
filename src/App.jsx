import { useState } from "react";
import { TRANSLATIONS } from "./data";
import BottomNav from "./components/BottomNav";
import { usePersistentState } from "./hooks/usePersistentState";

// Auth Flow Pages
import WelcomePage from "./pages/WelcomePage";
import LanguagePage from "./pages/LanguagePage";
import RegisterPage from "./pages/RegisterPage";
import EmergencyPage from "./pages/EmergencyPage";
import LoginPage from "./pages/LoginPage";

// Main Pages
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/ChatPage";
import ClinicPage from "./pages/ClinicPage";
import ReminderPage from "./pages/ReminderPage";
import SettingsPage from "./pages/SettingsPage";
import PregnancyGuide from "./pages/PregnancyGuide";

export default function App() {
  const [activeScreen, setActiveScreen] = useState("welcome");
  const [user, setUser] = usePersistentState("SheGuard_user", {
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
    setActiveScreen("welcome");
  };

  const isAuthPage = [
    "welcome",
    "language",
    "login",
    "register",
    "logout",
  ].includes(activeScreen);

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center font-sans overflow-hidden">
      <div className="w-full sm:max-w-105 flex flex-col bg-[#fdfaf5] relative shadow-2xl overflow-hidden sm:border-x border-gray-300">
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* === AUTH FLOW === */}
          {activeScreen === "welcome" && (
            <WelcomePage onContinue={() => setActiveScreen("language")} />
          )}

          {activeScreen === "language" && (
            <LanguagePage
              language={language}
              setLanguage={setLanguage}
              onContinue={() => setActiveScreen("login")}
              onBack={() => setActiveScreen("welcome")}
            />
          )}

          {activeScreen === "login" && (
            <LoginPage
              onLogin={handleLogin}
              t={t}
              language={language}
              onBack={() => setActiveScreen("language")}
              onGoToRegister={() => setActiveScreen("register")}
            />
          )}

          {activeScreen === "register" && (
            <RegisterPage
              onComplete={handleLogin}
              t={t}
              language={language}
              onBack={() => setActiveScreen("login")}
            />
          )}

          {/* === MAIN APP FLOW === */}
          {activeScreen === "dashboard" && (
            <Dashboard user={user} t={t} navTo={setActiveScreen} />
          )}

          {/* Pregnancy Guide Screen */}
          {activeScreen === "guide" && (
            <PregnancyGuide
              user={user}
              language={language}
              onBack={() => setActiveScreen("dashboard")}
            />
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
