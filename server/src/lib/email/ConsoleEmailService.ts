import type { EmailService } from "./EmailService.js";

/**
 * ConsoleEmailService
 * 
 * Development/fallback email service that logs emails to the console
 * instead of actually sending them. This ensures local development
 * never breaks due to missing email provider credentials.
 */
export class ConsoleEmailService implements EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log("================================");
    console.log("📧 EMAIL (Console Mode)");
    console.log("================================");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log("--------------------------------");
    console.log(body);
    console.log("================================");
  }
}
