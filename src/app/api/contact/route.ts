import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required fields.' },
        { status: 400 }
      );
    }

    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: 'ScratchCode Contact <onboarding@resend.dev>', // Use verified domain here in production
      to: ['hjharshjain2004@gmail.com'], // Resend onboarding only allows sending to the verified owner email
      replyTo: email, // So you can reply directly to the user
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send the email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Email sent successfully!', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
