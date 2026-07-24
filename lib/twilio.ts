import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize the client only if credentials are provided
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Validates and normalizes a phone number to US E.164 format (+1XXXXXXXXXX).
 * Rejects anything that isn't a valid US number.
 */
export function normalizePhoneNumber(raw: string): {
  valid: boolean;
  formatted?: string;
  error?: string;
} {
  if (!raw) return { valid: false, error: "Phone number is required." };

  // Strip everything except digits and a leading +
  const cleaned = raw.trim().replace(/[^\d+]/g, "");

  // Case 1: already has a + prefix
  if (cleaned.startsWith("+")) {
    const usMatch = cleaned.match(/^\+1(\d{10})$/);
    if (usMatch) {
      return { valid: true, formatted: `+1${usMatch[1]}` };
    }
    return {
      valid: false,
      error:
        "Only US phone numbers are supported for this event. Please enter a US mobile number.",
    };
  }

  // Case 2: no + prefix, digits only
  const digitsOnly = cleaned.replace(/\D/g, "");

  if (digitsOnly.length === 10) {
    return { valid: true, formatted: `+1${digitsOnly}` };
  }

  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    return { valid: true, formatted: `+${digitsOnly}` };
  }

  return {
    valid: false,
    error: "Please enter a valid 10-digit US phone number.",
  };
}

export async function sendSms(
  to: string,
  body: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
  try {
    if (!client || !fromPhone) {
      console.warn(
        `[TWILIO FALLBACK] SMS simulated to ${to} (Twilio credentials missing in .env):\n"${body}"`
      );
      return { success: true, sid: "SIMULATED_SID" };
    }

    // Validate & normalize the phone number
    const phoneResult = normalizePhoneNumber(to);
    if (!phoneResult.valid) {
      console.warn(
        `[TWILIO SKIP] Skipping invalid number ${to}: ${phoneResult.error}`
      );
      return { success: false, error: phoneResult.error };
    }

    const message = await client.messages.create({
      body,
      from: fromPhone,
      to: phoneResult.formatted!,
    });

    console.log(`[TWILIO SUCCESS] SMS sent to ${phoneResult.formatted}, SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error: any) {
    console.error(`[TWILIO ERROR] Failed to send SMS to ${to}:`, error);
    return { success: false, error: error.message || String(error) };
  }
}
