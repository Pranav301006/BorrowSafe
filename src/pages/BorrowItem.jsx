import { useState } from "react";
import { confirmBorrow, findByCode, formatMoney, qrSrcFor } from "../data/borrowSafeStore";

const BorrowItem = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleLookup = () => {
    setMessage("");
    if (!code.trim()) return;
    const rec = findByCode(code.trim());
    if (!rec) {
      setPreview(null);
      setMessage("No record found for that code.");
      return;
    }
    setPreview(rec);
  };

  const handleConfirm = () => {
    setMessage("");
    if (!code.trim()) return;
    const rec = confirmBorrow(code.trim(), name.trim());
    if (!rec) {
      setMessage("Could not confirm. Check the code again.");
      return;
    }
    setPreview(rec);
    setMessage("Borrow confirmed. Both sides now have proof.");
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">Borrow (Item / Money)</h1>
        <p className="mt-1 text-sm text-slate-300">
          Enter the code shared by the lender (works for both items and money).
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code e.g., BS-12AB34"
            className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
          />
          <button
            onClick={handleLookup}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:border-white/30"
          >
            Preview
          </button>
        </div>
      </div>

      {preview && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white">Confirm Borrow</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[160px_1fr]">
            <img
              src={qrSrcFor(preview.code)}
              alt="Borrow QR"
              className="h-40 w-40 rounded-xl border border-white/10 bg-white/5 p-2"
            />
            <div className="space-y-1">
              <p className="text-sm text-slate-300">
                Code: <span className="font-semibold text-white">{preview.code}</span>
              </p>
              {preview.type === "money" ? (
                <p className="text-sm text-slate-300">
                  Money:{" "}
                  <span className="font-semibold text-white">
                    {formatMoney(preview.amount, preview.currency)}
                  </span>
                  {preview.note ? (
                    <span className="text-slate-400"> · {preview.note}</span>
                  ) : null}
                </p>
              ) : (
                <p className="text-sm text-slate-300">
                  Item: <span className="font-semibold text-white">{preview.itemName}</span>
                </p>
              )}
              <p className="text-sm text-slate-300">
                Owner: <span className="font-semibold text-white">{preview.ownerName}</span>
              </p>
              <p className="text-sm text-slate-300">
                Return by:{" "}
                <span className="font-semibold text-white">{preview.returnDate}</span>
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name to attach to the record"
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none"
            />
            <button
              onClick={handleConfirm}
              className="rounded-xl bg-gradient-to-r from-indigo-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-indigo-500/20 hover:opacity-95"
            >
              Confirm Borrow
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className="rounded-2xl border border-white/10 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          {message}
        </div>
      )}
    </div>
  );
};

export default BorrowItem;


