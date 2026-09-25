"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { formulas, reservationFormEndpoint } from "@/content/site-data";
import { useSelection } from "@/context/SelectionContext";
import { formatPriceBreakdownText, getActiveAddons, getPriceBreakdown } from "@/lib/pricing";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

type Status = "idle" | "sending" | "success" | "error";

export function Reservation() {
  const { selection, setVehicleModel, setFormula, toggleAddon } = useSelection();
  const activeAddons = getActiveAddons();
  const breakdown = getPriceBreakdown(selection.formula, selection.addonIds);

  const [status, setStatus] = useState<Status>("idle");
  const [contact, setContact] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    date: "",
    creneau: "",
    commentaire: "",
  });

  function updateContact<K extends keyof typeof contact>(key: K, value: string) {
    setContact((c) => ({ ...c, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const formule = formulas.find((f) => f.id === selection.formula);
    const supplements = selection.addonIds
      .map((id) => activeAddons.find((a) => a.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const payload = {
      prenom: contact.prenom,
      nom: contact.nom,
      telephone: contact.telephone,
      email: contact.email,
      adresse: contact.adresse,
      modele_vehicule: selection.vehicleModel,
      formule: formule?.name ?? "",
      supplements: supplements || "Aucun",
      prix_total_estime: breakdown.isComplete ? `${breakdown.total} €` : "à confirmer",
      date_souhaitee: contact.date,
      creneau_souhaite: contact.creneau,
      commentaire: contact.commentaire,
      recapitulatif: formatPriceBreakdownText(breakdown),
      _subject: `Nouvelle demande de réservation — ${contact.prenom} ${contact.nom}`,
    };

    try {
      const response = await fetch(reservationFormEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section id="reservation" className="bg-navy-900 py-20 sm:py-28">
        <Container className="max-w-2xl text-center">
          <FadeIn>
            <h2 className="font-display text-3xl font-bold text-white">Demande bien reçue !</h2>
            <p className="mt-4 text-white/80">
              Merci, votre demande de réservation a bien été envoyée. Je vous recontacte rapidement
              pour confirmer votre créneau.
            </p>
          </FadeIn>
        </Container>
      </section>
    );
  }

  return (
    <section id="reservation" className="bg-navy-900 py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Réservation"
          title="Demander ma réservation"
          subtitle="Complétez le formulaire ci-dessous : je vous recontacte pour confirmer le créneau."
          light
        />

        <FadeIn delay={0.1}>
          <form onSubmit={handleSubmit} className="mt-12 space-y-8 rounded-3xl bg-white p-6 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Prénom" required>
                <input
                  required
                  value={contact.prenom}
                  onChange={(e) => updateContact("prenom", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Nom" required>
                <input
                  required
                  value={contact.nom}
                  onChange={(e) => updateContact("nom", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Téléphone" required>
                <input
                  required
                  type="tel"
                  value={contact.telephone}
                  onChange={(e) => updateContact("telephone", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Email (facultatif)">
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateContact("email", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Adresse / ville d'intervention" required>
              <input
                required
                value={contact.adresse}
                onChange={(e) => updateContact("adresse", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Modèle du véhicule">
              <input
                value={selection.vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Ex : Peugeot 208"
                className={inputClass}
              />
            </Field>

            <div>
              <p className="mb-3 text-sm font-semibold text-navy-900">Formule choisie</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {formulas.map((formula) => (
                  <button
                    type="button"
                    key={formula.id}
                    onClick={() => setFormula(formula.id)}
                    className={`rounded-xl border p-3 text-left text-sm font-medium transition-colors ${
                      selection.formula === formula.id
                        ? "border-navy-900 bg-navy-900 text-white"
                        : "border-navy-900/15 text-navy-900 hover:border-navy-400"
                    }`}
                  >
                    {formula.name}
                  </button>
                ))}
              </div>
            </div>

            {activeAddons.length > 0 ? (
              <div>
                <p className="mb-3 text-sm font-semibold text-navy-900">Suppléments souhaités</p>
                <div className="space-y-2">
                  {activeAddons.map((addon) => (
                    <label key={addon.id} className="flex items-center gap-3 text-sm text-navy-800">
                      <input
                        type="checkbox"
                        checked={selection.addonIds.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                        className="h-4 w-4 rounded border-navy-300 text-navy-900 focus:ring-navy-500"
                      />
                      {addon.label} (+{addon.price} €)
                    </label>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Date souhaitée" required>
                <input
                  required
                  type="date"
                  value={contact.date}
                  onChange={(e) => updateContact("date", e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="Créneau souhaité" required>
                <select
                  required
                  value={contact.creneau}
                  onChange={(e) => updateContact("creneau", e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Choisir…
                  </option>
                  <option value="Matin">Matin</option>
                  <option value="Après-midi">Après-midi</option>
                  <option value="Soir">Soir</option>
                </select>
              </Field>
            </div>

            <Field label="Commentaire / précision éventuelle">
              <textarea
                rows={4}
                value={contact.commentaire}
                onChange={(e) => updateContact("commentaire", e.target.value)}
                className={inputClass}
              />
            </Field>

            {/* Piège à robots (anti-spam), invisible pour un humain */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" />

            {status === "error" ? (
              <p className="text-sm font-medium text-red-600">
                Une erreur est survenue lors de l&apos;envoi. Vous pouvez réessayer ou me contacter
                directement par téléphone ou email.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-navy-900 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-navy-300"
            >
              {status === "sending" ? "Envoi en cours…" : "Demander ma réservation"}
            </button>
          </form>
        </FadeIn>
      </Container>
    </section>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-navy-900/15 bg-white px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm font-semibold text-navy-900">
      {label} {required ? <span className="text-sky-600">*</span> : null}
      {children}
    </label>
  );
}
