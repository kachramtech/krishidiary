import React from "react";
import { AppStateProvider } from "./context/AppContext";
import { AndroidDashboard } from "./views/AndroidDashboard";
import { ConfirmModal } from "./components/common/ConfirmModal";
import { App as CapacitorApp } from '@capacitor/app';

const MainAppContent: React.FC = () => {
  React.useEffect(() => {
    // जब कोई एंड्रॉइड का बैक बटन दबाए
    const backButtonListener = CapacitorApp.addListener('backButton', () => {
      const isHome = !window.location.hash || window.location.hash === "#/" || window.location.hash === "#";
      if (isHome) {
        // अगर यूजर होम पेज पर है, तो ऐप बंद कर दो
        CapacitorApp.exitApp();
      } else {
        // नहीं तो पिछले पेज पर वापस जाओ
        window.history.back();
      }
    });

    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-905 bg-slate-950 flex flex-col font-sans select-none antialiased justify-center items-center">
      <main className="w-full flex justify-center items-center">
        <AndroidDashboard />
      </main>
      <ConfirmModal />
    </div>
  );
};

export default function App() {
  return (
    <AppStateProvider>
      <MainAppContent />
    </AppStateProvider>
  );
}
