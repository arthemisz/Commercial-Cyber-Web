import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, subject, description, skills, deadline, budget } = body;

    // Validate required fields
    if (!name || !email || !subject || !description || !skills) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Try to load nodemailer dynamically (avoids build-time resolution)
    let nodemailer: any = null;
    try {
      nodemailer = await (eval('import("nodemailer")') as Promise<any>);
    } catch {
      console.warn('Nodemailer not installed, falling back to console log.');
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, BUSINESS_EMAIL } = process.env;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Hiring Request</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Company:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${company || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${subject}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Skills Needed:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${skills}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Deadline:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${deadline || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Budget:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${budget || 'N/A'}</td></tr>
        </table>
        <h3>Description:</h3>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${description}</p>
      </div>
    `;

    if (nodemailer && SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && BUSINESS_EMAIL) {
      try {
        const transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: parseInt(SMTP_PORT, 10),
          secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: SMTP_USER, // sender address
          replyTo: email, // reply-to address
          to: BUSINESS_EMAIL, // receiver address
          subject: `[New Hiring Request] ${subject}`,
          html: htmlContent,
        });

        console.log('Hiring request email sent successfully.');
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Fallback to logging if email fails
        console.log('Hiring Request Details (Email Failed):', body);
      }
    } else {
      // Fallback: Just log it
      console.log('SMTP not configured or nodemailer missing. Logging request:');
      console.log('Hiring Request Details:', body);
    }

    return NextResponse.json(
      { success: true, message: 'Hiring request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in hire route:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
