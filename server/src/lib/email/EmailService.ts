/**
 * EmailService Interface
 * 
 * Defines the contract for all email service implementations.
 * This allows for swappable email providers without changing business logic.
 */
export interface EmailService {
  /**
   * Send an email
   * @param to - Recipient email address
   * @param subject - Email subject line
   * @param body - Email body content (plain text)
   * @returns Promise that resolves when email is sent
   */
  send(to: string, subject: string, body: string): Promise<void>;
}
