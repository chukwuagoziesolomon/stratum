import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { syncInvestmentProgress } from "@/lib/portfolio";

export async function GET() {
  try {
    await syncInvestmentProgress();
    return NextResponse.json({ success: true, message: "Investment progress synced" });
  } catch (error) {
    console.error("Cron sync error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
