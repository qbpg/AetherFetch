"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

type Modal = "mentions" | "privacy" | null;

export default function Footer() {
  const [modal, setModal] = useState<Modal>(null);

  const close = useCallback(() => setModal(null), []);

  useEffect(() => {
    if (!modal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modal, close]);

  return (
    <>
      <footer className="flex-shrink-0 border-t border-zinc-800/50 py-2.5 px-4 flex items-center justify-center gap-3 text-xs text-zinc-500/70">
        <span>Créé par QBPG</span>
        <span className="text-zinc-700">·</span>
        <a href="mailto:qbpg.sg@outlook.com" translate="no" className="hover:text-zinc-300 transition-colors">
          qbpg.sg@outlook.com
        </a>
        <span className="text-zinc-700">·</span>
        <button onClick={() => setModal("mentions")} className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">
          Mentions légales
        </button>
        <span className="text-zinc-700">·</span>
        <button onClick={() => setModal("privacy")} className="hover:text-zinc-300 transition-colors underline-offset-2 hover:underline">
          Confidentialité
        </button>
      </footer>

      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/60 animate-fade-in-up">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-zinc-100">
                {modal === "mentions" ? "Mentions légales" : "Politique de confidentialité"}
              </h3>
              <button onClick={close}
                className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-5 text-sm text-zinc-400 leading-relaxed space-y-3">
              {modal === "mentions" ? (
                <>
                  <p><span className="text-zinc-300 font-medium">Éditeur :</span> qbpg</p>
                  <p><span className="text-zinc-300 font-medium">Contact support :</span>{" "}
                    <a href="mailto:qbpg.sg@outlook.com" translate="no" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      qbpg.sg@outlook.com
                    </a>
                  </p>
                  <p>
                    Ce service est un outil de messagerie temporaire fourni à titre indicatif.
                    Aucune garantie de conservation à long terme des messages n&apos;est offerte.
                  </p>
                </>
              ) : (
                <>
                  <p><span className="text-zinc-300 font-medium">Responsable :</span> qbpg</p>
                  <p><span className="text-zinc-300 font-medium">Contact :</span>{" "}
                    <a href="mailto:qbpg.sg@outlook.com" translate="no" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      qbpg.sg@outlook.com
                    </a>
                  </p>
                  <p>
                    Les données de session et les messages sont stockés localement dans votre navigateur
                    (localStorage) et ne sont pas transmises à des tiers.
                  </p>
                  <p>
                    Ce service est un outil de messagerie temporaire. Aucune garantie de conservation
                    à long terme n&apos;est offerte. Utilisez-le en connaissance de cause.
                  </p>
                </>
              )}
            </div>
            <div className="px-5 py-4 border-t border-zinc-800 flex justify-end">
              <button onClick={close}
                className="h-8 px-4 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
