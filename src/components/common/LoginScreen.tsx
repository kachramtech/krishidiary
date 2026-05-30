import React from "react";
import { useAppState } from "../../context/AppContext";
import { Sprout, Eye, ShieldAlert, AlertCircle } from "lucide-react";

export const LoginScreen: React.FC = () => {
  const {
    handleGoogleLogin,
    handleGuestLogin,
    loginError,
    currentUser
  } = useAppState();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-150 relative overflow-hidden select-none font-sans leading-normal">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-505/10 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-950/25 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <header className="py-5 px-6 border-b border-slate-900 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2.5">
          <Sprout className="h-6 w-6 text-emerald-400" />
          <h1 className="font-extrabold text-sm tracking-tight text-white font-sans uppercase">
            Kachram Tech Portal
          </h1>
        </div>
        <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-3 py-1 rounded-full border border-indigo-900 font-bold uppercase tracking-wide">
          v2.4 Secured Core
        </span>
      </header>

      {/* Main card box info */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl w-full max-w-sm text-center shadow-xl space-y-5 animate-scaleIn select-none">
          
          <div className="space-y-2">
            <div className="p-3 bg-emerald-950/60 rounded-2xl w-fit mx-auto border border-emerald-800 shadow-inner">
              <Sprout className="h-10 w-10 text-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
              कृषि प्रबंधन वेब पोर्टल
            </h2>
            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              1000+ प्रगतिशील किसानों का आढ़त मंडी, हाजिरी तथा पारदर्शी लेखा-जोखा प्रबंधन क्लाउड नेटवर्क
            </p>
          </div>

          <div className="space-y-2.5">
            {/* Super admin or Operator Google Oauth login */}
            <button
              id="google-login-btn"
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center space-x-2.5 active:scale-98 outline-none"
            >
              <span>🔑 Google खाते से सुरक्षित प्रवेश करें</span>
            </button>

            {/* Quick Guest simulation Mode */}
            <button
              onClick={handleGuestLogin}
              className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-300 font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-all flex items-center justify-center space-x-2.5 active:scale-98 border border-slate-700/60 outline-none"
            >
              <Eye className="h-4 w-4 text-emerald-400" />
              <span>पब्लिक पोर्टल में प्रवेश करें (Guest visitor Mode)</span>
            </button>
          </div>

          {/* Detailed authentication pop-up warnings */}
          {loginError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-left text-[11px] text-rose-200 space-y-2 select-text">
              <p className="font-extrabold flex items-center gap-1.5 text-rose-300">
                <AlertCircle className="h-4 w-4 text-rose-400" />
                <span>प्रमाणीकरण त्रुटि (Login Alert Error)</span>
              </p>
              <p className="leading-relaxed">
                {loginError.includes("auth/popup-closed-by-user") ? (
                  <>
                    <strong>त्रुटि:</strong> गूगल प्रमाणीकरण पॉपअप विंडो उपयोगकर्ता द्वारा समय से पूर्व बंद की गई, या ब्राउज़र और सैंडबॉक्स प्रतिबंधों ने पॉपअप खोलना अवरुद्ध किया है।
                    <br /><br />
                    <span className="text-amber-400 font-bold font-sans">💡 त्वरित निवारण (Simple Fixes):</span>
                    <br />
                    <strong className="text-emerald-300">1. नए टैब में खोलें (Open in new window):</strong> iframe सैंडबॉक्स समस्या समाप्त करने हेतु इस पूर्वावलोकन विंडो के शीर्ष-दाएं कोने में स्थित <strong>"New Window/Tab"</strong> तीर बटन पर क्लिक करें।
                    <br />
                    <strong className="text-emerald-300">2. पॉपअप सक्षम करें:</strong> एड्रेस बार के दाईं ओर पॉपअप अवरोधक अलर्ट पर क्लिक कर <strong>"Always allow popups"</strong> चुनें।
                  </>
                ) : (
                  <>
                    <strong>विवरण:</strong> {loginError}
                    <br /><br />
                    सैंडबॉक्स और कुकी प्रतिबंधों को दूर करने के लिए पूर्वावलोकन फ्रेम के शीर्ष-दाएं कोने में <strong>"Open in new browser tab/window"</strong> का उपयोग करें।
                  </>
                )}
              </p>
            </div>
          )}

          <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-900 text-left text-[9.5px] text-slate-500 leading-normal space-y-1.5 select-text font-sans">
            <span className="font-bold text-amber-500/80 flex items-center">
              <ShieldAlert className="h-3 w-3 mr-1" />
              <span>सुरक्षा दिशा-निर्देश (Security Policy):</span>
            </span>
            <p>• केवल रजिस्टर्ड सुपर एडमिन (जैसे kachramtech@gmail.com) को डेटा मिटाने तथा संपूर्ण कृषि आडिट रिपोर्ट्स का आधिपत्य प्राप्त होगा।</p>
            <p>• संविदात्मक ऑपरेटर केवल प्रविष्टियों एवं मंडी भार का दैनिक संपादन करेंगे।</p>
          </div>
        </div>
      </main>

      {/* Footer bar */}
      <footer className="py-4.5 border-t border-slate-900 text-center text-[9px] text-slate-500 z-10 font-sans">
        कृषि प्रबंधन वेब समाधान | Google AI Studio Build (Zero-Trust Identity System)
      </footer>
    </div>
  );
};
