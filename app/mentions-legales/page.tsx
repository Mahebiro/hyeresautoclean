import type { Metadata } from "next";
import { company } from "@/content/site-data";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <main className="bg-white py-20 sm:py-28">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-navy-900">Mentions légales</h1>
        <p className="mt-4 rounded-xl bg-navy-50 p-4 text-sm text-navy-700">
          Cette page est un modèle à compléter avec vos informations réelles (statut juridique,
          SIRET, adresse, hébergeur) avant la mise en ligne définitive du site. Remplacez les
          champs entre crochets ci-dessous.
        </p>

        <div className="mt-8 space-y-8 text-navy-800">
          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Éditeur du site</h2>
            <p className="mt-2 text-sm leading-relaxed">
              {company.name}
              <br />
              Entreprise individuelle — [statut juridique à préciser, ex : micro-entreprise]
              <br />
              [Nom et prénom de l&apos;exploitant]
              <br />
              [Adresse du siège / adresse professionnelle]
              <br />
              SIRET : [à compléter]
              <br />
              Téléphone : {company.phone}
              <br />
              Email : {company.email}
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Directeur de la publication</h2>
            <p className="mt-2 text-sm leading-relaxed">[Nom et prénom]</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Hébergement</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Ce site est hébergé par : [nom de l&apos;hébergeur, ex : Vercel Inc.]
              <br />
              [Adresse de l&apos;hébergeur]
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Modalités de paiement</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Le règlement de la prestation s&apos;effectue par virement bancaire ou en espèces,
              directement auprès de {company.name} au moment de l&apos;intervention ou selon les
              modalités convenues lors de la réservation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Propriété intellectuelle</h2>
            <p className="mt-2 text-sm leading-relaxed">
              L&apos;ensemble des contenus présents sur ce site (textes, images, logo) est la
              propriété de {company.name}, sauf mention contraire.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Données personnelles</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Les informations transmises via le formulaire de réservation sont utilisées
              uniquement pour traiter votre demande et vous recontacter. Elles ne sont ni
              revendues, ni transmises à des tiers. Pour toute question ou demande de suppression
              de vos données, contactez : {company.email}.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Cookies</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Ce site utilise uniquement un cookie technique destiné à mémoriser votre choix
              (acceptation ou refus) concernant le bandeau de consentement affiché lors de votre
              première visite. Aucun cookie de suivi publicitaire ou d&apos;analyse d&apos;audience
              n&apos;est utilisé actuellement. Si cela venait à changer, cette page serait mise à
              jour en conséquence.
            </p>
          </section>
        </div>
      </Container>
    </main>
  );
}
