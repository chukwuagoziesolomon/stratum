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

function normalizeFrom(rawFrom?: string) {
  const value = String(rawFrom || "").trim().replace(/^"(.*)"$/s, "$1");
  if (!value) {
    return "AeroneX Oil & Gas <no-reply@aeronex.com>";
  }

  if (/<[^>]+@[^>]+>/.test(value)) {
    return value;
  }

  const emailMatch = value.match(/[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    const name = value.replace(emailMatch[0], "").trim();
    if (name) {
      return `${name} <${emailMatch[0]}`;
    }
    return emailMatch[0];
  }

  return "AeroneX Oil & Gas <no-reply@aeronex.com>";
}

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
    const fromHeader = normalizeFrom(process.env.EMAIL_FROM);
    const fromAddress = fromHeader.match(/<([^>]+)>/)?.[1] || fromHeader;

    await transporter.sendMail({
      from: fromHeader,
      to,
      subject,
      html,
      text,
      replyTo: process.env.SUPPORT_EMAIL || fromAddress,
      envelope: {
        from: fromAddress,
        to,
      },
    });
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
}
