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
          Page à compléter : remplacez chaque champ entre crochets [ ] par vos informations
          réelles (nom, SIRET, adresse, hébergeur, conditions d&apos;annulation, modes de
          paiement).
        </p>

        <div className="mt-8 space-y-8 text-navy-800">
          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Éditeur du site</h2>
            <p className="mt-2 text-sm leading-relaxed">
              {company.name}
              <br />
              Nom : [NOM ET PRÉNOM]
              <br />
              Statut : micro-entrepreneur (entreprise individuelle)
              <br />
              SIRET : [SIRET]
              <br />
              Adresse : [ADRESSE]
              <br />
              Téléphone : {company.phone}
              <br />
              Email : {company.email}
              <br />
              TVA : [MENTION TVA — ex : TVA non applicable, art. 293 B du CGI]
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Directeur de la publication</h2>
            <p className="mt-2 text-sm leading-relaxed">[NOM ET PRÉNOM]</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Hébergement</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Ce site est hébergé par : [HÉBERGEUR — nom]
              <br />
              Adresse : [HÉBERGEUR — adresse]
              <br />
              Contact : [HÉBERGEUR — téléphone ou site web]
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Modes de paiement acceptés</h2>
            <p className="mt-2 text-sm leading-relaxed">[MODES DE PAIEMENT ACCEPTÉS]</p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-navy-900">Conditions d&apos;annulation</h2>
            <p className="mt-2 text-sm leading-relaxed">[CONDITIONS D&apos;ANNULATION]</p>
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
