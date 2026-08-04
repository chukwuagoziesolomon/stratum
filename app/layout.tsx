import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "AeroneX Oil & Gas Investment Platform",
    template: "%s | AeroneX",
  },
  description:
    "AeroneX Oil & Gas is an investment platform giving investors direct access to upstream opportunities and transparent portfolio insights.",
  keywords: [
    "oil and gas investment",
    "energy fund",
    "upstream investing",
    "AeroneX",
    "investment platform",
    "portfolio",
    "distributions",
    "digital asset fund",
    "crypto investing",
  ],
  authors: [{ name: "AeroneX" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "AeroneX",
    title: "AeroneX Oil & Gas Investment Platform",
    description:
      "AeroneX Oil & Gas is an investment platform giving investors direct access to upstream opportunities and transparent portfolio insights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AeroneX Oil & Gas Investment Platform",
    description:
      "AeroneX Oil & Gas is an investment platform giving investors direct access to upstream opportunities and transparent portfolio insights.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-petrol">
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
