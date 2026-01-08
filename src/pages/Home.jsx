import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  loadRecords,
  daysLeft,
  getStatusBadge,
  formatMoney,
} from "../data/borrowSafeStore";

const Home = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const data = loadRecords();
    setRecords(data);
  }, []);

  const stats = useMemo(() => {
    const active = records.filter((r) => r.status === "active");
    const overdue = active.filter((r) => daysLeft(r.returnDate) < 0);
    const dueSoon = active.filter((r) => {
      const left = daysLeft(r.returnDate);
      return left >= 0 && left <= 1;
    });
    const activeMoney = active.filter((r) => (r.type || "item") === "money");
    const moneyTotal = activeMoney.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    return {
      active: active.length,
      overdue: overdue.length,
      dueSoon: dueSoon.length,
      activeMoney: activeMoney.length,
      moneyTotal,
    };
  }, [records]);

  const activeRecords = records.filter((r) => r.status === "active");
  const historyRecords = records.filter((r) => r.status === "returned");
  const activePreview = [...activeRecords]
    .sort((a, b) => daysLeft(a.returnDate) - daysLeft(b.returnDate))
    .slice(0, 4);
  const historyPreview = [...historyRecords].slice(0, 4);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
            Borrow items and money with proof — no awkward reminders.
          </h1>
          <p className="mt-4 text-base text-slate-300 sm:text-lg">
            Lend money or items with a shareable code + QR. Track due dates, get polite reminders, and keep a private history.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/lend"
              className="rounded-xl bg-gradient-to-r from-emerald-400 to-indigo-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:opacity-95"
            >
              + Lend (Money / Item)
            </Link>
            <Link
              to="/borrow"
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:border-white/30"
            >
              Borrow using Code
            </Link>
            <Link
              to="/active"
              className="rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white hover:border-white/30"
            >
              View Active
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-slate-300">Active borrows</p>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-slate-300">Due soon (≤1 day)</p>
              <p className="text-2xl font-bold text-amber-200">{stats.dueSoon}</p>
            </div>
          </div>
        </div>

        <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 via-indigo-500/10 to-transparent p-6 shadow-2xl shadow-indigo-500/20 backdrop-blur">
          <p className="text-sm font-semibold text-white">Money Borrowing</p>
          <div className="mt-4 grid gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-sm text-slate-300">Active money loans</p>
              <p className="mt-1 text-2xl font-bold text-white">{stats.activeMoney}</p>
              <p className="mt-2 text-sm text-slate-300">
                Total outstanding:{" "}
                <span className="font-semibold text-emerald-200">
                  {formatMoney(stats.moneyTotal, "INR")}
                </span>
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Use code + borrower confirmation as proof.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <p className="text-sm text-slate-300">Overdue</p>
              <p className="mt-1 text-2xl font-bold text-rose-200">{stats.overdue}</p>
              <p className="mt-2 text-xs text-slate-400">
                Open Active page to send polite reminders.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Upcoming due</h2>
            <Link to="/active" className="text-sm text-emerald-200 hover:text-white">
              Open Active →
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {activePreview.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-slate-300">
                No active borrows yet.
              </div>
            )}
            {activePreview.map((r) => {
              const badge = getStatusBadge(r);
              const left = daysLeft(r.returnDate);
              const title =
                r.type === "money" ? formatMoney(r.amount, r.currency) : r.itemName;
              const label = r.type === "money" ? "Money" : "Item";
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-slate-400">
                      Due {r.returnDate} · {left < 0 ? `${Math.abs(left)}d overdue` : `${left}d left`}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badge.chip}`}>
                    {badge.indicator} {badge.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">Recently returned</h2>
          <div className="mt-4 space-y-3">
            {historyPreview.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-slate-300">
                No returns yet.
              </div>
            )}
            {historyPreview.map((r) => {
              const title =
                r.type === "money" ? formatMoney(r.amount, r.currency) : r.itemName;
              const label = r.type === "money" ? "Money" : "Item";
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    <p className="text-xs text-slate-400">
                      Borrower: {r.borrowerName || "—"} · Returned {r.returnedOn || r.returnDate}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                    ✅ Returned
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;