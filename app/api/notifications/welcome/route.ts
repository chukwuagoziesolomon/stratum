import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email || !name) {
      return NextResponse.json({ error: "Email and name are required" }, { status: 400 });
    }

    const html = `
      <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
          <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">Welcome to AeroneX Oil & Gas</h1>
          </div>
          <div style="padding: 28px 32px;">
            <p style="margin: 0 0 16px; font-size: 16px;">Hi ${name},</p>
            <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">Your account is now active. You may fund it using the crypto deposit wallet configured in your dashboard.</p>
            <div style="background: #f2f5fb; border-radius: 12px; padding: 16px; margin: 0 0 20px;">
              <p style="margin: 0; font-weight: 700;">What happens next</p>
              <p style="margin: 8px 0 0; font-size: 15px; line-height: 1.6;">Once your first deposit clears, your holdings and performance will appear in your account immediately.</p>
            </div>
            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">If you have any questions, our support team is ready to help.</p>
            <p style="margin: 0; font-size: 16px;">Thanks,<br/>The AeroneX Team</p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Welcome to AeroneX Oil & Gas",
      html,
      text: `Hi ${name},\n\nWelcome to AeroneX Oil & Gas. Your account is active and can be funded through the crypto deposit wallet in your dashboard.\n\nOnce your first deposit clears, holdings and performance will display in your account.\n\nThanks,\nThe AeroneX Team`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send welcome email" }, { status: 500 });
  }
}
