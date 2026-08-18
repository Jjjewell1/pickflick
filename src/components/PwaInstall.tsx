"use client";

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export default function PwaInstall() {
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    setStandalone(isStandalone());

    // Register service worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);

    const handleInstalled = () => {
      setInstallEvt(null);
      setShowIosHint(false);
    };
    window.addEventListener("appinstalled", handleInstalled);

    // iOS: nudge after a few seconds if not standalone and not dismissed
    if (isIOS() && !isStandalone() && !localStorage.getItem("pf-ios-hint")) {
      const t = setTimeout(() => setShowIosHint(true), 4000);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", handlePrompt);
        window.removeEventListener("appinstalled", handleInstalled);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (dismissed || standalone) return null;

  const install = async () => {
    if (!installEvt) return;
    await installEvt.prompt();
    const choice = await installEvt.userChoice;
    if (choice.outcome === "accepted") setInstallEvt(null);
  };

  const dismiss = () => {
    setDismissed(true);
    if (installEvt) localStorage.setItem("pf-install-dismissed", "1");
    if (showIosHint) {
      setShowIosHint(false);
      localStorage.setItem("pf-ios-hint", "1");
    }
  };

  return (
    <>
      {installEvt && (
        <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:bottom-4 z-50 animate-fade-in-up">
          <div className="glass-panel-heavy p-4 flex items-center gap-3 max-w-sm sm:ml-auto shadow-2xl">
            <img src="/icon-192.png" alt="" className="w-10 h-10 rounded-xl" />
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Install PickFlick</p>
              <p className="text-white/50 text-xs">Add it to your home screen for movie night</p>
            </div>
            <button
              onClick={install}
              className="btn-primary !px-4 !py-2 text-sm whitespace-nowrap"
            >
              Install
            </button>
            <button onClick={dismiss} className="text-white/30 hover:text-white p-1" aria-label="Dismiss">
              ✕
            </button>
          </div>
        </div>
      )}

      {showIosHint && (
        <div className="fixed bottom-4 inset-x-4 z-50 animate-fade-in-up">
          <div className="glass-panel-heavy p-4 max-w-sm mx-auto shadow-2xl">
            <div className="flex items-start gap-3">
              <img src="/icon-192.png" alt="" className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">Add PickFlick to Home Screen</p>
                <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                  Tap the <span className="text-white">Share</span> button{" "}
                  <span className="align-middle inline-block mx-0.5">⬆️</span> then{" "}
                  <span className="text-white">Add to Home Screen</span>.
                </p>
              </div>
              <button onClick={dismiss} className="text-white/30 hover:text-white p-1" aria-label="Dismiss">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
