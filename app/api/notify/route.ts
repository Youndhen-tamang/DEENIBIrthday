import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/twilio";

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
    }

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.length - successCount;

    return NextResponse.json(
      {
        message: `Notification dispatch complete. Sent: ${successCount}, Failed: ${failureCount}`,
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
