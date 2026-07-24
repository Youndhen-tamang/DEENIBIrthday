import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSms, normalizePhoneNumber } from "@/lib/twilio";
import { queueOrSendEmail } from "@/lib/resend";

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

    // Strict US-only phone validation
    const phoneResult = normalizePhoneNumber(phoneRaw);
    if (!phoneResult.valid) {
      return NextResponse.json(
        { error: phoneResult.error },
        { status: 400 }
      );
    }

    const phone = phoneResult.formatted!;
    const resolvedGuestCount =
      Number.isFinite(guestCount) && guestCount > 0 ? guestCount : 1;

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
      const smsBody = `SwipeScapes RSVP: Thank you for confirming your spot, ${name.split(" ")[0] || name}! We're excited to have you at Princess Deeni's 3rd Birthday on 08/08/2026 at 6:00 PM, located at 5 Star Banquet Hall, 13-05 43rd Ave, LIC, NY 11101. We'll send you a reminder closer to the date. Reply STOP to opt out.`;
      await sendSms(phone, smsBody);
    } catch (smsErr) {
      console.error("Failed to send confirmation SMS:", smsErr);
    }

    // Send/Queue confirmation Email if provided
    if (email && email.includes("@")) {
      try {
        const firstName = name.split(" ")[0] || name;
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #F0E6DF; border-radius: 12px; background-color: #FFF9F5;">
            <h2 style="color: #2D2019; margin-top: 0;">👑 Royal RSVP Confirmed!</h2>
            <p style="color: #4A3E3D; font-size: 16px; line-height: 1.5;">
              Hello <strong>${firstName}</strong>,
            </p>
            <p style="color: #4A3E3D; font-size: 15px; line-height: 1.5;">
              Thank you for reserving your spot for <strong>Princess Deeni's 3rd Birthday Celebration</strong>! We are thrilled to welcome you and your family (Total: ${resolvedGuestCount} guest${resolvedGuestCount > 1 ? "s" : ""}).
            </p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #E5D4B0; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #B87340; font-size: 16px;">Event Details</h3>
              <p style="margin: 5px 0; color: #2D2019; font-size: 14px;">📅 <strong>Date:</strong> Saturday, August 8, 2026</p>
              <p style="margin: 5px 0; color: #2D2019; font-size: 14px;">🕕 <strong>Time:</strong> 6:00 PM onwards</p>
              <p style="margin: 5px 0; color: #2D2019; font-size: 14px;">📍 <strong>Venue:</strong> 5 Star Banquet Hall, 13-05 43rd Ave, LIC, NY 11101</p>
            </div>

            <p style="color: #8A7B6F; font-size: 13px;">
              If you have any questions, reach out to Dad at 347-935-2721 or Mom at 929-260-8516.
            </p>
          </div>
        `;

        await queueOrSendEmail({
          to: email,
          subject: "👑 Royal RSVP Confirmed — Princess Deeni's 3rd Birthday",
          html: emailHtml,
        });
      } catch (emailErr) {
        console.error("Failed to queue/send confirmation email:", emailErr);
      }
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
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rsvps = await prisma.rsvp.findMany({ orderBy: { createdAt: "desc" } });
  const totalGuests = rsvps.reduce((sum, r) => sum + r.guestCount, 0);

  return NextResponse.json({ count: rsvps.length, totalGuests, rsvps });
}
