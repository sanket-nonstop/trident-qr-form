import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName /*, captchaToken */ } = await request.json();

    // Basic validation
    if (!firstName || !lastName /* || !captchaToken */) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    /*
    // Verify reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const verifyResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`,
      { method: 'POST' }
    );
    const verifyData = await verifyResponse.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      );
    }
    */

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content (Text-only)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sanketc.nonstop@gmail.com',
      // to: 'Vijay@tridentgroup.au',
      subject: 'Trident Group Induction Form Submission',
      text: `Trident Group Induction Completed

First Name: ${firstName}
Last Name: ${lastName}

User confirmed:
- Watched induction video
- Agrees to follow safety measures`,
    };

    // Send email
    const response = await transporter.sendMail(mailOptions);
    // console.log(response);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    // console.error(error);
    return NextResponse.json(
      { error: 'Failed to send email. please check connection or credentials.' },
      { status: 500 }
    );
  }
}
