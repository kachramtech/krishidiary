import React from "react";
import { AppStateProvider } from "./context/AppContext";
import { AndroidDashboard } from "./views/AndroidDashboard";
import { ConfirmModal } from "./components/common/ConfirmModal";

const MainAppContent: React.FC = () => {
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
