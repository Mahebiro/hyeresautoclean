import { Suspense } from "react";
import { Avis } from "@/components/Avis";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Formules } from "@/components/Formules";
import { Galerie } from "@/components/Galerie";
import { MobileActionBar } from "@/components/MobileActionBar";
import { CommentCaMarche } from "@/components/CommentCaMarche";
import { PourquoiNous } from "@/components/PourquoiNous";
import { PresentationCourte } from "@/components/PresentationCourte";
import { Reservation } from "@/components/Reservation";
import { ShowroomHero } from "@/components/showroom-hero/ShowroomHero";
import { Storytelling } from "@/components/Storytelling";

// Chaque section est une frontière <Suspense> : React hydrate la page en
// plusieurs petites tâches au lieu d'une seule longue (page plus réactive
// sur mobile), sans aucun changement visible.
export default function Home() {
  return (
    <main>
      <Suspense>
        <ShowroomHero />
      </Suspense>
      <Suspense>
        <PresentationCourte />
      </Suspense>
      <Suspense>
        <Formules />
      </Suspense>
      <Suspense>
        <PourquoiNous />
      </Suspense>
      <Suspense>
        <Storytelling />
      </Suspense>
      <Suspense>
        <Galerie />
      </Suspense>
      <Suspense>
        <Avis />
      </Suspense>
      <Suspense>
        <CommentCaMarche />
      </Suspense>
      <Suspense>
        <Reservation />
      </Suspense>
      <Suspense>
        <FAQ />
      </Suspense>
      <Suspense>
        <Contact />
      </Suspense>
      <Suspense>
        <MobileActionBar />
      </Suspense>
    </main>
  );
}
