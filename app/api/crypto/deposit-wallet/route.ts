import { NextResponse } from "next/server";

export async function GET() {
  const depositWalletAddress = process.env.CRYPTO_DEPOSIT_WALLET_ADDRESS || null;
  return NextResponse.json({ depositWalletAddress });
}
