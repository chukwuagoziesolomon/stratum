import { NextResponse } from "next/server";

export async function GET() {
  const depositWalletAddress = process.env.CRYPTO_DEPOSIT_WALLET_ADDRESS || null;
  const depositWalletCoin = process.env.CRYPTO_DEPOSIT_WALLET_COIN || "USDT";
  const depositWalletNetwork = process.env.CRYPTO_DEPOSIT_WALLET_NETWORK || "TRON";
  return NextResponse.json({ depositWalletAddress, depositWalletCoin, depositWalletNetwork });
}
