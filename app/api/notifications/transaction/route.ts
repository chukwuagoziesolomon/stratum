import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, name, type, amount, walletAddress } = await request.json();
    if (!email || !name || !type || !amount) {
      return NextResponse.json({ error: "Missing required transaction email fields" }, { status: 400 });
    }

    const title = type === "Withdrawal" ? "Withdrawal request received" : "Deposit received";
    const action = type === "Withdrawal" ? "withdrawal" : "deposit";
    const walletDetails = type === "Withdrawal" ? `Your payout wallet: ${walletAddress}` : "Please use the admin deposit wallet address to fund your account.";

    const html = `
      <div style="font-family: system-ui, sans-serif; color: #0f0b08; background: #f7f8fb; padding: 24px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 16px; border: 1px solid #e7e9ed; overflow: hidden; box-shadow: 0 24px 60px rgba(15, 11, 8, 0.08);">
          <div style="background: #0f172a; padding: 24px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.02em;">${title}</h1>
          </div>
          <div style="padding: 28px 32px;">
            <p style="margin: 0 0 16px; font-size: 16px;">Hi ${name},</p>
            <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.7;">We have received your ${action} request for <strong>${amount}</strong>.</p>
            <div style="background: #f2f5fb; border-radius: 12px; padding: 16px; margin: 0 0 20px;">
              <p style="margin: 0 0 8px; font-weight: 700;">Details</p>
              <p style="margin: 0; font-size: 15px; line-height: 1.6;">${walletDetails}</p>
            </div>
            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7;">We’ll notify you when the transaction is confirmed and reflected in your account.</p>
            <p style="margin: 0; font-size: 16px;">Regards,<br/>The AeroneX Team</p>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: `AeroneX ${title}`,
      html,
      text: `Hi ${name},\n\nWe have received your ${action} request for ${amount}. ${walletDetails}\n\nWe will notify you once the transaction is confirmed and reflected in your account.\n\nRegards,\nThe AeroneX Team`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send transaction notification" }, { status: 500 });
  }
}
