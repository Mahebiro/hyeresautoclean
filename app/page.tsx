import { Avis } from "@/components/Avis";
import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Formules } from "@/components/Formules";
import { Galerie } from "@/components/Galerie";
import { CommentCaMarche } from "@/components/CommentCaMarche";
import { PourquoiNous } from "@/components/PourquoiNous";
import { PresentationCourte } from "@/components/PresentationCourte";
import { Reservation } from "@/components/Reservation";
import { ShowroomHero } from "@/components/showroom-hero/ShowroomHero";
import { Storytelling } from "@/components/Storytelling";

export default function Home() {
  return (
    <main>
      <ShowroomHero />
      <PresentationCourte />
      <Formules />
      <PourquoiNous />
      <Storytelling />
      <Galerie />
      <Avis />
      <CommentCaMarche />
      <Reservation />
      <FAQ />
      <Contact />
    </main>
  );
}
