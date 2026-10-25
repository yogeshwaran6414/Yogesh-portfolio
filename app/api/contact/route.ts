import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export const runtime = 'nodejs';

// Rate Limiter: Max 5 submissions per 10 minutes per IP
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const recentSubmissions = new Map<string, number>();

// Clean up stale rate-limit and duplicate records periodically
function cleanupMemoryCache() {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) rateLimitMap.delete(key);
  }
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 60000) recentSubmissions.delete(key);
  }
}

// HTML escape helper to prevent HTML injection in email clients
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Please enter your name.')
    .max(100, 'Name must be 100 characters or fewer.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(150, 'Email must be 150 characters or fewer.'),
  phone: z
    .string()
    .trim()
    .max(35, 'Phone number must be 35 characters or fewer.')
    .optional()
    .default(''),
  service: z
    .string()
    .trim()
    .max(120, 'Service selection must be 120 characters or fewer.')
    .optional()
    .default(''),
  message: z
    .string()
    .trim()
    .min(1, 'Please enter your project message.')
    .max(3000, 'Message must be 3000 characters or fewer.'),
  _spider_trap: z.string().optional().default(''),
  honeypot: z.string().optional().default(''),
});

export async function POST(req: NextRequest) {
  cleanupMemoryCache();

  try {
    // 1. IP extraction for basic abuse prevention & rate limiting
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Rate Limiting Check
    const now = Date.now();
    const rateWindowMs = 10 * 60 * 1000; // 10 minutes
    const maxRequests = 5;

    const currentRecord = rateLimitMap.get(ip);
    if (currentRecord) {
      if (now < currentRecord.resetTime) {
        if (currentRecord.count >= maxRequests) {
          return NextResponse.json(
            {
              success: false,
              error: 'Too many requests. Please wait a few minutes before submitting another inquiry.',
            },
            { status: 429 }
          );
        }
        currentRecord.count += 1;
      } else {
        rateLimitMap.set(ip, { count: 1, resetTime: now + rateWindowMs });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + rateWindowMs });
    }

    // 2. Parse request body
    let rawBody: unknown;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      rawBody = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      rawBody = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message'),
        _spider_trap: formData.get('_spider_trap'),
        honeypot: formData.get('honeypot'),
      };
    } else {
      return NextResponse.json(
        { success: false, error: 'Unsupported Content-Type. Please use application/json.' },
        { status: 400 }
      );
    }

    // 3. Server-side validation via Zod
    const validation = contactSchema.safeParse(rawBody);
    if (!validation.success) {
      const firstIssue = validation.error.issues[0]?.message || 'Invalid form input.';
      return NextResponse.json(
        { success: false, error: firstIssue, fieldErrors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, service, message, _spider_trap, honeypot } = validation.data;

    // 4. Honeypot check for automated bots
    const trapValue = _spider_trap || honeypot;
    if (trapValue && trapValue.trim().length > 0) {
      // Silently succeed without sending email
      return NextResponse.json(
        { success: true, message: 'Your message has been sent successfully.' },
        { status: 200 }
      );
    }

    // 5. Duplicate submission check (same IP + email + beginning of message within 30s)
    const duplicateKey = `${ip}:${email.toLowerCase()}:${message.slice(0, 60).toLowerCase()}`;
    const lastSubmission = recentSubmissions.get(duplicateKey);
    if (lastSubmission && now - lastSubmission < 30000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Duplicate message detected. Please wait a moment before sending another inquiry.',
        },
        { status: 429 }
      );
    }
    recentSubmissions.set(duplicateKey, now);

    // 6. Verify SMTP configuration
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '465', 10);
    const smtpSecure = process.env.SMTP_SECURE !== 'false'; // default true for port 465
    const smtpUser = process.env.SMTP_USER?.trim();
    const rawPass = process.env.SMTP_PASS || '';
    const smtpPass = rawPass.replace(/\s+/g, '');
    const toEmail = process.env.CONTACT_TO_EMAIL?.trim() || smtpUser;
    const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim() || smtpUser;

    if (!smtpUser || !smtpPass) {
      console.warn(
        '[Contact API] SMTP credentials not configured. Please define SMTP_USER and SMTP_PASS in your environment (.env.local).'
      );
      return NextResponse.json(
        {
          success: false,
          error:
            'Email delivery is temporarily unconfigured on this server. Please contact directly via email or try again later.',
        },
        { status: 503 }
      );
    }

    // 7. Setup Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    // 8. Compose Plain-Text and Ember Noir HTML Email Templates
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = phone ? escapeHtml(phone) : 'Not provided';
    const safeService = service ? escapeHtml(service) : 'General Inquiry';
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
    const submissionDate = new Date().toUTCString();

    const textBody = [
      `New Project Inquiry Received`,
      `-----------------------------------------`,
      `Name:             ${name}`,
      `Email:            ${email}`,
      `Phone Number:     ${phone || 'Not provided'}`,
      `Service Required: ${service || 'General Inquiry'}`,
      `Date (UTC):       ${submissionDate}`,
      `IP Address:       ${ip}`,
      `-----------------------------------------`,
      `Project Details / Message:`,
      message,
      `-----------------------------------------`,
      `Reply directly to this email to contact ${name} (${email}).`,
    ].join('\n');

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Project Inquiry</title>
</head>
<body style="margin: 0; padding: 32px 16px; background-color: #09080B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F8F4F0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #151216; border-radius: 16px; border: 1px solid rgba(248, 244, 240, 0.12); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
    <!-- Header -->
    <tr>
      <td style="padding: 28px 32px; background: linear-gradient(135deg, #1C090C 0%, #09080B 100%); border-bottom: 2px solid #FF4A16;">
        <span style="font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #FF4A16;">PORTFOLIO INQUIRY</span>
        <h1 style="margin: 8px 0 0 0; font-size: 22px; font-weight: 700; color: #F8F4F0; line-height: 1.3;">
          New Project Signal from <span style="color: #FF4A16;">${safeName}</span>
        </h1>
      </td>
    </tr>

    <!-- Details Table -->
    <tr>
      <td style="padding: 28px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size: 14px; line-height: 1.6;">
          <tr>
            <td style="padding: 8px 0; color: #B8AEB0; width: 140px; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Client Name</td>
            <td style="padding: 8px 0; color: #F8F4F0; font-weight: 600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B8AEB0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Email Address</td>
            <td style="padding: 8px 0;"><a href="mailto:${safeEmail}" style="color: #FF4A16; text-decoration: none; font-weight: 600;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B8AEB0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Phone Number</td>
            <td style="padding: 8px 0; color: #F8F4F0;">${safePhone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B8AEB0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Service Required</td>
            <td style="padding: 8px 0;"><span style="display: inline-block; padding: 4px 10px; background-color: rgba(255,74,22,0.12); border: 1px solid rgba(255,74,22,0.3); border-radius: 6px; color: #FF6B35; font-size: 12px; font-weight: 600;">${safeService}</span></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #B8AEB0; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: 0.08em;">Date & Time</td>
            <td style="padding: 8px 0; color: #B8AEB0; font-size: 12px;">${submissionDate}</td>
          </tr>
        </table>

        <!-- Message Box -->
        <div style="margin-top: 24px; padding: 20px; background-color: #09080B; border: 1px solid rgba(248, 244, 240, 0.1); border-radius: 12px;">
          <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #B8AEB0; margin-bottom: 10px;">Project Scope & Goals:</div>
          <div style="color: #F8F4F0; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${safeMessage}</div>
        </div>

        <!-- Action CTA -->
        <div style="margin-top: 28px; text-align: center;">
          <a href="mailto:${safeEmail}?subject=Re:%20Project%20Inquiry%20-%20${encodeURIComponent(safeName)}" style="display: inline-block; padding: 12px 28px; background-color: #FF4A16; color: #FFFFFF; font-weight: 700; text-decoration: none; border-radius: 8px; font-size: 13px; letter-spacing: 0.04em;">Reply to ${safeName}</a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding: 16px 32px 24px 32px; text-align: center; font-size: 11px; color: #6E686A; border-top: 1px solid rgba(248, 244, 240, 0.06);">
        This inquiry was dispatched directly from your portfolio contact form.
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // 9. Send email via SMTP
    const mailOptions = {
      from: `"Yogesh Portfolio Contact Form" <${fromEmail}>`,
      to: toEmail,
      replyTo: `"${name}" <${email}>`,
      subject: `Project Inquiry: ${name} ${service ? `[${service}]` : ''}`,
      text: textBody,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully! I will get back to you shortly.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Log detailed diagnostics server-side only
    console.error('[Contact API] Failed to send email via SMTP:', {
      message: error?.message,
      code: error?.code,
      command: error?.command,
    });

    // Return safe, user-friendly error without leaking SMTP stack traces
    return NextResponse.json(
      {
        success: false,
        error:
          'Could not send message through the email server at this time. Please try again or email directly.',
      },
      { status: 500 }
    );
  }
}
