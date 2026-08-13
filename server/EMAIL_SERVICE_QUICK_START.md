# Email Service Quick Start

## Local Development (Default)
No configuration needed! Emails automatically log to console.

```bash
# .env - leave SMTP variables blank or omit them
```

**Console Output**:
```
================================
📧 EMAIL (Console Mode)
================================
To: user@example.com
Subject: Password Reset Code
--------------------------------
Hello John,

Your password reset code is: 123456
...
================================
```

## Production Setup (3 Steps)

### 1. Choose Your SMTP Provider
Pick any SMTP provider you prefer. Examples:

#### Option A: Gmail (Free)
1. Enable 2FA on Google account
2. Create App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM=your-email@gmail.com
```

#### Option B: AWS SES (Scalable)
1. Verify sender email in AWS SES Console
2. Create SMTP credentials in SES
3. Add to `.env`:
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
SMTP_FROM=verified@yourdomain.com
```

#### Option C: Brevo/Sendinblue (Free tier)
```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-email
SMTP_PASSWORD=your-brevo-smtp-key
SMTP_FROM=verified@yourdomain.com
```

### 2. Restart Server
```bash
npm run dev
```

Look for:
```
✅ SMTP Email Service initialized with host: smtp.gmail.com
✅ SMTP connection verified successfully
```

### 3. Test It
Trigger forgot password flow - check recipient's inbox!

## Usage in Code

```typescript
import { emailService } from "../../../lib/email/index.js";

// Send email
await emailService.send(
  "recipient@example.com",
  "Email Subject",
  "Plain text email body"
);
```

That's it! The system automatically uses SMTP when configured, console when not.

## Common Issues

### ❌ "SMTP is partially configured..."
**Fix**: Either set ALL 6 SMTP variables or leave them ALL blank.

### ❌ Gmail: "Invalid credentials"
**Fix**: Use App Password (not regular password). Requires 2FA enabled.

### ❌ AWS SES: "Email not verified"
**Fix**: Verify sender email in AWS SES Console first.

### ⚠️ "SMTP connection verification failed"
**Issue**: Server starts but emails may fail
**Fix**: Double-check credentials and network connectivity

## Adding New Email Types

```typescript
// In any service file
import { emailService } from "../../lib/email/index.js";

export async function sendWelcomeEmail(user: User) {
  const subject = "Welcome!";
  const body = `Hi ${user.firstName}, welcome to our platform!`;
  
  await emailService.send(user.email, subject, body);
}
```

No provider-specific code needed!
