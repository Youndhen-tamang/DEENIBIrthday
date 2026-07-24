import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Default sender address. Resend free tier allows onboarding@resend.dev out of the box
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Kingdom of Deeni <onboarding@resend.dev>";

export async function queueOrSendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; queued: boolean; error?: string }> {
  if (!to || !to.includes("@")) {
    return { success: false, queued: false, error: "Invalid recipient email." };
  }

  // If Resend API key is missing, automatically queue it in the DB
  if (!resend) {
    console.warn(`[RESEND QUEUED] Key missing. Queuing email to ${to}`);
    await prisma.emailQueue.create({
      data: {
        to,
        subject,
        html,
        status: "PENDING",
        error: "RESEND_API_KEY missing in .env",
      },
    });
    return { success: true, queued: true };
  }

  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (data.error) {
      console.error(`[RESEND ERROR] Direct send failed to ${to}:`, data.error);
      // Queue on error (e.g. rate limit / daily quota reached)
      await prisma.emailQueue.create({
        data: {
          to,
          subject,
          html,
          status: "PENDING",
          error: data.error.message || String(data.error),
        },
      });
      return { success: true, queued: true };
    }

    // Direct send successful -> log sent status in DB
    await prisma.emailQueue.create({
      data: {
        to,
        subject,
        html,
        status: "SENT",
        sentAt: new Date(),
      },
    });

    console.log(`[RESEND SUCCESS] Sent email to ${to}, ID: ${data.data?.id}`);
    return { success: true, queued: false };
  } catch (err: any) {
    console.error(`[RESEND EXCEPTION] Failed to send to ${to}:`, err);
    await prisma.emailQueue.create({
      data: {
        to,
        subject,
        html,
        status: "PENDING",
        error: err.message || String(err),
      },
    });
    return { success: true, queued: true };
  }
}

/**
 * Manually process pending emails in the queue up to a specified batch size.
 */
export async function processEmailQueue(batchSize = 25): Promise<{
  processed: number;
  sentCount: number;
  failedCount: number;
  errors: string[];
}> {
  if (!resend) {
    return {
      processed: 0,
      sentCount: 0,
      failedCount: 0,
      errors: ["RESEND_API_KEY is not configured in .env"],
    };
  }

  const pending = await prisma.emailQueue.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    take: batchSize,
  });

  if (pending.length === 0) {
    return { processed: 0, sentCount: 0, failedCount: 0, errors: [] };
  }

  let sentCount = 0;
  let failedCount = 0;
  const errors: string[] = [];

  for (const item of pending) {
    try {
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: item.to,
        subject: item.subject,
        html: item.html,
      });

      if (data.error) {
        failedCount++;
        const errMsg = data.error.message || String(data.error);
        errors.push(`${item.to}: ${errMsg}`);
        await prisma.emailQueue.update({
          where: { id: item.id },
          data: { error: errMsg, status: "FAILED" },
        });
      } else {
        sentCount++;
        await prisma.emailQueue.update({
          where: { id: item.id },
          data: { status: "SENT", sentAt: new Date(), error: null },
        });
      }
    } catch (err: any) {
      failedCount++;
      const errMsg = err.message || String(err);
      errors.push(`${item.to}: ${errMsg}`);
      await prisma.emailQueue.update({
        where: { id: item.id },
        data: { error: errMsg, status: "FAILED" },
      });
    }
  }

  return {
    processed: pending.length,
    sentCount,
    failedCount,
    errors,
  };
}
