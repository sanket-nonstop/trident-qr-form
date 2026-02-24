import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { firstName, lastName } = await request.json();

    // Basic validation
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content (Text-only as requested)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Vijay@tridentgroup.au',
      subject: 'Site Induction Form Submission',
      text: `Site Induction Completed

First Name: ${firstName}
Last Name: ${lastName}

User confirmed:
- Watched induction video
- Agrees to follow safety measures`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. please check connection or credentials.' },
      { status: 500 }
    );
  }
}
