"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { formulas, reservationFormEndpoint, type FormulaId } from "@/content/site-data";
import { useSelection } from "@/context/SelectionContext";
import { formatPriceBreakdownText, getActiveAddons, getPriceBreakdown } from "@/lib/pricing";
import { AnimatedNumber } from "./motion/AnimatedNumber";
import { EASE_SOFT, gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "./motion/gsap";
import { scrollToSection } from "./motion/MotionProvider";
import { Container } from "./ui/Container";
import { FadeIn } from "./ui/FadeIn";
import { SectionHeading } from "./ui/SectionHeading";

type Status = "idle" | "sending" | "success" | "error";
type Contact = {
  prenom: string;
  nom: string;
  telephone: string;
  email: string;
  adresse: string;
  date: string;
  creneau: string;
  commentaire: string;
};
type Errors = Partial<Record<keyof Contact | "formule", string>>;

const STEPS = ["Formule", "Suppléments", "Date et créneau", "Coordonnées"] as const;
const CRENEAUX = ["Matin", "Après-midi", "Soir"] as const;

function todayIso() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

export function Reservation() {
  const { selection, setVehicleModel, setFormula, toggleAddon, bookingStep: step, setBookingStep } = useSelection();
  const activeAddons = getActiveAddons();
  const breakdown = getPriceBreakdown(selection.formula, selection.addonIds);

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [contact, setContact] = useState<Contact>({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    adresse: "",
    date: "",
    creneau: "",
    commentaire: "",
  });

  const formRef = useRef<HTMLFormElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const direction = useRef(1);
  const previousStep = useRef(step);

  function updateContact<K extends keyof Contact>(key: K, value: string) {
    setContact((c) => ({ ...c, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  // Transition glissée entre les étapes + focus sur le titre de l'étape.
  useIsomorphicLayoutEffect(() => {
    if (previousStep.current === step) return;
    direction.current = step > previousStep.current ? 1 : -1;
    previousStep.current = step;
    const panel = panelRef.current;
    if (panel) {
      const reduced = prefersReducedMotion();
      gsap.fromTo(
        panel,
        { autoAlpha: 0, x: reduced ? 0 : 48 * direction.current },
        { autoAlpha: 1, x: 0, duration: reduced ? 0.3 : 0.7, ease: EASE_SOFT, clearProps: "transform" },
      );
    }
    // Le titre peut être encore masqué (section pas encore apparue, quand on
    // arrive depuis « Choisir cette formule ») : on attend qu'il soit visible.
    const heading = headingRef.current;
    let frame = 0;
    let tries = 0;
    const focusWhenVisible = () => {
      if (!heading) return;
      if (getComputedStyle(heading).visibility !== "hidden" && heading.closest("[style*='visibility: hidden']") === null) {
        heading.focus({ preventScroll: true });
      } else if (tries++ < 180) {
        frame = requestAnimationFrame(focusWhenVisible);
      }
    };
    focusWhenVisible();
    return () => cancelAnimationFrame(frame);
  }, [step]);

  function validate(current: number): Errors {
    const next: Errors = {};
    if (current === 0 && !selection.formula) {
      next.formule = "Choisissez une formule pour continuer.";
    }
    if (current === 2) {
      if (!contact.date) next.date = "Indiquez la date souhaitée.";
      else if (contact.date < todayIso()) next.date = "Choisissez une date à partir d'aujourd'hui.";
      if (!contact.creneau) next.creneau = "Choisissez un créneau.";
    }
    if (current === 3) {
      if (!contact.prenom.trim()) next.prenom = "Indiquez votre prénom.";
      if (!contact.nom.trim()) next.nom = "Indiquez votre nom.";
      const digits = contact.telephone.replace(/\D/g, "");
      if (!contact.telephone.trim()) next.telephone = "Indiquez un numéro pour vous recontacter.";
      else if (digits.length < 10) next.telephone = "Numéro incomplet (ex : 06 12 34 56 78).";
      if (contact.email.trim() && !/^\S+@\S+\.\S+$/.test(contact.email.trim())) {
        next.email = "Adresse email invalide.";
      }
      if (!contact.adresse.trim()) next.adresse = "Indiquez l'adresse ou la ville d'intervention.";
    }
    return next;
  }

  /** Affiche les erreurs et place le focus sur le premier champ concerné. */
  function showErrors(found: Errors) {
    setErrors(found);
    requestAnimationFrame(() => {
      const first = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
    });
  }

  function goNext() {
    const found = validate(step);
    if (Object.keys(found).length) return showErrors(found);
    setErrors({});
    setBookingStep(Math.min(STEPS.length - 1, step + 1));
  }

  function goBack() {
    setErrors({});
    setBookingStep(Math.max(0, step - 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < STEPS.length - 1) return goNext();

    // Vérifie à nouveau toutes les étapes avant l'envoi.
    for (let s = 0; s < STEPS.length; s++) {
      const found = validate(s);
      if (Object.keys(found).length) {
        if (s !== step) setBookingStep(s);
        return showErrors(found);
      }
    }

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

  // Après l'envoi, le message de confirmation (plus court que le formulaire)
  // est ramené à l'écran.
  useEffect(() => {
    if (status === "success") scrollToSection("reservation");
  }, [status]);

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

  const isLast = step === STEPS.length - 1;

  return (
    <section id="reservation" className="bg-navy-900 py-20 sm:py-28">
      <Container className="max-w-6xl">
        <SectionHeading
          eyebrow="Réservation"
          title="Demander ma réservation"
          subtitle="Complétez le formulaire ci-dessous : je vous recontacte pour confirmer le créneau."
          light
        />

        <FadeIn delay={0.1}>
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              noValidate
              aria-labelledby="reservation-step-title"
              className="overflow-hidden rounded-3xl bg-white p-6 sm:p-10"
            >
              <Progress step={step} />

              <div ref={panelRef} className="mt-8">
                <h3
                  ref={headingRef}
                  id="reservation-step-title"
                  tabIndex={-1}
                  className="font-display text-2xl font-bold text-navy-900 outline-none"
                >
                  {STEPS[step]}
                </h3>

                {step === 0 ? (
                  <StepFormule
                    value={selection.formula}
                    onChange={(id) => {
                      setFormula(id);
                      setErrors({});
                    }}
                    error={errors.formule}
                  />
                ) : null}

                {step === 1 ? (
                  <fieldset className="mt-6">
                    <legend className="text-sm text-navy-700/80">
                      Facultatif. Les deux options « poils d&apos;animaux » ne se cumulent pas.
                    </legend>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {activeAddons.map((addon) => (
                        <ChoiceCard
                          key={addon.id}
                          type="checkbox"
                          name="supplements"
                          checked={selection.addonIds.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                        >
                          <span className="block text-sm font-semibold leading-snug">{addon.label}</span>
                          <span className="mt-3 block font-display text-xl font-bold">+{addon.price} €</span>
                        </ChoiceCard>
                      ))}
                    </div>
                  </fieldset>
                ) : null}

                {step === 2 ? (
                  <div className="mt-6 space-y-6">
                    <Field label="Date souhaitée" required error={errors.date}>
                      {(props) => (
                        <input
                          {...props}
                          type="date"
                          min={todayIso()}
                          value={contact.date}
                          onChange={(e) => updateContact("date", e.target.value)}
                          className={inputClass}
                        />
                      )}
                    </Field>
                    <fieldset aria-describedby={errors.creneau ? "erreur-creneau" : undefined}>
                      <legend className="text-sm font-semibold text-navy-900">
                        Créneau souhaité <span className="text-sky-600">*</span>
                      </legend>
                      <div className="mt-3 grid grid-cols-3 gap-3">
                        {CRENEAUX.map((creneau) => (
                          <ChoiceCard
                            key={creneau}
                            type="radio"
                            name="creneau"
                            checked={contact.creneau === creneau}
                            onChange={() => updateContact("creneau", creneau)}
                            invalid={Boolean(errors.creneau)}
                          >
                            <span className="block text-center text-sm font-semibold">{creneau}</span>
                          </ChoiceCard>
                        ))}
                      </div>
                      <ErrorText id="erreur-creneau" message={errors.creneau} />
                    </fieldset>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="mt-6 space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Prénom" required error={errors.prenom}>
                        {(props) => (
                          <input
                            {...props}
                            autoComplete="given-name"
                            value={contact.prenom}
                            onChange={(e) => updateContact("prenom", e.target.value)}
                            className={inputClass}
                          />
                        )}
                      </Field>
                      <Field label="Nom" required error={errors.nom}>
                        {(props) => (
                          <input
                            {...props}
                            autoComplete="family-name"
                            value={contact.nom}
                            onChange={(e) => updateContact("nom", e.target.value)}
                            className={inputClass}
                          />
                        )}
                      </Field>
                      <Field label="Téléphone" required error={errors.telephone}>
                        {(props) => (
                          <input
                            {...props}
                            type="tel"
                            autoComplete="tel"
                            value={contact.telephone}
                            onChange={(e) => updateContact("telephone", e.target.value)}
                            className={inputClass}
                          />
                        )}
                      </Field>
                      <Field label="Email (facultatif)" error={errors.email}>
                        {(props) => (
                          <input
                            {...props}
                            type="email"
                            autoComplete="email"
                            value={contact.email}
                            onChange={(e) => updateContact("email", e.target.value)}
                            className={inputClass}
                          />
                        )}
                      </Field>
                    </div>
                    <Field label="Adresse / ville d'intervention" required error={errors.adresse}>
                      {(props) => (
                        <input
                          {...props}
                          autoComplete="street-address"
                          value={contact.adresse}
                          onChange={(e) => updateContact("adresse", e.target.value)}
                          className={inputClass}
                        />
                      )}
                    </Field>
                    <Field label="Modèle du véhicule">
                      {(props) => (
                        <input
                          {...props}
                          value={selection.vehicleModel}
                          onChange={(e) => setVehicleModel(e.target.value)}
                          placeholder="Ex : Peugeot 208"
                          className={inputClass}
                        />
                      )}
                    </Field>
                    <Field label="Commentaire / précision éventuelle">
                      {(props) => (
                        <textarea
                          {...props}
                          rows={4}
                          value={contact.commentaire}
                          onChange={(e) => updateContact("commentaire", e.target.value)}
                          className={inputClass}
                        />
                      )}
                    </Field>

                    {/* Piège à robots (anti-spam), invisible pour un humain */}
                    <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" />

                    {status === "error" ? (
                      <p role="alert" className="text-sm font-medium text-red-600">
                        Une erreur est survenue lors de l&apos;envoi. Vous pouvez réessayer ou me contacter
                        directement par téléphone ou email.
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="mt-10 flex items-center justify-between gap-4 border-t border-navy-900/10 pt-6">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="link-underline inline-flex items-center gap-2 text-sm font-semibold text-navy-700 hover:text-navy-900"
                  >
                    <span aria-hidden="true">←</span> Retour
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-navy-900 px-7 py-3.5 text-base font-semibold text-white disabled:cursor-not-allowed disabled:bg-navy-300"
                >
                  <span aria-hidden="true" className="btn-fill pointer-events-none absolute inset-0 -z-10 rounded-[inherit] bg-navy-600" />
                  {isLast ? (status === "sending" ? "Envoi en cours…" : "Demander ma réservation") : "Continuer"}
                  {!isLast ? <span aria-hidden="true">→</span> : null}
                </button>
              </div>
            </form>

            <Summary
              formula={selection.formula}
              lines={breakdown}
              date={contact.date}
              creneau={contact.creneau}
            />
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}

// --- Étape 1 : formule ---------------------------------------------------------

function StepFormule({
  value,
  onChange,
  error,
}: {
  value: FormulaId | null;
  onChange: (id: FormulaId) => void;
  error?: string;
}) {
  return (
    <fieldset className="mt-6" aria-describedby={error ? "erreur-formule" : undefined}>
      <legend className="sr-only">Formule</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {formulas.map((formula) => (
          <ChoiceCard
            key={formula.id}
            type="radio"
            name="formule"
            checked={value === formula.id}
            onChange={() => onChange(formula.id)}
            invalid={Boolean(error)}
            large
          >
            <span className="flex items-baseline justify-between gap-3">
              <span className="font-display text-xl font-bold">{formula.name}</span>
              <span className="font-display text-2xl font-bold">{formula.priceFrom} €</span>
            </span>
            <span className="mt-1 block text-sm opacity-75">{formula.tagline}</span>
            <span className="mt-4 block space-y-1.5 text-sm">
              {formula.features.slice(0, 3).map((feature) => (
                <span key={feature} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-0.5 text-sky-500">✓</span>
                  {feature}
                </span>
              ))}
              {formula.features.length > 3 ? (
                <span className="block pl-5 opacity-60">
                  + {formula.features.length - 3}{" "}
                  {formula.features.length - 3 > 1 ? "autres prestations" : "autre prestation"}
                </span>
              ) : null}
            </span>
          </ChoiceCard>
        ))}
      </div>
      <ErrorText id="erreur-formule" message={error} />
    </fieldset>
  );
}

// --- Composants communs ----------------------------------------------------------

function Progress({ step }: { step: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-navy-700/70">
        <span>
          Étape {step + 1} sur {STEPS.length}
        </span>
        <span className="hidden sm:inline">{STEPS[step]}</span>
      </div>
      <div
        className="mt-3 h-1 overflow-hidden rounded-full bg-navy-900/10"
        role="progressbar"
        aria-label="Avancement de la réservation"
        aria-valuemin={1}
        aria-valuemax={STEPS.length}
        aria-valuenow={step + 1}
      >
        <div
          className="reservation-progress h-full origin-left rounded-full bg-navy-900"
          style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }}
        />
      </div>
      <ol className="mt-3 hidden grid-cols-4 gap-2 text-xs text-navy-700/60 sm:grid">
        {STEPS.map((label, i) => (
          <li key={label} className={i <= step ? "font-semibold text-navy-900" : undefined}>
            {label}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ChoiceCard({
  type,
  name,
  checked,
  onChange,
  invalid,
  large,
  children,
}: {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  invalid?: boolean;
  large?: boolean;
  children: ReactNode;
}) {
  return (
    <label
      className={`choice-card relative block cursor-pointer rounded-2xl border-2 transition-colors duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-sky-400 has-[:focus-visible]:ring-offset-2 ${
        large ? "p-6" : "p-4"
      } ${
        checked
          ? "border-navy-900 bg-navy-900 text-white"
          : invalid
            ? "border-red-400 bg-white text-navy-900"
            : "border-navy-900/10 bg-white text-navy-900 hover:border-navy-900/40"
      }`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        aria-invalid={invalid || undefined}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border text-[11px] transition-colors ${
          checked ? "border-white bg-white text-navy-900" : "border-navy-900/20"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      <span className="block pr-6">{children}</span>
    </label>
  );
}

type FieldProps = { id: string; required?: boolean; "aria-invalid"?: boolean; "aria-describedby"?: string };

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: (props: FieldProps) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-erreur`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">
        {label} {required ? <span className="text-sky-600">*</span> : null}
      </label>
      {children({
        id,
        required,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
      })}
      <ErrorText id={errorId} message={error} />
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

// --- Récapitulatif -----------------------------------------------------------------

function Summary({
  formula,
  lines,
  date,
  creneau,
}: {
  formula: FormulaId | null;
  lines: ReturnType<typeof getPriceBreakdown>;
  date: string;
  creneau: string;
}) {
  const [open, setOpen] = useState(false);
  const activeAddons = getActiveAddons();
  const { selection } = useSelection();
  const chosen = formulas.find((f) => f.id === formula);

  const details = (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-white/60">Formule</dt>
        <dd className="text-right font-semibold">{chosen ? `${chosen.name} · ${chosen.priceFrom} €` : "—"}</dd>
      </div>
      {selection.addonIds.map((id) => {
        const addon = activeAddons.find((a) => a.id === id);
        return addon ? (
          <div key={id} className="flex justify-between gap-4">
            <dt className="text-white/60">{addon.label}</dt>
            <dd className="shrink-0 font-semibold">+{addon.price} €</dd>
          </div>
        ) : null;
      })}
      <div className="flex justify-between gap-4">
        <dt className="text-white/60">Date</dt>
        <dd className="text-right font-semibold first-letter:uppercase">
          {date ? formatDate(date) : "—"}
          {creneau ? ` · ${creneau}` : ""}
        </dd>
      </div>
    </dl>
  );

  const total = (
    <span className="font-display text-4xl font-bold">
      <AnimatedNumber value={lines.total} mode="change" /> €
    </span>
  );

  return (
    <>
      {/* Desktop : récapitulatif toujours visible à droite. */}
      <aside
        aria-label="Récapitulatif de la réservation"
        className="sticky top-28 hidden rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-white lg:block"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-sky-300">Récapitulatif</p>
        <div className="mt-6">{details}</div>
        <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
          <span className="text-sm text-white/60">Total estimé</span>
          {total}
        </div>
      </aside>

      {/* Mobile : replié en bas d'écran pendant la réservation. */}
      <div className="sticky bottom-3 z-10 lg:hidden" style={{ marginBottom: "env(safe-area-inset-bottom)" }}>
        <div className="rounded-2xl border border-white/10 bg-navy-950/90 text-white shadow-premium backdrop-blur-md">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="recap-mobile"
            className="flex w-full items-center justify-between gap-4 px-5 py-4"
          >
            <span className="text-left">
              <span className="block text-xs font-semibold uppercase tracking-widest text-sky-300">Récapitulatif</span>
              <span className="text-sm text-white/70">{chosen ? chosen.name : "Aucune formule"}</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="font-display text-2xl font-bold">
                <AnimatedNumber value={lines.total} mode="change" /> €
              </span>
              <span aria-hidden="true" className={`transition-transform duration-500 ${open ? "rotate-180" : ""}`}>
                ▾
              </span>
            </span>
          </button>
          <div id="recap-mobile" hidden={!open} className="border-t border-white/10 px-5 py-4">
            {details}
          </div>
        </div>
      </div>
    </>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-navy-900/15 bg-white px-4 py-2.5 text-navy-900 placeholder:text-navy-400 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200 aria-[invalid=true]:border-red-400";
