import nodemailer from "nodemailer";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const emailHost = process.env.EMAIL_HOST || "mail.privateemail.com";
const emailPort = Number(process.env.EMAIL_PORT || 465);
const emailSecure = process.env.EMAIL_SECURE === "true" || emailPort === 465;
const rejectUnauthorized = process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== "false";

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: process.env.EMAIL_USERNAME
    ? {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      }
    : undefined,
  requireTLS: true,
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 15000,
  tls: {
    rejectUnauthorized,
  },
});

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT) {
    throw new Error("Email transport is not configured");
  }

  if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email credentials are not configured");
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "AeroneX Oil & Gas <no-reply@aeronex.com>",
      to,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
}
