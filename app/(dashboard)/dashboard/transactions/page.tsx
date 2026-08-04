"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

type Transaction = {
  label: string;
  date: string;
  type: string;
  amount: string;
};

type User = {
  name: string;
  email: string;
  crypto_payout_address?: string;
} | null;

function formatCurrency(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<User>(null);
  const [depositWalletAddress, setDepositWalletAddress] = useState<string | null>(null);
  const [depositWalletCoin, setDepositWalletCoin] = useState<string>("BNB");
  const [depositWalletNetwork, setDepositWalletNetwork] = useState<string>("BNB Smart Chain");
  const [activeAction, setActiveAction] = useState<"deposit" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawalCoin, setWithdrawalCoin] = useState("BNB");
  const [withdrawalNetwork, setWithdrawalNetwork] = useState("BNB Smart Chain");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setWalletAddress(data.user.crypto_payout_address || "");
        }
      })
      .catch(() => {});

    fetch('/api/crypto/deposit-wallet')
      .then((r) => r.json())
      .then((data) => {
        setDepositWalletAddress(data.depositWalletAddress || null);
        setDepositWalletCoin(data.depositWalletCoin || "BNB");
        setDepositWalletNetwork(data.depositWalletNetwork || "BNB Smart Chain");
      })
      .catch(() => {
        setDepositWalletAddress(null);
        setDepositWalletCoin("BNB");
        setDepositWalletNetwork("BNB Smart Chain");
      });
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    try {
      const res = await fetch('/api/transactions');
      const data = await res.json();
      setTransactions(data);
    } catch {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }

  function validateAmount(value: string) {
    const parsed = Number(value.replace(/[^0-9.-]/g, ""));
    return !Number.isNaN(parsed) && parsed > 0;
  }

  async function handleSubmit(action: "deposit" | "withdraw") {
    setError(null);
    setMessage(null);

    if (!validateAmount(amount)) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    if (action === "deposit" && !depositWalletAddress) {
      setError("No deposit wallet is configured by the administrator.");
      return;
    }

    if (action === "withdraw" && !walletAddress) {
      setError("Your payout wallet address is required to withdraw funds.");
      return;
    }
    if (action === 'withdraw' && !withdrawalCoin) {
      setError("Please select the coin for your withdrawal.");
      return;
    }

    if (action === 'withdraw' && !withdrawalNetwork) {
      setError("Please select the network for your withdrawal.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: action === 'deposit' ? 'Deposit' : 'Withdrawal',
          amount,
          payoutWalletAddress: walletAddress,
          walletCoin: action === 'deposit' ? depositWalletCoin : withdrawalCoin,
          walletNetwork: action === 'deposit' ? depositWalletNetwork : withdrawalNetwork,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Unable to submit transaction.');
      }

      setMessage(`${action === 'deposit' ? 'Deposit' : 'Withdrawal'} request recorded successfully.`);
      setAmount('');
      setActiveAction(null);
      fetchTransactions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-brass">Transactions</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink-high md:text-3xl">
        Move money in and out.
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveAction(activeAction === 'deposit' ? null : 'deposit')}
          className={`flex items-center justify-center gap-2 rounded-md border px-4 py-4 font-display text-sm font-medium transition ${
            activeAction === 'deposit'
              ? 'border-brass bg-brass/10 text-brass'
              : 'border-petrol-line text-ink-high hover:border-brass/50'
          }`}
        >
          <ArrowDownToLine size={16} /> Add funds
        </button>

        <button
          type="button"
          onClick={() => setActiveAction(activeAction === 'withdraw' ? null : 'withdraw')}
          className={`flex items-center justify-center gap-2 rounded-md border px-4 py-4 font-display text-sm font-medium transition ${
            activeAction === 'withdraw'
              ? 'border-brass bg-brass/10 text-brass'
              : 'border-petrol-line text-ink-high hover:border-brass/50'
          }`}
        >
          <ArrowUpFromLine size={16} /> Withdraw
        </button>
      </div>

      {activeAction && (
        <div className="mt-6 rounded-md border border-petrol-line bg-petrol-panel p-6">
          <h2 className="font-display text-lg font-semibold text-ink-high">
            {activeAction === 'deposit' ? 'Deposit crypto funds' : 'Withdraw crypto profits'}
          </h2>
          <div className="mt-4 space-y-4">
            {activeAction === 'deposit' && (
              <div className="rounded-sm border border-petrol-line bg-petrol px-4 py-4">
                <p className="font-display text-sm font-medium text-ink-high">Deposit wallet address</p>
                <p className="mt-2 font-mono text-sm text-ink-soft">
                  Send crypto deposits to the platform wallet configured by the administrator.
                </p>
                <div className="mt-3 rounded-sm border border-petrol-line bg-ink-high/5 px-3 py-3 font-mono text-sm text-ink-high">
                  {depositWalletAddress || 'Not configured yet'}
                </div>
                <div className="mt-3 space-y-2 text-sm text-ink-soft">
                  <div><strong>Coin:</strong> {depositWalletCoin}</div>
                  <div><strong>Network:</strong> {depositWalletNetwork}</div>
                </div>
              </div>
            )}

            {activeAction === 'withdraw' && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Coin</label>
                    <select
                      value={withdrawalCoin}
                      onChange={(e) => setWithdrawalCoin(e.target.value)}
                      className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol px-4 py-3 font-body text-sm text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
                    >
                      <option value="BNB">BNB</option>
                      <option value="ETH">ETH</option>
                      <option value="USDT">USDT</option>
                      <option value="BTC">BTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Network</label>
                    <select
                      value={withdrawalNetwork}
                      onChange={(e) => setWithdrawalNetwork(e.target.value)}
                      className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol px-4 py-3 font-body text-sm text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
                    >
                      <option value="BNB Smart Chain">BNB Smart Chain</option>
                      <option value="Ethereum">Ethereum</option>
                      <option value="Polygon">Polygon</option>
                      <option value="Bitcoin">Bitcoin</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="font-display text-sm font-medium text-ink-high">Your payout wallet</p>
                  <input
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full rounded-sm border border-petrol-line bg-petrol px-4 py-3 font-body text-sm text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
                  />
                  <p className="text-sm text-ink-soft">
                    This is the wallet address where withdrawals and profit distributions will be sent.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="font-display text-xs uppercase tracking-wider text-ink-muted">Amount</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="mt-2 w-full rounded-sm border border-petrol-line bg-petrol px-4 py-3 font-body text-sm text-ink-high focus:outline-none focus:ring-1 focus:ring-brass"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleSubmit(activeAction)}
                  className="w-full rounded-md bg-brass px-4 py-3 font-display text-sm font-medium text-petrol transition hover:bg-brass-light disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : activeAction === 'deposit' ? 'Record Deposit' : 'Request Withdrawal'}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-md border border-petrol-line bg-petrol-panel">
        <table className="w-full text-left">
          <thead>
            <tr className="font-mono text-xs uppercase tracking-wider text-ink-soft">
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="font-body text-sm">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-ink-muted">
                  Loading transactions...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-ink-muted">
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.map((t, i) => (
                <tr key={`${t.label}-${i}`} className="border-t border-petrol-line/60">
                  <td className="px-6 py-4 text-ink-high">{t.label}</td>
                  <td className="px-6 py-4 text-ink-muted">{t.type}</td>
                  <td className="px-6 py-4 font-mono text-xs text-ink-soft">{t.date}</td>
                  <td className={`px-6 py-4 font-mono ${t.amount.startsWith("-") ? "text-red-400" : "text-emerald-400"}`}>{t.amount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
