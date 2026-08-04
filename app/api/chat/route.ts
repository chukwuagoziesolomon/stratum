import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `You are the customer support assistant for Stratum Energy Partners, a firm that
provides investment access to oil & gas and energy infrastructure funds (Bedrock Income Fund,
Midstream Access Fund, Upstream Development Fund, Frontier Exploration Fund), plus a separate,
optional Digital Asset Fund (crypto: BTC, ETH, and a small tokenized energy-royalty pilot sleeve).

Ground rules:
- Be concise, professional, and direct. Use polished language and avoid casual phrasing.
- Format answers in a clean markdown-style structure using **bold headlines**, short paragraphs, and bullet lists when helpful.
- Never promise or imply guaranteed returns. All funds carry risk, including loss of principal.
- The Digital Asset Fund is entirely separate from the oil & gas funds. Treat it as higher volatility and a different risk profile.
- If someone asks how oil & gas investing works in general (royalty vs working interests, upstream/midstream/downstream, sector risks, glossary terms), point them to the "How It Works" page (/oil-gas-investing) and summarize briefly.
- If someone asks about crypto, point them to the "Crypto" page (/crypto-investing) and lead with the volatility risk before anything else.
- You can explain platform processes (account opening, funding, distributions, statements, 2FA/security, fund minimums, performance reporting) using the information you're given.
- You cannot give personalized investment, tax, or legal advice. For those, tell the person you are connecting them with a licensed human advisor and suggest the Contact page.
- If you cannot answer clearly, say so plainly rather than inventing details.
- If the user needs direct support, say: **I'll connect you with a human advisor for the next step.**
- Keep replies under 80 words unless the question genuinely requires more.`;

function serializeMessages(messages: any[]) {
  return messages.map((message) => {
    const serialized: any = { role: message.role, content: message.content };
    if (message.reasoning_details) {
      serialized.reasoning_details = message.reasoning_details;
    }
    return serialized;
  });
}

function parseOpenRouterMessageContent(content: unknown) {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (typeof item === "object" && item !== null) {
          return (item as any).text || "";
        }
        return "";
      })
      .join("");
  }
  if (typeof content === "object" && content !== null) {
    return (content as any).text || "";
  }
  return "";
}

function containsUncertainty(reply: string): boolean {
  const uncertaintyPatterns = [
    /i'm not sure/i,
    /i don't know/i,
    /cannot answer/i,
    /unable to answer/i,
    /not sure/i,
    /unclear/i,
    /no information/i,
    /don't have/i,
  ];
  return uncertaintyPatterns.some((pattern) => pattern.test(reply));
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const openRouterApiKey = process.env.OPENROUTER_API_KEY || process.env.openruter_api_key;
    const serializedMessages = serializeMessages(messages || []);

    if (!openRouterApiKey) {
      const fallback = "Support chat isn't fully configured yet — an OPENROUTER_API_KEY is required on the server.";
      return NextResponse.json({ reply: fallback, fallback: true });
    }

    const lastUserMessage = serializedMessages.length
      ? String(serializedMessages[serializedMessages.length - 1].content).trim().toLowerCase()
      : "";

    const greetingPattern = /^(hi|hello|hey|good morning|good afternoon|good evening)[.!]?$/;
    if (greetingPattern.test(lastUserMessage)) {
      const greetingReply = "Hello! I'm the AeroneX support assistant. How can I help you with your account, funds, or support needs today?";
      return NextResponse.json({ reply: greetingReply, fallback: false });
    }

    const payload = {
      model: "nvidia/nemotron-nano-12b-v2-vl:free",
      reasoning: { enabled: true, effort: "low" },
      temperature: 0.2,
      max_tokens: 200,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...serializedMessages],
    };

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenRouter API error:", errText);
      return NextResponse.json({
        reply: "I'm having trouble reaching support systems right now. Please try again shortly.",
        fallback: true,
      });
    }

    const data = await res.json();
    const message = data?.choices?.[0]?.message;
    let reply = parseOpenRouterMessageContent(message?.content) ||
      "Sorry, I didn't catch that — could you rephrase?";
    const reasoningDetails = message?.reasoning_details || message?.reasoningDetails || null;

    if (containsUncertainty(reply)) {
      reply = "I'm not confident about that answer. I'll connect you with a human advisor who can help with your specific question.";
    }

    return NextResponse.json({ reply, reasoningDetails, fallback: containsUncertainty(reply) });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { reply: "Something went wrong processing that. Please try again.", fallback: true },
      { status: 200 }
    );
  }
}
