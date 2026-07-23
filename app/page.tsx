"use client";

import { useState } from "react";

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
    <main className="min-h-screen w-full bg-party-bg">
      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 text-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/birthdayhd.mp4" type="video/mp4" />
            <source src="/birthday.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-party-bg" />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <p className="fade-up font-body text-[11px] font-bold uppercase tracking-[0.4em] text-party-gold-light">
            You&apos;re Invited
          </p>

          <h1 className="fade-up-delay-1 mt-4 font-script text-6xl leading-none text-white sm:text-7xl lg:text-8xl">
            Princess Deeni
          </h1>

          <div className="fade-up-delay-2 mt-3 flex items-center gap-3">
            <span className="h-px w-10 bg-white/30" />
            <p className="font-display text-lg font-semibold tracking-widest text-white/90 uppercase sm:text-xl">
              Turns Three
            </p>
            <span className="h-px w-10 bg-white/30" />
          </div>

          <p className="fade-up-delay-3 mt-6 max-w-sm font-body text-sm leading-relaxed text-white/80 sm:text-base">
            Join us for a celebration filled with joy, laughter,
            dancing &amp; cherished memories.
          </p>

          <a
            href="#details"
            className="fade-up-delay-3 mt-10 inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3 font-body text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/10"
          >
            View Details
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Floating RSVP CTA */}
        <a
          href="#rsvp"
          aria-label="Scroll to RSVP form"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-party-accent-deep px-5 py-3 font-body text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 active:scale-95"
        >
          RSVP Now
        </a>
      </section>

      {/* ─── EVENT DETAILS ─── */}
      <section
        id="details"
        className="w-full bg-party-bg px-4 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-14 text-center">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-party-accent">
              The Celebration
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-party-text sm:text-4xl">
              Party Details
            </h2>
          </div>

          {/* Video + Details Grid */}
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            {/* Invitation Video */}
            <div className="overflow-hidden rounded-2xl border border-party-border bg-party-surface">
              <div className="border-b border-party-border px-5 py-3">
                <p className="font-body text-xs font-bold uppercase tracking-widest text-party-muted">
                  Invitation Video
                </p>
              </div>
              <div className="p-4">
                <div className="relative aspect-[9/16] max-w-[240px] mx-auto overflow-hidden rounded-xl bg-black">
                  <video
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                    ref={(el) => {
                      if (el) {
                        const observer = new IntersectionObserver(
                          ([entry]) => {
                            if (entry.isIntersecting) {
                              el.play().catch(() => {});
                            } else {
                              el.pause();
                            }
                          },
                          { threshold: 0.5 }
                        );
                        observer.observe(el);
                      }
                    }}
                  >
                    <source src="/birthdayhd.mp4" type="video/mp4" />
                    <source src="/birthday.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="overflow-hidden rounded-2xl border border-party-border bg-party-surface">
              <div className="border-b border-party-border px-5 py-3">
                <p className="font-body text-xs font-bold uppercase tracking-widest text-party-muted">
                  Event Info
                </p>
              </div>

              <div className="divide-y divide-party-border">
                <DetailRow
                  icon="📅"
                  label="Date"
                  value="Saturday, August 8, 2026"
                />
                <DetailRow
                  icon="🕕"
                  label="Time"
                  value="6:00 PM onwards"
                />
                <DetailRow
                  icon="📍"
                  label="Venue"
                  value={"5 Star Banquet Hall\n13-05 43rd Ave, LIC, NY 11101"}
                />
                <DetailRow
                  icon="👗"
                  label="Dress Code"
                  value="Wear what makes you feel special & bring your best smile"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RSVP FORM ─── */}
      <section id="rsvp" className="w-full bg-party-surface px-4 py-20 sm:py-28">
        <div className="mx-auto w-full max-w-md">
          {/* Section header */}
          <div className="mb-10 text-center">
            <p className="font-body text-[11px] font-bold uppercase tracking-[0.3em] text-party-accent">
              Save Your Spot
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-party-text">
              RSVP
            </h2>
            <p className="mt-3 font-body text-sm text-party-muted">
              One reservation per family — let us know who&apos;s joining the celebration.
            </p>
          </div>

          {status === "done" ? (
            <div className="scale-in rounded-2xl border border-party-border bg-party-bg px-6 py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-party-gold text-2xl">
                ✓
              </div>
              <p className="font-display text-xl font-bold text-party-text">
                You&apos;re Confirmed!
              </p>
              <p className="mt-2 font-body text-sm text-party-muted">
                Thank you, <span className="font-bold text-party-accent-deep">{name.split(" ")[0] || "guest"}</span>! We can&apos;t wait to
                celebrate with you on August 8th.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Field
                label="Full Name"
                id="rsvp-name"
                type="text"
                value={name}
                onChange={setName}
                placeholder="Your full name"
                required
              />
              <Field
                label="Phone Number"
                id="rsvp-phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="+1 (347) 935-2721"
                required
                hint="We'll text party updates to this number."
              />
              <Field
                label="Email (optional)"
                id="rsvp-email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@email.com"
              />

              {/* Guest Stepper */}
              <div>
                <label className="mb-2 block font-body text-xs font-bold uppercase tracking-wider text-party-muted">
                  Guests Attending
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Decrease guest count"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-party-border bg-party-bg font-body text-lg font-bold text-party-text transition hover:border-party-accent"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-display text-xl font-bold text-party-text">
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase guest count"
                    onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-party-border bg-party-bg font-body text-lg font-bold text-party-text transition hover:border-party-accent"
                  >
                    +
                  </button>
                </div>
              </div>

              {errorMsg && (
                <p role="alert" className="font-body text-sm font-semibold text-red-600">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-party-text py-3.5 font-body text-sm font-bold uppercase tracking-widest text-white transition hover:bg-party-accent-deep disabled:opacity-50"
              >
                {status === "loading" ? "Reserving..." : "Reserve My Seat"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="w-full border-t border-party-border bg-party-bg px-6 py-14 text-center">
        <p className="font-script text-3xl text-party-text">
          See you at the party!
        </p>
        <p className="mt-4 font-body text-xs text-party-muted">
          Questions? Reach Dad at{" "}
          <a href="tel:+13479352721" className="underline underline-offset-2 hover:text-party-accent-deep transition">
            347-935-2721
          </a>{" "}
          or Mom at{" "}
          <a href="tel:+19292608516" className="underline underline-offset-2 hover:text-party-accent-deep transition">
            929-260-8516
          </a>
        </p>
        <p className="mt-6 font-body text-[10px] text-party-muted/50 uppercase tracking-widest">
          Princess Deeni&apos;s 3rd Birthday · August 8, 2026
        </p>
      </footer>
    </main>
  );
}

/* ─── SUBCOMPONENTS ─── */

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
    <div className="flex items-start gap-4 px-5 py-4">
      <span className="text-xl leading-none select-none mt-0.5" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-party-muted">
          {label}
        </p>
        <p className="whitespace-pre-line font-body text-sm font-semibold text-party-text mt-0.5">
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
        className="mb-1.5 block font-body text-xs font-bold uppercase tracking-wider text-party-muted"
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
        className="w-full rounded-lg border border-party-border bg-party-bg px-4 py-3 font-body text-sm text-party-text outline-none transition focus:border-party-accent focus:ring-1 focus:ring-party-accent"
      />
      {hint && (
        <p className="mt-1 font-body text-xs text-party-muted">{hint}</p>
      )}
    </div>
  );
}
