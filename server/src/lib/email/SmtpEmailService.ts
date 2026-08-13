import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type { EmailService } from "./EmailService.js";

/**
 * SmtpEmailService
 * 
 * Production email service that sends emails via SMTP.
 * Works with any SMTP provider: Gmail, Outlook, Brevo, Resend SMTP,
 * AWS SES SMTP, company mail servers, self-hosted servers, etc.
 */
export class SmtpEmailService implements EmailService {
  private transporter: Transporter;
  private fromAddress: string;

  constructor(config: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
  }) {
    // Validate configuration
    if (!config.host) {
      throw new Error("SMTP_HOST is required for SMTP email service");
    }
    if (!config.port) {
      throw new Error("SMTP_PORT is required for SMTP email service");
    }
    if (!config.user) {
      throw new Error("SMTP_USER is required for SMTP email service");
    }
    if (!config.password) {
      throw new Error("SMTP_PASSWORD is required for SMTP email service");
    }
    if (!config.from) {
      throw new Error("SMTP_FROM is required for SMTP email service");
    }

    this.fromAddress = config.from;

    // Create nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    console.log(`✅ SMTP Email Service initialized with host: ${config.host}`);
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        text: body,
      });

      console.log(`📧 Email sent successfully to ${to} (Message ID: ${info.messageId})`);
    } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Verify SMTP connection
   * Useful for testing configuration at startup
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("✅ SMTP connection verified successfully");
      return true;
    } catch (error) {
      console.error("❌ SMTP connection verification failed:", error);
      return false;
    }
  }
}
