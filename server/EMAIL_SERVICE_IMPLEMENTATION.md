# Email Service Implementation

## Overview
Implemented a swappable email service system with SMTP support via Nodemailer. The system automatically selects between console logging (development) and SMTP sending (production) based on environment configuration, ensuring local development never breaks.

## Architecture

### 1. Interface-Based Design
```typescript
interface EmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}
```

This interface allows for easy provider swapping without changing business logic.

### 2. Two Implementations

#### ConsoleEmailService (Default)
- **Purpose**: Development/fallback email service
- **Behavior**: Logs emails to console instead of sending
- **Use Case**: Local development without SMTP credentials
- **Location**: `src/lib/email/ConsoleEmailService.ts`

#### SmtpEmailService (Production)
- **Purpose**: Production email service via SMTP
- **Provider**: Uses Nodemailer with standard SMTP protocol
- **Compatibility**: Works with ANY SMTP provider:
  - Gmail
  - Outlook/Office365
  - AWS SES SMTP
  - Brevo (Sendinblue)
  - Resend SMTP
  - Company mail servers
  - Self-hosted mail servers
- **Location**: `src/lib/email/SmtpEmailService.ts`

### 3. Automatic Provider Selection
The email service factory (`src/lib/email/index.ts`) automatically selects the appropriate implementation:

| Scenario | Behavior |
|----------|----------|
| No SMTP config | ConsoleEmailService (safe for local dev) |
| All SMTP config present | SmtpEmailService |
| Partial SMTP config | **Throws clear error at startup** |

## Environment Variables

### Added to `src/config/env.ts`:
```typescript
SMTP_HOST: z.string().optional(),
SMTP_PORT: z.string().optional(),
SMTP_SECURE: z.string().optional(),
SMTP_USER: z.string().optional(),
SMTP_PASSWORD: z.string().optional(),
SMTP_FROM: z.string().optional(),
```

### Added to `.env.example`:
```bash
# SMTP Configuration (Optional - leave blank to use console logging)
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

With examples for common providers (Gmail, Outlook, AWS SES, Brevo).

## Integration with forgotPassword

### Before:
```typescript
console.log("================================");
console.log("PASSWORD RESET CODE");
console.log(code);
console.log("================================");
```

### After:
```typescript
const subject = "Password Reset Code";
const body = `Hello ${user.firstName},

You requested a password reset for your account.

Your password reset code is: ${code}

This code will expire in 15 minutes.

If you did not request a password reset, please ignore this email.

Best regards,
The Support Team`;

try {
  await emailService.send(user.email, subject, body);
} catch (error) {
  console.error("Failed to send password reset email:", error);
  // Don't throw - we don't want to reveal whether the email exists
}
```

**Security Note**: Errors are logged but not thrown to prevent user enumeration attacks.

## Configuration Examples

### Gmail
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Use App Password, not regular password
SMTP_FROM=your-email@gmail.com
```

**Gmail Setup**:
1. Enable 2FA on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password as SMTP_PASSWORD

### Outlook/Office365
```bash
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM=your-email@outlook.com
```

### AWS SES SMTP
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
SMTP_FROM=verified-sender@yourdomain.com
```

**AWS SES Setup**:
1. Verify your sender email/domain in AWS SES
2. Create SMTP credentials in the SES console
3. Start in sandbox mode (only verified recipients)
4. Request production access to send to any recipient

### Brevo (Sendinblue)
```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-email
SMTP_PASSWORD=your-brevo-smtp-key
SMTP_FROM=your-verified-sender@yourdomain.com
```

### Local Development (Default)
Leave all SMTP variables blank:
```bash
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
```

Emails will be logged to console with this format:
```
================================
📧 EMAIL (Console Mode)
================================
To: user@example.com
Subject: Password Reset Code
--------------------------------
Hello John,

You requested a password reset...
================================
```

## Error Handling

### Startup Errors

#### Partial Configuration
If SMTP is partially configured, the server will **fail to start** with a clear error:
```
Error: SMTP is partially configured but missing required variables: SMTP_USER, SMTP_PASSWORD.
Either provide all SMTP variables or leave them all blank to use console logging.
```

#### Invalid Configuration
If SMTP configuration is invalid (wrong host, port, credentials), the server will:
1. Log a warning about connection verification failure
2. Continue running (non-blocking)
3. Fail when actually trying to send emails

### Runtime Errors
If email sending fails during `forgotPassword`:
- Error is logged to console
- Function does NOT throw (security: prevent user enumeration)
- Reset code is still saved in database and can be used

## Files Created

1. **`src/lib/email/EmailService.ts`**
   - Interface definition

2. **`src/lib/email/ConsoleEmailService.ts`**
   - Development/fallback implementation

3. **`src/lib/email/SmtpEmailService.ts`**
   - Production SMTP implementation
   - Includes connection verification method

4. **`src/lib/email/index.ts`**
   - Factory that selects appropriate implementation
   - Singleton export

## Files Modified

1. **`package.json`**
   - Added `nodemailer` dependency
   - Added `@types/nodemailer` dev dependency

2. **`src/config/env.ts`**
   - Added optional SMTP environment variables

3. **`.env.example`**
   - Added SMTP configuration template with examples

4. **`src/modules/auth/services/auth.service.ts`**
   - Imported `emailService`
   - Updated `forgotPassword` to send real emails
   - Removed console.log placeholder

## Testing

### Test Console Mode (Default)
1. Don't configure SMTP variables
2. Trigger forgot password
3. Check console for email output

### Test SMTP Mode
1. Configure all SMTP variables (e.g., Gmail with App Password)
2. Restart server
3. Look for startup message: `✅ SMTP Email Service initialized with host: smtp.gmail.com`
4. Trigger forgot password
5. Check recipient's inbox
6. Look for log: `📧 Email sent successfully to user@example.com (Message ID: ...)`

### Test Error Cases

#### Partial Configuration
1. Set only `SMTP_HOST=smtp.gmail.com`
2. Try to start server
3. Should fail with clear error message

#### Invalid Credentials
1. Configure all SMTP variables with wrong password
2. Server starts (with warning)
3. Trigger forgot password
4. Should log error but not crash

## Future Enhancements

Consider adding:
- HTML email templates (alongside plain text)
- Email queuing system for better reliability
- Additional email types (welcome emails, ticket notifications)
- Email tracking/analytics
- Support for email attachments
- Template engine integration (Handlebars, EJS)
- Alternative providers without SMTP (SendGrid SDK, Resend SDK)

## Security Considerations

1. **App Passwords**: For Gmail, always use App Passwords, not regular passwords
2. **Environment Variables**: Never commit `.env` file with real credentials
3. **User Enumeration**: Email send failures don't throw to prevent revealing valid emails
4. **Rate Limiting**: The existing rate limiter protects forgot-password endpoint
5. **TLS/STARTTLS**: SMTP uses STARTTLS by default on port 587

## Troubleshooting

### Emails not being sent
1. Check server startup logs for SMTP initialization message
2. Verify all SMTP variables are set correctly
3. Test SMTP credentials with a third-party tool
4. Check SMTP provider's dashboard for error logs

### Gmail: "Less secure app" error
- Gmail no longer supports "less secure apps"
- You MUST use App Passwords (requires 2FA enabled)

### AWS SES: "Email address not verified"
- AWS SES starts in sandbox mode
- Verify both sender and recipient emails in SES console
- Or request production access

### Port blocked by firewall
- Try different ports: 587 (STARTTLS), 465 (SSL), 2525 (alternative)
- Check if your network/firewall blocks SMTP ports
- Some ISPs block port 25

### Connection timeout
- Verify SMTP host is correct
- Check network connectivity
- Try with SMTP_SECURE=true on port 465

## Production Checklist

- [ ] Configure all 6 SMTP environment variables
- [ ] Verify sender email/domain with SMTP provider
- [ ] Test email sending in staging environment
- [ ] Monitor email delivery rates
- [ ] Set up SPF, DKIM, and DMARC records for better deliverability
- [ ] Consider email delivery monitoring service
- [ ] Set up alerts for email sending failures
- [ ] Document email rate limits from provider
