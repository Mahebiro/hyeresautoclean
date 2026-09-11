import { Contact } from "@/components/Contact";
import { FAQ } from "@/components/FAQ";
import { Formules } from "@/components/Formules";
import { Galerie } from "@/components/Galerie";
import { Hero } from "@/components/Hero";
import { CommentCaMarche } from "@/components/CommentCaMarche";
import { PourquoiNous } from "@/components/PourquoiNous";
import { PresentationCourte } from "@/components/PresentationCourte";
import { Reservation } from "@/components/Reservation";
import { Simulateur } from "@/components/Simulateur";
import { Storytelling } from "@/components/Storytelling";

export default function Home() {
  return (
    <main>
      <Hero />
      <PresentationCourte />
      <Formules />
      <Simulateur />
      <PourquoiNous />
      <Storytelling />
      <Galerie />
      <CommentCaMarche />
      <Reservation />
      <FAQ />
      <Contact />
    </main>
  );
}
