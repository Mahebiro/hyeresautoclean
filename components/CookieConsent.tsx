"use client";

import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "hac-cookie-consent";
const PENDING = "pending";

function subscribe() {
  return () => {};
}

// Pendant le rendu serveur et la toute première passe côté client (avant
// hydratation), on ne peut pas encore savoir si l'utilisateur a déjà répondu :
// on renvoie "pending" pour ne pas afficher le bandeau trop tôt (et éviter un
// décalage entre le rendu serveur et le rendu client).
function getServerSnapshot() {
  return PENDING;
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

export function CookieConsent() {
  const storedChoice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [override, setOverride] = useState<"accepted" | "declined" | null>(null);

  const choice = override ?? storedChoice;
  const visible = choice !== PENDING && choice !== "accepted" && choice !== "declined";

  function choose(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Stockage indisponible (navigation privée, etc.) : le bandeau réapparaîtra la prochaine fois.
    }
    setOverride(value);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-navy-950 px-4 py-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p className="text-center text-sm text-white/85 sm:text-left">
          Ce site utilise un cookie technique pour mémoriser votre choix. Aucun cookie de suivi
          publicitaire n&apos;est utilisé.{" "}
          <a href="/mentions-legales" className="underline hover:text-white">
            En savoir plus
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => choose("declined")}
            className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-navy-900 transition-colors hover:bg-sky-50"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
