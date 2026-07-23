import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize the client only if credentials are provided
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSms(to: string, body: string): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    if (!client || !fromPhone) {
      console.warn(
        `[TWILIO FALLBACK] SMS simulated to ${to} (Twilio credentials missing in .env):\n"${body}"`
      );
      return { success: true, sid: "SIMULATED_SID" };
    }

    // Format phone number to E.164 if needed, assuming the inputs are normalized or valid
    let cleanTo = to.replace(/[^\d+]/g, "");
    if (!cleanTo.startsWith("+")) {
      if (cleanTo.length === 10) {
        cleanTo = "+1" + cleanTo;
      } else if (cleanTo.length === 11 && cleanTo.startsWith("1")) {
        cleanTo = "+" + cleanTo;
      } else {
        cleanTo = "+" + cleanTo;
      }
    }

    const message = await client.messages.create({
      body,
      from: fromPhone,
      to: cleanTo,
    });

    console.log(`[TWILIO SUCCESS] SMS sent to ${to}, SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error(`[TWILIO ERROR] Failed to send SMS to ${to}:`, error);
    return { success: false, error: error.message || String(error) };
  }
}
