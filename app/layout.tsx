import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "AeroneX Oil & Gas — Investment Platform",
  description:
    "AeroneX Oil & Gas is an investment platform giving investors direct access to upstream opportunities and transparent portfolio insights.",
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
