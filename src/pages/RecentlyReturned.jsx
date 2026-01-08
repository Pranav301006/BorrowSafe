import { useEffect, useState } from "react";
import { loadRecords, formatMoney } from "../data/borrowSafeStore";

const RecentlyReturned = () => {
  const [returned, setReturned] = useState([]);

  useEffect(() => {
    const all = loadRecords();
    const done = all
      .filter((r) => r.status === "returned")
      .sort((a, b) => new Date(b.returnedOn || b.returnDate) - new Date(a.returnedOn || a.returnDate));
    setReturned(done);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-white">Recently Returned</h1>
        <p className="mt-1 text-sm text-slate-300">
          All items and money that have been returned. This is your private trust ledger.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {returned.length === 0 && (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/5 px-4 py-10 text-center text-slate-300">
            No returned items or money yet.
          </div>
        )}

        {returned.map((r) => {
          const isMoney = r.type === "money";
          const title = isMoney ? formatMoney(r.amount, r.currency) : r.itemName;
          const label = isMoney ? "Money" : "Item";

          return (
            <div
              key={r.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="text-lg font-semibold text-white">{title}</p>
                  {isMoney && r.note && (
                    <p className="mt-1 text-xs text-slate-400 italic">"{r.note}"</p>
                  )}
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                  ✅ Returned
                </span>
              </div>

              <div className="space-y-1 text-sm text-slate-300">
                <p>
                  <span className="text-slate-400">Owner:</span> {r.ownerName || "—"}
                </p>
                <p>
                  <span className="text-slate-400">Borrower:</span> {r.borrowerName || "—"}
                </p>
                <p>
                  <span className="text-slate-400">Borrowed:</span> {r.borrowDate}
                </p>
                <p>
                  <span className="text-slate-400">Returned:</span> {r.returnedOn || r.returnDate}
                </p>
              </div>

              <div className="mt-auto pt-2 text-xs text-slate-400">
                Code: <span className="font-semibold text-white">{r.code}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyReturned;

