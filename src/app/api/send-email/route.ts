import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

function isEmail(value: string) {
  return typeof value === "string" && /^\S+@\S+\.\S+$/.test(value);
}

function sanitizeText(value: string) {
  if (typeof value !== "string") return "";
  // keep it simple—trim and remove null bytes
  return value.replace(/\0/g, "").trim();
}

async function verifyRecaptcha({ token }: { token: string }) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    return {
      ok: false,
      reason: "Server misconfigured: missing recaptcha secret",
    };
  }

  if (!token || typeof token !== "string") {
    return { ok: false, reason: "Missing captcha token" };
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret,
      response: token,
    }),
  });

  const data = await res.json();

  if (!data?.success) {
    return { ok: false, reason: "Captcha verification failed" };
  }

  // If reCAPTCHA v3 is used, score may exist. Be conservative.
  if (typeof data.score === "number" && data.score < 0.3) {
    return { ok: false, reason: "Captcha score too low" };
  }

  return { ok: true };
}

function buildTextBody(payload: {
  fullname: string;
  companyname: string;
  email: string;
  phonenumber: string;
  enquiryType: string;
  subject: string;
  token: string;
}) {
  const lines = [
    "New Contact Inquiry (NONSTOP Distributors)",
    "----------------------------------------",
    `Full name: ${payload.fullname}`,
    `Company: ${payload.companyname || "-"}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phonenumber}`,
    `Enquiry type: ${payload.enquiryType}`,
    "",
    "Message:",
    payload.subject,
  ];

  return lines.join("\n");
}

function buildHtmlBody(payload: {
  fullname: string;
  companyname: string;
  email: string;
  phonenumber: string;
  enquiryType: string;
  subject: string;
}) {
  const esc = (s: string | number | boolean | null | undefined) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.5;">
    <h2 style="margin:0 0 12px;">New Contact Inquiry</h2>
    <p style="margin:0 0 12px;color:#333;">
      You received a new inquiry from <strong>${esc(payload.fullname)}</strong>.
    </p>
    <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr><td><strong>Full name</strong></td><td>${esc(payload.fullname)}</td></tr>
      <tr><td><strong>Company</strong></td><td>${esc(payload.companyname || "-")}</td></tr>
      <tr><td><strong>Email</strong></td><td>${esc(payload.email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${esc(payload.phonenumber)}</td></tr>
      <tr><td><strong>Enquiry type</strong></td><td>${esc(payload.enquiryType)}</td></tr>
    </table>
    <h3 style="margin:18px 0 8px;">Message</h3>
    <div style="white-space:pre-wrap;border:1px solid #eee;padding:12px;border-radius:8px;">
      ${esc(payload.subject)}
    </div>
  </div>
  `;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "").toLowerCase() === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const servername = process.env.SMTP_SERVERNAME;

  if (!host || !user || !pass) {
    throw new Error(
      "Server misconfigured: missing SMTP settings (SMTP_HOST, SMTP_USER, SMTP_PASS)",
    );
  }

  const options = {
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
    tls: {
      rejectUnauthorized: false,
      ...(servername && { servername }),
    },
  };

  return nodemailer.createTransport(options);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (process.env.NODE_ENV === "development") {
      console.log("[send-email] Captcha field check", {
        hasCaptchaToken: Boolean(body?.captchaToken),
        hasToken: Boolean(body?.token),
      });
    }

    const payload = {
      firstName: sanitizeText(body?.firstName),
      lastName: sanitizeText(body?.lastName),
      email: sanitizeText(body?.email),
      token: body?.captchaToken || body?.token,
    };

    if (!payload.firstName) {
      return NextResponse.json(
        { success: false, message: "First name is required" },
        { status: 400 },
      );
    }

    if (!payload.lastName) {
      return NextResponse.json(
        { success: false, message: "Last name is required" },
        { status: 400 },
      );
    }

    if (!isEmail(payload.email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required" },
        { status: 400 },
      );
    }
// // Verify reCAPTCHA
    const captcha = await verifyRecaptcha({ token: payload.token });
    if (!captcha.ok) {
      return NextResponse.json(
        { success: false, message: captcha.reason || "Captcha failed" },
        { status: 400 },
      );
    }

    const to = process.env.CONTACT_EMAIL;
    const from = process.env.CONTACT_EMAIL;
    if (!to || !from) {
      return NextResponse.json(
        {
          success: false,
          message: "Server misconfigured: set CONTACT_EMAIL in environment",
        },
        { status: 500 },
      );
    }

    const mailOptions = {
      to,
      from,
      replyTo: payload.email,
      subject: "Trident Group Induction Form Submission",
      // text: buildTextBody(payload),
      html: `<table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, Helvetica, sans-serif; background:#f6f7fb; padding:20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">

    <!-- Header -->
    <tr>
      <td style="background:#1e3a8a; color:#ffffff; padding:20px; text-align:center;">
        <h2 style="margin:0;">Trident Group</h2>
        <p style="margin:5px 0 0; font-size:14px;">Induction Completion Confirmation</p>
      </td>
    </tr>

    <!-- Content -->
    <tr>
      <td style="padding:30px;">
        <p style="margin-top:0; font-size:15px;">
          A user has successfully completed the <strong>Trident Group Safety Induction</strong>.
        </p>

        <table width="100%" cellpadding="8" cellspacing="0" style="margin-top:15px; border-collapse:collapse;">
          <tr style="background:#f3f4f6;">
            <td width="40%"><strong>First Name</strong></td>
            <td>${payload.firstName}</td>
          </tr>
          <tr>
            <td><strong>Last Name</strong></td>
            <td>${payload.lastName}</td>
          </tr>
          <tr style="background:#f3f4f6;">
            <td><strong>Email</strong></td>
            <td>${payload.email}</td>
          </tr>
        </table>

        <p style="margin-top:25px;"><strong>User Confirmation:</strong></p>

        <ul style="padding-left:18px; margin-top:10px; font-size:14px;">
          <li>Watched the induction safety video</li>
          <li>Agreed to comply with all safety measures and guidelines</li>
        </ul>

        <p style="margin-top:25px; font-size:14px; color:#555;">
          This confirmation indicates that the user understands and accepts the safety procedures required by Trident Group.
        </p>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f3f4f6; text-align:center; padding:15px; font-size:12px; color:#666;">
        © ${new Date().getFullYear()} Trident Group. All rights reserved.
      </td>
    </tr>

  </table>
</td>

  </tr>
</table>
`,
    };

    const transporter = getTransporter();
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    const isDev = process.env.NODE_ENV === "development";
    const message =
      isDev && err.message
        ? err.message
        : "Something went wrong. Please try again.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
