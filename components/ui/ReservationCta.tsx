import { Button } from "./Button";
import { FadeIn } from "./FadeIn";

export function ReservationCta({
  text = "Prêt à réserver votre créneau ?",
}: {
  text?: string;
}) {
  return (
    <FadeIn>
      <div className="mt-16 flex flex-col items-center gap-4 text-center">
        <p className="font-display text-lg font-semibold text-navy-900">{text}</p>
        <Button href="#reservation" size="lg">
          Réserver un nettoyage
        </Button>
      </div>
    </FadeIn>
  );
}
