import nodemailer from "nodemailer";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === "true",
  auth: process.env.EMAIL_USERNAME
    ? {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,
});

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT) {
    throw new Error("Email transport is not configured");
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "Stratum Energy <no-reply@stratum.energy>",
    to,
    subject,
    html,
    text,
  });
}
