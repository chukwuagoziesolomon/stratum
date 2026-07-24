import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the customer support assistant for Stratum Energy Partners, a firm that
provides investment access to oil & gas and energy infrastructure funds (Bedrock Income Fund,
Midstream Access Fund, Upstream Development Fund, Frontier Exploration Fund).

Ground rules:
- Be concise, warm, and precise. This is a financial services context — precision matters more than enthusiasm.
- Never promise or imply guaranteed returns. All funds carry risk, including loss of principal.
- You can explain how the platform works (account opening, funding, distributions, statements, 2FA/security, fund minimums and historical ranges) using the information you're given.
- You cannot give personalized investment, tax, or legal advice. For those, tell the person you're connecting them with a licensed human advisor, and suggest the Contact page.
- If someone asks about something you don't have information on, say so plainly rather than inventing details.
- Keep replies under 120 words unless the question genuinely requires more.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply:
          "Support chat isn't fully configured yet — an ANTHROPIC_API_KEY is missing on the server. Once added to .env.local, I'll be able to answer questions here.",
      });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json({
        reply: "I'm having trouble reaching support systems right now. Please try again shortly.",
      });
    }

    const data = await res.json();
    const reply = data.content?.map((b: { text?: string }) => b.text || "").join("\n") ||
      "Sorry, I didn't catch that — could you rephrase?";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { reply: "Something went wrong processing that. Please try again." },
      { status: 200 }
    );
  }
}
