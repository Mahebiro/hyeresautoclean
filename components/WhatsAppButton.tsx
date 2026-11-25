import { company } from "@/content/site-data";

/** Lien WhatsApp avec le message prérempli (numéro et texte : site-data.ts). */
export function whatsappHref() {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(company.whatsappMessage)}`;
}

/**
 * Bouton WhatsApp flottant, sur toutes les pages. Sur mobile, il remonte
 * au-dessus de la barre « Appeler / Réserver » quand celle-ci est affichée.
 */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire sur WhatsApp (envoyez une photo de votre véhicule)"
      title="Réserver sur WhatsApp"
      className="whatsapp-fab fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-transform duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:bottom-6 md:right-6"
      style={{ bottom: "calc(16px + env(safe-area-inset-bottom))" }}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 01-4.8-1.31l-.35-.2-3.57.93.95-3.48-.22-.36a9.41 9.41 0 01-1.45-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.99 6.67 2.77a9.37 9.37 0 012.76 6.68c0 5.2-4.24 9.43-9.43 9.43zm8.03-17.46A11.27 11.27 0 0012.05.5C5.79.5.7 5.59.7 11.85c0 2 .52 3.95 1.52 5.67L.6 23.5l6.12-1.6a11.33 11.33 0 005.32 1.36h.01c6.26 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.32-8.03z" />
      </svg>
    </a>
  );
}
