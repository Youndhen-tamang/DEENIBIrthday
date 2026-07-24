import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/twilio";
import { queueOrSendEmail } from "@/lib/resend";

// Hardcoded event details for Deeni's Birthday
const EVENT = {
  eventName: "Princess Deeni's 3rd Birthday",
  date: "08/08/2026",
  time: "6:00 PM",
  address: "5 Star Banquet Hall, 13-05 43rd Ave, LIC, NY 11101",
};

function formatMessage(template: string, recipientName: string): string {
  const firstName = recipientName.split(" ")[0] || recipientName;

  return template
    .replace(/\{name\}/gi, firstName)
    .replace(/\[name\]/gi, firstName)
    .replace(/\[Event Name\]/gi, EVENT.eventName)
    .replace(/\[MM\/DD\/YYYY\]/gi, EVENT.date)
    .replace(/\[HH:MM AM\/PM\]/gi, EVENT.time)
    .replace(/\[Address\]/gi, EVENT.address);
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const messageText = typeof body.message === "string" ? body.message.trim() : "";
    const sendEmailAlso = Boolean(body.sendEmailAlso);

    if (!messageText) {
      return NextResponse.json(
        { error: "Message content is required for notifications." },
        { status: 400 }
      );
    }

    const rsvps = await prisma.rsvp.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (rsvps.length === 0) {
      return NextResponse.json({ message: "No RSVPs to notify.", results: [] }, { status: 200 });
    }

    const results = [];
    let emailsQueued = 0;

    for (const rsvp of rsvps) {
      const formattedMessage = formatMessage(messageText, rsvp.name);

      const res = await sendSms(rsvp.phone, formattedMessage);
      results.push({
        name: rsvp.name,
        phone: rsvp.phone,
        success: res.success,
        sid: res.sid,
        error: res.error,
      });

      if (sendEmailAlso && rsvp.email && rsvp.email.includes("@")) {
        const firstName = rsvp.name.split(" ")[0] || rsvp.name;
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #F0E6DF; border-radius: 12px; background-color: #FFF9F5;">
            <h3 style="color: #2D2019; margin-top: 0;">👑 Princess Deeni's 3rd Birthday Update</h3>
            <p style="color: #4A3E3D; font-size: 15px; line-height: 1.5;">Hello <strong>${firstName}</strong>,</p>
            <p style="color: #2D2019; font-size: 15px; line-height: 1.5; white-space: pre-line;">${formattedMessage}</p>
            <hr style="border: 0; border-top: 1px solid #E5D4B0; margin: 20px 0;" />
            <p style="color: #8A7B6F; font-size: 12px;">Event Date: Aug 8, 2026 at 6:00 PM · 5 Star Banquet Hall</p>
          </div>
        `;

        const emailRes = await queueOrSendEmail({
          to: rsvp.email,
          subject: `👑 Update regarding Princess Deeni's Celebration`,
          html,
        });

        if (emailRes.success) emailsQueued++;
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json(
      {
        message: `Broadcast complete. SMS Sent: ${successCount}, Failed: ${failureCount}.${sendEmailAlso ? ` Emails processed/queued: ${emailsQueued}` : ""}`,
        results,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Notification API failed:", err);
    return NextResponse.json(
      { error: "Something went wrong sending notifications." },
      { status: 500 }
    );
  }
}
