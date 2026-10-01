/** Étoiles de notation, avec remplissage partiel (ex. 4,7 / 5). */
export function Stars({
  rating,
  size = 16,
  className = "",
  label = true,
}: {
  rating: number;
  size?: number;
  className?: string;
  label?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role={label ? "img" : undefined}
      aria-label={label ? `${rating.toLocaleString("fr-FR")} sur 5` : undefined}
      aria-hidden={label ? undefined : true}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <StarShape size={size} className="absolute inset-0 text-current opacity-20" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarShape size={size} className="text-amber-400" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function StarShape({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3.1-5.4 3.1 1.2-6L1.3 7.8l6.1-.7z" />
    </svg>
  );
}
