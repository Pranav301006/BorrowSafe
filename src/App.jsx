import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LendItem from "./pages/LendItem";
import BorrowItem from "./pages/BorrowItem";
import ActiveBorrows from "./pages/ActiveBorrows";
import RecentlyReturned from "./pages/RecentlyReturned";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(94,234,212,0.12),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(129,140,248,0.18),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.12),transparent_25%)]" />

      <div className="relative">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-indigo-400 to-fuchsia-500 text-base font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                BS
              </div>
              <div>
                <p className="text-lg font-semibold">BorrowSafe</p>
                <p className="text-xs text-slate-400">
                  Reduce social friction in borrowing
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
              <Link to="/" className="hover:text-white">
                Dashboard
              </Link>
              <Link to="/lend" className="hover:text-white">
                Lend
              </Link>
              <Link to="/borrow" className="hover:text-white">
                Borrow
              </Link>
              <Link to="/active" className="hover:text-white">
                Active
              </Link>
              <Link to="/returned" className="hover:text-white">
                Returned
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lend" element={<LendItem />} />
            <Route path="/borrow" element={<BorrowItem />} />
            <Route path="/active" element={<ActiveBorrows />} />
            <Route path="/returned" element={<RecentlyReturned />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
