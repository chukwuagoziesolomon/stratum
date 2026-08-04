"use client";

import { useState } from "react";

interface InvestmentPurchaseProps {
  availableBalance: number;
}

export default function InvestmentPurchase({ availableBalance }: InvestmentPurchaseProps) {
  const [amount, setAmount] = useState(availableBalance ? availableBalance.toFixed(2) : "0.00");
  const [status, setStatus] = useState<string | null>(null);

  const handlePurchase = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const numericAmount = Number(amount.replace(/[^0-9.]/g, ""));

    if (!numericAmount || numericAmount <= 0) {
      setStatus("Enter a valid purchase amount.");
      return;
    }

    if (numericAmount > availableBalance) {
      setStatus("Amount exceeds available balance.");
      return;
    }

    setStatus(`Purchase request submitted for $${numericAmount.toFixed(2)}.`);
  };

  return (
    <div className="rounded-md border border-petrol-line bg-petrol-panel p-6">
      <h2 className="font-display text-base font-semibold text-ink-high">Invest funds</h2>
      <p className="mt-2 font-body text-sm text-ink-soft">
        Use your available approved balance to purchase an investment plan.
      </p>
      <form onSubmit={handlePurchase} className="mt-4 space-y-4">
        <label className="block text-sm font-medium text-ink-high">
          Amount
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="mt-2 w-full rounded-md border border-petrol-line bg-slate-950/5 px-3 py-2 text-sm text-ink-high outline-none transition focus:border-brass"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-sm bg-brass px-4 py-2 text-sm font-medium text-white transition hover:bg-brass/90"
        >
          Purchase
        </button>
        {status ? <p className="font-mono text-sm text-ink-soft">{status}</p> : null}
      </form>
    </div>
  );
}
