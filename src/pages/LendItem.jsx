import { useState } from "react";
import { createLendRecord, createMoneyRecord, formatMoney, qrSrcFor } from "../data/borrowSafeStore";

const LendItem = () => {
  const [mode, setMode] = useState("item"); // item | money
  const [form, setForm] = useState({
    itemName: "",
    borrowerName: "",
    ownerName: "",
    returnDate: "",
  });
  const [moneyForm, setMoneyForm] = useState({
    amount: "",
    currency: "INR",
    note: "",
    borrowerName: "",
    ownerName: "",
    returnDate: "",
  });
  const [generated, setGenerated] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleMoneyChange = (e) => {
    const { name, value } = e.target;
    setMoneyForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "money") {
      const rec = createMoneyRecord(moneyForm);
      setGenerated(rec);
      setMoneyForm({
        amount: "",
        currency: "INR",
        note: "",
        borrowerName: "",
        ownerName: "",
        returnDate: "",
      });
      return;
    }
    const rec = createLendRecord(form);
    setGenerated(rec);
    setForm({
      itemName: "",
      borrowerName: "",
      ownerName: "",
      returnDate: "",
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Lend</h1>
            <p className="mt-1 text-sm text-slate-300">
              Main feature: lend <span className="font-semibold text-white">Money</span> or an item with proof code + QR.
            </p>
          </div>
          <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode("money")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                mode === "money"
                  ? "bg-gradient-to-r from-emerald-400 to-indigo-500 text-slate-950"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              Money
            </button>
            <button
              type="button"
              onClick={() => setMode("item")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                mode === "item"
                  ? "bg-gradient-to-r from-emerald-400 to-indigo-500 text-slate-950"
                  : "text-slate-200 hover:text-white"
              }`}
            >
              Item
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-slate-300">
          Generate a shareable code/QR that acts as a lightweight contract key.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {mode === "money" ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-200">Amount</label>
                  <input
                    name="amount"
                    type="number"
                    min="1"
                    value={moneyForm.amount}
                    onChange={handleMoneyChange}
                    required
                    placeholder="500"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-200">Currency</label>
                  <select
                    name="currency"
                    value={moneyForm.currency}
                    onChange={handleMoneyChange}
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm text-slate-200">Reason / Note (optional)</label>
                <input
                  name="note"
                  value={moneyForm.note}
                  onChange={handleMoneyChange}
                  placeholder="Emergency travel, lunch, rent..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-200">Borrower name</label>
                <input
                  name="borrowerName"
                  value={moneyForm.borrowerName}
                  onChange={handleMoneyChange}
                  placeholder="Ajay / Dev / Team mate"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-200">Your name (lender)</label>
                  <input
                    name="ownerName"
                    value={moneyForm.ownerName}
                    onChange={handleMoneyChange}
                    placeholder="You / Rahul"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-200">Return date</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={moneyForm.returnDate}
                    onChange={handleMoneyChange}
                    required
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm text-slate-200">Item name</label>
                <input
                  name="itemName"
                  value={form.itemName}
                  onChange={handleChange}
                  required
                  placeholder="Charger, Helmet, Book..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-200">Borrower name</label>
                <input
                  name="borrowerName"
                  value={form.borrowerName}
                  onChange={handleChange}
                  placeholder="Ajay / Dev / Team mate"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm text-slate-200">Your name (owner)</label>
                  <input
                    name="ownerName"
                    value={form.ownerName}
                    onChange={handleChange}
                    placeholder="You / Rahul"
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-200">Return date</label>
                  <input
                    type="date"
                    name="returnDate"
                    value={form.returnDate}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-indigo-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
          >
            Generate borrow code
          </button>
          {mode === "money" && moneyForm.amount && (
            <p className="text-xs text-slate-400">
              Preview: {formatMoney(moneyForm.amount, moneyForm.currency)} due on{" "}
              <span className="text-slate-300">{moneyForm.returnDate || "—"}</span>
            </p>
          )}
        </form>
      </div>

      {generated && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white">Share This Code</h2>
          <p className="mt-1 text-sm text-slate-300">
            The borrower will confirm using the same code.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
            <img
              src={qrSrcFor(generated.code)}
              alt="Borrow QR"
              className="h-40 w-40 rounded-xl border border-white/10 bg-white/5 p-2"
            />
            <div>
              <p className="text-sm text-slate-300">
                Code: <span className="font-semibold text-white">{generated.code}</span>
              </p>
              {generated.type === "money" ? (
                <p className="text-sm text-slate-300">
                  Money:{" "}
                  <span className="font-semibold text-white">
                    {formatMoney(generated.amount, generated.currency)}
                  </span>
                  {generated.note ? (
                    <span className="text-slate-400"> · {generated.note}</span>
                  ) : null}
                </p>
              ) : (
                <p className="text-sm text-slate-300">
                  Item:{" "}
                  <span className="font-semibold text-white">{generated.itemName}</span>
                </p>
              )}
              <p className="text-sm text-slate-300">
                Return by:{" "}
                <span className="font-semibold text-white">{generated.returnDate}</span>
              </p>
              <div className="mt-3 text-xs text-slate-400">
                Tip: Long-press on mobile or right-click to save the QR and share.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LendItem;


