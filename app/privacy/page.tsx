import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Princess Deeni's Birthday RSVP",
  description: "Privacy policy for the Princess Deeni Birthday RSVP service by SwipeScapes.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="mt-2 font-body text-sm text-[#8A7B6F]">
          Last updated: July 24, 2026
        </p>

        <div className="mt-10 space-y-8 font-body text-sm leading-relaxed text-[#2D2019]/80">
          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              1. Who We Are
            </h2>
            <p>
              SwipeScapes RSVP (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates{" "}
              <strong>birthday.strapnote.com</strong>, a website for collecting RSVPs for Princess Deeni&apos;s 3rd Birthday Celebration.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              2. Information We Collect
            </h2>
            <p>When you submit the RSVP form, we collect:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li><strong>Full Name</strong> — to identify you as a guest</li>
              <li><strong>Phone Number</strong> — to send event confirmations and reminders via SMS</li>
              <li><strong>Email Address</strong> (optional) — for additional event communications</li>
              <li><strong>Guest Count</strong> — to plan for event capacity</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              3. How We Use Your Information
            </h2>
            <p>Your personal information is used exclusively for:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Confirming your RSVP via text message</li>
              <li>Sending event reminders, venue updates, and schedule changes</li>
              <li>Planning event logistics (headcount, seating, etc.)</li>
            </ul>
            <p className="mt-3">
              We <strong>do not</strong> use your information for marketing, advertising, or any purpose unrelated to this event.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              4. SMS Messaging
            </h2>
            <p>
              By checking the SMS consent box on the RSVP form, you opt in to receive text messages from SwipeScapes RSVP. Messages may include RSVP confirmations, event reminders, and important updates.
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li><strong>Frequency:</strong> Up to 5 messages related to the event</li>
              <li><strong>Opt-Out:</strong> Reply <strong>STOP</strong> to any message to unsubscribe</li>
              <li><strong>Help:</strong> Reply <strong>HELP</strong> for assistance</li>
              <li><strong>Rates:</strong> Message and data rates may apply</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              5. Data Sharing
            </h2>
            <p>
              We <strong>do not sell, trade, or share</strong> your personal information with third parties, except:
            </p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>
                <strong>Twilio</strong> — our SMS service provider, which processes your phone number solely to deliver text messages on our behalf. Twilio&apos;s privacy policy can be found at{" "}
                <a
                  href="https://www.twilio.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-[#B87340] transition"
                >
                  twilio.com/legal/privacy
                </a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              6. Data Storage &amp; Security
            </h2>
            <p>
              Your data is stored securely in a cloud-hosted database with encrypted connections. We take reasonable measures to protect your information from unauthorized access. Data will be retained for the duration of the event and deleted within 30 days after the event concludes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              7. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="mt-3 list-disc pl-6 space-y-1">
              <li>Request a copy of the personal data we hold about you</li>
              <li>Request deletion of your data at any time</li>
              <li>Opt out of SMS messages by replying STOP</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at{" "}
              <a href="tel:+13479352721" className="underline underline-offset-2 hover:text-[#B87340] transition">
                347-935-2721
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              8. Children&apos;s Privacy
            </h2>
            <p>
              This website is intended for use by adults (parents/guardians) to RSVP on behalf of their families. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-[#2D2019] mb-2">
              10. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, contact us at{" "}
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
