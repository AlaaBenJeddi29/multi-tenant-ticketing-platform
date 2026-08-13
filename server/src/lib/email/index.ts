import { env } from "../../config/env.js";
import type { EmailService } from "./EmailService.js";
import { ConsoleEmailService } from "./ConsoleEmailService.js";
import { SmtpEmailService } from "./SmtpEmailService.js";

/**
 * Email Service Factory
 * 
 * Selects the appropriate email service implementation based on environment configuration.
 * 
 * - If all SMTP variables are configured: uses SmtpEmailService
 * - If SMTP variables are missing/empty: uses ConsoleEmailService (safe for local dev)
 * - If SMTP is partially configured: throws clear error at startup
 */
function createEmailService(): EmailService {
  const smtpHost = env.SMTP_HOST?.trim();
  const smtpPort = env.SMTP_PORT?.trim();
  const smtpSecure = env.SMTP_SECURE?.trim();
  const smtpUser = env.SMTP_USER?.trim();
  const smtpPassword = env.SMTP_PASSWORD?.trim();
  const smtpFrom = env.SMTP_FROM?.trim();

  // Check if any SMTP variable is configured
  const hasAnySMTPConfig = !!(
    smtpHost ||
    smtpPort ||
    smtpSecure ||
    smtpUser ||
    smtpPassword ||
    smtpFrom
  );

  // Check if all SMTP variables are configured
  const hasAllSMTPConfig = !!(
    smtpHost &&
    smtpPort &&
    smtpUser &&
    smtpPassword &&
    smtpFrom
  );

  // If no SMTP config at all, use console service (safe for local dev)
  if (!hasAnySMTPConfig) {
    console.log("⚠️  No SMTP configuration found - using ConsoleEmailService (emails will be logged to console)");
    return new ConsoleEmailService();
  }

  // If partial SMTP config, throw clear error
  if (!hasAllSMTPConfig) {
    const missing: string[] = [];
    if (!smtpHost) missing.push("SMTP_HOST");
    if (!smtpPort) missing.push("SMTP_PORT");
    if (!smtpUser) missing.push("SMTP_USER");
    if (!smtpPassword) missing.push("SMTP_PASSWORD");
    if (!smtpFrom) missing.push("SMTP_FROM");

    throw new Error(
      `SMTP is partially configured but missing required variables: ${missing.join(", ")}. ` +
      `Either provide all SMTP variables or leave them all blank to use console logging.`
    );
  }

  // All SMTP config present - use SMTP service
  try {
    const smtpService = new SmtpEmailService({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpSecure === "true",
      user: smtpUser,
      password: smtpPassword,
      from: smtpFrom,
    });

    // Optionally verify connection at startup (non-blocking)
    smtpService.verifyConnection().catch((error) => {
      console.warn("⚠️  SMTP connection verification failed at startup:", error);
      console.warn("   Emails may fail to send. Check your SMTP configuration.");
    });

    return smtpService;
  } catch (error) {
    console.error("❌ Failed to initialize SMTP email service:", error);
    throw error;
  }
}

// Export singleton instance
export const emailService: EmailService = createEmailService();
