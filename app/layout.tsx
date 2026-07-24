import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Stratum Energy Partners — Oil & Gas Investment Firm",
  description:
    "Stratum Energy Partners is an oil & gas investment firm giving investors direct access to upstream drilling, midstream pipelines, and downstream refining projects. Transparent, variable returns — no guarantees.",
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
