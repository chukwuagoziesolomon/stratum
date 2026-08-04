import { NextResponse } from "next/server";

export async function GET() {
  const depositWalletAddress = process.env.CRYPTO_DEPOSIT_WALLET_ADDRESS || null;
  const depositWalletCoin = process.env.CRYPTO_DEPOSIT_WALLET_COIN || "BNB";
  const depositWalletNetwork = process.env.CRYPTO_DEPOSIT_WALLET_NETWORK || "BNB Smart Chain";
  return NextResponse.json({ depositWalletAddress, depositWalletCoin, depositWalletNetwork });
}
