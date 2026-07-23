import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/twilio";

function normalizePhone(raw: string) {
  let clean = raw.replace(/[^\d+]/g, "");
  if (!clean.startsWith("+")) {
    if (clean.length === 10) {
      clean = "+1" + clean;
    } else if (clean.length === 11 && clean.startsWith("1")) {
      clean = "+" + clean;
    }
  }
  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const guestCount = Number(body.guestCount);

    if (!name || !phoneRaw) {
      return NextResponse.json(
        { error: "Name and phone number are required." },
        { status: 400 }
      );
    }

    const phone = normalizePhone(phoneRaw);
    if (phone.replace("+", "").length < 7) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const resolvedGuestCount = Number.isFinite(guestCount) && guestCount > 0 ? guestCount : 1;

    const rsvp = await prisma.rsvp.create({
      data: {
        name,
        phone,
        email: email || null,
        guestCount: resolvedGuestCount,
      },
    });

    // Send Twilio confirmation SMS (don't block response on Twilio failure)
    try {
      const smsBody = `👑 Royal RSVP Confirmed!\n\nHello ${name.split(" ")[0] || name}, we are thrilled to welcome you (Total: ${resolvedGuestCount} guest${resolvedGuestCount > 1 ? "s" : ""}) to Princess Deeni's 3rd Birthday Celebration on Saturday, Aug 8, 2026 at 6:00 PM.\n\nSee you at the kingdom!`;
      await sendSms(phone, smsBody);
    } catch (smsErr) {
      console.error("Failed to send confirmation SMS:", smsErr);
    }

    return NextResponse.json({ ok: true, id: rsvp.id }, { status: 201 });
  } catch (err) {
    console.error("RSVP submission failed:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your RSVP. Please try again." },
      { status: 500 }
    );
  }
}

// Simple admin-only listing so you can see who's coming and the total headcount.
// Call with header: x-admin-secret: <ADMIN_SECRET from .env>
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rsvps = await prisma.rsvp.findMany({ orderBy: { createdAt: "desc" } });
  const totalGuests = rsvps.reduce((sum, r) => sum + r.guestCount, 0);

  return NextResponse.json({ count: rsvps.length, totalGuests, rsvps });
}
