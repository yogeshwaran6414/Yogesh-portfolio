'use server';

import { google } from 'googleapis';
import { z } from 'zod';

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your name.')
    .max(100, 'Name must be under 100 characters.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(150, 'Email must be under 150 characters.'),
  message: z
    .string()
    .trim()
    .min(1, 'Please enter a message.')
    .max(2000, 'Message must be under 2000 characters.'),
  honeypot: z.string().optional(),
});

export type SendMessageResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

export async function sendMessage(formData: FormData): Promise<SendMessageResult> {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      honeypot: formData.get('honeypot') || formData.get('_spider_trap'),
    };

    // 1. Server-side validation via Zod
    const validation = contactSchema.safeParse(rawData);
    if (!validation.success) {
      const issues = validation.error.flatten().fieldErrors;
      const firstErrorMessage = Object.values(issues)[0]?.[0] || 'Invalid form input.';
      return { success: false, error: firstErrorMessage, fieldErrors: issues };
    }

    const { name, email, message, honeypot } = validation.data;

    // 2. Anti-spam honeypot verification
    // Bots typically auto-fill hidden input fields. If populated, silently succeed without sending.
    if (honeypot && honeypot.trim().length > 0) {
      return { success: true };
    }

    // 3. Environment credentials check
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const recipientEmail =
      process.env.RECIPIENT_EMAIL || process.env.GOOGLE_USER_EMAIL || 'me';

    if (!clientId || !clientSecret || !refreshToken) {
      console.warn(
        'Gmail API OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN) not found in process.env.'
      );
      return {
        success: false,
        error:
          'Email service is temporarily unconfigured. Please email directly or try again later.',
      };
    }

    // 4. Set up Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );
    oauth2Client.setCredentials({ refresh_token: refreshToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    /* ========================================================================
     * GMAIL API BASE64URL ENCODING:
     * 
     * WHY BASE64URL IS MANDATORY:
     * The Gmail API `users.messages.send` endpoint requires the MIME email
     * payload to be formatted per RFC 2822 and encoded strictly in `base64url`
     * (RFC 4648 Section 5).
     * 
     * COMMON POINT OF FAILURE:
     * Standard Base64 uses '+' and '/' characters, and appends '=' padding at the end.
     * When submitted to the Gmail REST API:
     * 1. Standard '+' characters often get misparsed as URL spaces.
     * 2. Standard '/' characters disrupt URL parameter parsing.
     * 3. '=' padding characters trigger an immediate 400 Bad Request error.
     * 
     * SOLUTION:
     * 1. Replace '+' with '-'
     * 2. Replace '/' with '_'
     * 3. Strip all trailing '=' padding characters completely.
     * 
     * Node's Buffer.from(...).toString('base64url') performs this mapping natively,
     * supplemented here by explicit regex sanitization for maximum compatibility.
     * ======================================================================== */
    const subject = `Portfolio Signal from ${name}`;
    const encodedSubject = `=?utf-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;

    const mimeLines = [
      `To: ${recipientEmail === 'me' ? '' : recipientEmail}`,
      `Reply-To: "${name}" <${email}>`,
      `Subject: ${encodedSubject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Sent: ${new Date().toUTCString()}`,
      '',
      '--- Message Body ---',
      message,
    ];

    const mimeMessage = mimeLines.join('\r\n');

    // Encode to base64url with zero padding
    const encodedMessage = Buffer.from(mimeMessage, 'utf-8')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error dispatching email via Gmail API:', error);
    return {
      success: false,
      error:
        error?.message ||
        'Something went wrong sending your message. Please try again.',
    };
  }
}
