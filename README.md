# Kingdom of Deeni — Royal Passport RSVP

A one-page Next.js RSVP site styled to match the "Kingdom of Deeni" royal
passport invitation: pink-and-gold hero, a boarding-pass style detail card,
and a simple RSVP form (name, phone, email, guest count) that stores each
reservation in Postgres.

## 1. Install

```bash
npm install
```

## 2. Set up the database

You already have a Neon Postgres project (`gync`) from your other event
site — you can either:
- create a **new** Neon project just for this party, or
- reuse the same Neon project but a different database/schema.

Either way, copy the connection string into a local env file:

```bash
cp .env.example .env
```

Then edit `.env` and paste your `DATABASE_URL`, and set `ADMIN_SECRET` to
any long random string (this protects the guest-list endpoint).

Push the schema to create the `Rsvp` table:

```bash
npx prisma db push
```

## 3. Run it locally

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll see the passport-themed page with
the RSVP form at the bottom.

## 4. Checking who's RSVP'd

There's a lightweight endpoint for you (not for guests) that returns every
reservation and the total headcount:

```bash
curl -H "x-admin-secret: YOUR_ADMIN_SECRET" https://your-site.com/api/rsvp
```

It returns `{ count, totalGuests, rsvps: [...] }` — `count` is the number of
families who reserved, `totalGuests` is the total number of people
(including extra guests per family).

## 5. Deploying

The easiest path: push this to a GitHub repo and deploy on **Vercel**
(free tier is plenty for a party site):

1. `vercel.com` → New Project → import the repo
2. Add the same `DATABASE_URL` and `ADMIN_SECRET` as environment variables
   in the Vercel project settings
3. Deploy — you'll get a link like `deeni-turns-three.vercel.app` that you
   can text/WhatsApp to your invite list

## 6. Adding Twilio SMS (next step)

Once the form is live and people start RSVPing, we'll wire up Twilio so you
can text everyone who reserved — reminders, the venue link, day-of updates,
whatever you want, short or long. To get ready for that:

1. Create a free account at twilio.com
2. Buy/verify a phone number (Twilio gives you a trial number and credit)
3. Grab your **Account SID**, **Auth Token**, and **phone number** from the
   Twilio console
4. Drop them into `.env` as `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`,
   `TWILIO_PHONE_NUMBER`

Bring those three values back and I'll add:
- a `/api/notify` route that loops through everyone in the `Rsvp` table
  and sends them a text via Twilio
- a simple way to trigger it (a button, or a script you run whenever you
  want to send an update)

## Project structure

```
app/
  page.tsx          the whole RSVP page (hero, boarding pass, form, footer)
  layout.tsx         fonts + page metadata
  globals.css        theme colors, animations
  api/rsvp/route.ts  POST saves an RSVP, GET (admin) lists them
prisma/
  schema.prisma      the Rsvp table definition
lib/
  prisma.ts          shared Prisma client
```
# DEENIBIrthday
