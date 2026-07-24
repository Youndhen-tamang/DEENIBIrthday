import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processEmailQueue } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await processEmailQueue(50);

    return NextResponse.json({
      success: true,
      message: `Processed ${result.processed} email(s). Sent: ${result.sentCount}, Failed: ${result.failedCount}`,
      result,
    });
  } catch (err: any) {
    console.error("Queue process failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process queue." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const secret = req.headers.get("x-admin-secret");
    if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pendingCount = await prisma.emailQueue.count({ where: { status: "PENDING" } });
    const sentCount = await prisma.emailQueue.count({ where: { status: "SENT" } });
    const failedCount = await prisma.emailQueue.count({ where: { status: "FAILED" } });

    return NextResponse.json({
      pending: pendingCount,
      sent: sentCount,
      failed: failedCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
