"use client";

import { useState } from "react";

function CrownIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none" aria-hidden="true">
      <path
        d="M4 36L2 12l14 10 12-18 12 18 14-10-2 24H4Z"
        fill="currentColor"
      />
      <rect x="4" y="34" width="56" height="5" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function CastleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 120" className={className} fill="none" aria-hidden="true">
      <path
        d="M20 120V60h10V44h10V30l8-8 8 8v14h10v16h14V38h-6V24l10-10 10 10v14h-6v22h14V60h10v-8h10v8h10v60H20Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

function StepperInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border-2 border-deeni-pink-soft bg-white px-4 py-3">
      <span className="font-body text-sm font-semibold text-deeni-ink/70">
        Guests attending
      </span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Decrease guest count"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-deeni-pink-deep text-lg font-bold text-white transition hover:bg-deeni-ink"
        >
          −
        </button>
        <span className="w-6 text-center font-display text-xl font-bold text-deeni-ink">
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase guest count"
          onClick={() => onChange(Math.min(20, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-deeni-pink-deep text-lg font-bold text-white transition hover:bg-deeni-ink"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !phone.trim()) {
      setErrorMsg("Please share your name and phone number.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, guestCount }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main className="min-h-screen w-full">
      {/* HERO — passport cover */}
      <section className="relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden bg-royal-gradient px-6 text-center text-white">
        <div className="float-slow">
          <CrownIcon className="mx-auto mb-4 h-10 w-16 text-deeni-gold-light" />
        </div>
        <p className="fade-up font-body text-xs font-bold uppercase tracking-[0.35em] text-deeni-gold-light">
          Kingdom of Deeni
        </p>
        <h1 className="fade-up mt-3 font-script text-6xl leading-none text-white drop-shadow-sm sm:text-7xl">
          Princess Deeni
        </h1>
        <p className="fade-up mt-2 font-display text-2xl font-semibold tracking-wide sm:text-3xl">
          Turns Three
        </p>
        <p className="fade-up mt-6 max-w-xs font-body text-sm text-white/90 sm:max-w-sm sm:text-base">
          Join us for a birthday celebration filled with joy, laughter, dancing
          &amp; cherished memories.
        </p>

        <a
          href="#boarding-pass"
          className="fade-up mt-10 inline-flex items-center gap-2 rounded-full border-2 border-deeni-gold-light/80 bg-white/10 px-6 py-3 font-body text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition hover:bg-white/20"
        >
          Open your invitation
          <span aria-hidden="true">↓</span>
        </a>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-deeni-pink-deep/40 to-transparent" />
      </section>

      {/* BOARDING PASS — party details */}
      <section
        id="boarding-pass"
        className="flex w-full justify-center bg-deeni-blush px-4 py-16 sm:py-24"
      >
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl shadow-deeni-pink-deep/10">
          <div className="bg-deeni-pink-deep px-6 py-5 text-white">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-deeni-gold-light">
              Boarding Pass
            </p>
            <p className="font-display text-xl font-semibold">
              Royal Celebration &middot; Deeni
            </p>
          </div>

          <div className="perforated space-y-5 px-6 py-8">
            <DetailRow
              label="Date"
              value="Saturday, August 8, 2026"
              icon="📅"
            />
            <DetailRow label="Time" value="6:00 PM onwards" icon="🕕" />
            <DetailRow
              label="Venue"
              value={"5 Star Banquet Hall\n13-05 43rd Ave, LIC, NY 11101"}
              icon="📍"
            />
            <DetailRow
              label="Dress Code"
              value="Wear what makes you feel special & bring your best smile"
              icon="👗"
            />
          </div>
        </div>
      </section>

      {/* RSVP FORM — royal reservation */}
      <section className="flex w-full justify-center bg-white px-4 py-16 sm:py-24">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <CrownIcon className="mx-auto mb-3 h-7 w-11 text-deeni-gold" />
            <h2 className="font-display text-3xl font-bold text-deeni-ink">
              Royal RSVP
            </h2>
            <p className="mt-2 font-body text-sm text-deeni-ink/60">
              One reservation per family is all we need — let us know who's
              coming to the kingdom.
            </p>
          </div>

          {status === "done" ? (
            <div className="stamp-in rounded-3xl border-4 border-deeni-gold bg-deeni-cream px-6 py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-4 border-deeni-gold text-2xl">
                👑
              </div>
              <p className="font-display text-2xl font-bold text-deeni-pink-deep">
                Reservation Confirmed!
              </p>
              <p className="mt-2 font-body text-sm text-deeni-ink/70">
                Thank you, {name.split(" ")[0] || "friend"}! We can't wait to
                celebrate with you on August 8th. A confirmation text will
                follow soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field
                label="Name"
                id="name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Jane Doe"
                required
              />
              <Field
                label="Phone number"
                id="phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="(555) 555-5555"
                required
                hint="We'll text party updates to this number."
              />
              <Field
                label="Email (optional)"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="jane@example.com"
              />
              <StepperInput value={guestCount} onChange={setGuestCount} />

              {errorMsg && (
                <p role="alert" className="font-body text-sm font-semibold text-deeni-pink-deep">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-deeni-pink-deep py-4 font-body text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-deeni-pink-deep/30 transition hover:bg-deeni-ink disabled:opacity-60"
              >
                {status === "loading" ? "Reserving..." : "Reserve My Seat"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex w-full flex-col items-center gap-4 bg-royal-gradient px-6 py-14 text-center text-white">
        <CastleIcon className="h-16 w-28 text-white/90" />
        <p className="font-script text-3xl">See you at the kingdom!</p>
        <p className="max-w-xs font-body text-xs text-white/80">
          Questions? Reach Dad at 347-935-2721 or Mom at 929-260-8516.
        </p>
      </footer>
    </main>
  );
}

function DetailRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-2xl leading-none" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-deeni-pink-deep">
          {label}
        </p>
        <p className="whitespace-pre-line font-body text-sm font-semibold text-deeni-ink">
          {value}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  required,
  hint,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block font-body text-xs font-bold uppercase tracking-wider text-deeni-ink/70"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border-2 border-deeni-pink-soft bg-white px-4 py-3 font-body text-sm text-deeni-ink outline-none transition focus:border-deeni-pink-deep"
      />
      {hint && (
        <p className="mt-1 font-body text-xs text-deeni-ink/50">{hint}</p>
      )}
    </div>
  );
}
