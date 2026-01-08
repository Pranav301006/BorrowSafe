import { useEffect, useState } from "react";
import {
  getStatusBadge,
  markReturned,
  selectActive,
  daysLeft,
  simulateReminders,
  formatMoney,
} from "../data/borrowSafeStore";

const ActiveBorrows = () => {
  const [active, setActive] = useState([]);
  const [nudges, setNudges] = useState([]);

  const load = () => {
    setActive(selectActive());
  };

  useEffect(() => {
    load();
  }, []);

  const handleReturn = (id) => {
    markReturned(id);
    load();
  };

  const handleNudge = () => {
    const msgs = simulateReminders();
    setNudges(msgs);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Active Borrows</h1>
            <p className="text-sm text-slate-300">
              Color status: 🟢 Borrowed · 🟡 Due Soon · 🔴 Overdue
            </p>
          </div>
          <button
            onClick={handleNudge}
            className="rounded-xl bg-gradient-to-r from-emerald-400 to-indigo-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
          >
            Send polite reminders
          </button>
        </div>
      </div>

      {nudges.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          <p className="font-semibold">Reminder preview:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {nudges.map((n) => (
              <li key={n.id}>
                To {n.borrowerName || "borrower"}: {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {active.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-slate-300">
            No active borrows right now.
          </div>
        )}

        {active.map((record) => {
          const badge = getStatusBadge(record);
          const left = daysLeft(record.returnDate);
          const tone =
            left < 0
              ? "text-rose-200"
              : left <= 1
              ? "text-amber-200"
              : "text-emerald-200";
          const indicator = badge.indicator;
          const title =
            record.type === "money"
              ? `${formatMoney(record.amount, record.currency)}`
              : record.itemName;
          const subtitle =
            record.type === "money"
              ? `Money loan${record.note ? ` · ${record.note}` : ""}`
              : "Item";
          return (
            <div
              key={record.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner shadow-black/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm text-slate-300">{subtitle}</p>
                  <p className="text-lg font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-400">
                    Owner: {record.ownerName} · Borrower: {record.borrowerName || "—"}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.chip}`}>
                  {indicator} {badge.label}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <span className="rounded-full bg-white/5 px-3 py-1">
                  Borrowed on {record.borrowDate}
                </span>
                <span className="rounded-full bg-white/5 px-3 py-1">
                  Return by {record.returnDate}
                </span>
                <span className={`rounded-full px-3 py-1 ${tone}`}>
                  {left < 0 ? `${Math.abs(left)} day(s) overdue` : `${left} day(s) left`}
                </span>
                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-100">
                  Reminder:{" "}
                  {record.type === "money"
                    ? `“Quick nudge—${formatMoney(record.amount, record.currency)} is due ${record.returnDate} 😊”`
                    : `“Quick nudge—${record.itemName} is due ${record.returnDate} 😊”`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Code: <span className="font-semibold text-white">{record.code}</span>{" "}
                  · {record.borrowerConfirmed ? "Borrower confirmed ✅" : "Waiting confirm"}
                </div>
                <button
                  onClick={() => handleReturn(record.id)}
                  className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-white hover:border-emerald-300/60"
                >
                  Mark as returned
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveBorrows;


