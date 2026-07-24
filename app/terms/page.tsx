import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — Princess Deeni's Birthday RSVP",
  description: "Terms and conditions for the Princess Deeni Birthday RSVP service by SwipeScapes.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen w-full bg-[#FFF9F5] px-4 py-16 sm:py-24">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 font-body text-xs font-bold uppercase tracking-wider text-[#8A7B6F] hover:text-[#B87340] transition"
        >
          ← Back to RSVP
        </Link>

        <h1 className="font-display text-3xl font-bold text-[#2D2019] sm:text-4xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 font-body text-sm text-[#8A7B6F]">
          Last updated: July 24, 2026
        </p>

        <div className="mt-10 space-y-8 font-body text-sm leading-relaxed text-[#2D2019]/80">
          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              1. Service Overview
            </h2>
            <p>
              SwipeScapes RSVP (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the website at{" "}
              <strong>birthday.strapnote.com</strong> to collect RSVPs for Princess Deeni&apos;s 3rd Birthday Celebration on August 8, 2026. By submitting your RSVP, you agree to these Terms &amp; Conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              2. SMS Messaging Consent
            </h2>
            <p>
              By checking the SMS consent box on our RSVP form, you consent to receive text messages from SwipeScapes RSVP at the phone number you provide. These messages include:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>RSVP confirmation messages</li>
              <li>Event reminders and updates</li>
              <li>Venue or schedule change notifications</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              3. Message Frequency &amp; Rates
            </h2>
            <p>
              Message frequency varies. You may receive up to 5 messages related to the event.
              <strong> Message and data rates may apply</strong> depending on your mobile carrier plan. SwipeScapes RSVP is not responsible for any charges incurred from your carrier.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              4. Opting Out
            </h2>
            <p>
              You may opt out of receiving text messages at any time by replying <strong>STOP</strong> to any message you receive from us. After opting out, you will receive one final confirmation message and no further texts will be sent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              5. Help
            </h2>
            <p>
              For assistance, reply <strong>HELP</strong> to any message, or contact us at{" "}
              <a href="tel:+13479352721" className="underline underline-offset-2 hover:text-[#B87340] transition">
                347-935-2721
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              6. Information We Collect
            </h2>
            <p>
              When you submit the RSVP form, we collect your name, phone number, email address (optional), and guest count. This information is used solely for the purpose of managing RSVPs and sending event-related communications. We do not sell, trade, rent, or share your mobile phone number or SMS opt-in data with third parties or affiliates for marketing or promotional purposes. For full details, see our{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-[#B87340] transition">
                Privacy Policy
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              7. Disclaimer
            </h2>
            <p>
              This website and SMS service are provided &quot;as is&quot; without warranties of any kind. We are not responsible for delays or failures in message delivery caused by mobile carriers or technical issues.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              8. Changes to Terms
            </h2>
            <p>
              We reserve the right to update these Terms at any time. Changes will be posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              9. Contact Us
            </h2>
            <p>
              If you have questions about these Terms, contact us at{" "}
              <a href="tel:+13479352721" className="underline underline-offset-2 hover:text-[#B87340] transition">
                347-935-2721
              </a>.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
