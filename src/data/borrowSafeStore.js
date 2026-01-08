// BorrowSafe local store and helpers
const STORAGE_KEY = "borrowSafe_records_v1";
const STATS_KEY = "borrowSafe_stats_v1";
const SETTINGS_KEY = "borrowSafe_settings_v1";

const defaultSettings = {
  dueSoonDays: 1,
  autoReminder: true,
};

const seedRecords = [
  {
    id: "BS-1001",
    type: "item",
    itemName: "Charger",
    ownerName: "Rahul",
    borrowerName: "Ajay",
    borrowDate: "2026-01-03",
    returnDate: "2026-01-08",
    code: "CHG910",
    status: "active",
    borrowerConfirmed: true,
  },
  {
    id: "BS-1002",
    type: "item",
    itemName: "Helmet",
    ownerName: "Nikita",
    borrowerName: "Dev",
    borrowDate: "2026-01-02",
    returnDate: "2026-01-07",
    code: "HLM512",
    status: "active",
    borrowerConfirmed: true,
  },
  {
    id: "BS-2001",
    type: "money",
    amount: 500,
    currency: "INR",
    note: "Emergency travel",
    ownerName: "Rahul",
    borrowerName: "Ajay",
    borrowDate: "2026-01-04",
    returnDate: "2026-01-09",
    code: "MNY500",
    status: "active",
    borrowerConfirmed: true,
  },
  {
    id: "BS-1003",
    type: "item",
    itemName: "Pen",
    ownerName: "Sara",
    borrowerName: "Mihir",
    borrowDate: "2026-01-01",
    returnDate: "2026-01-04",
    code: "PEN204",
    status: "returned",
    borrowerConfirmed: true,
    returnedOn: "2026-01-05",
  },
];

export const formatDate = (value) => new Date(value).toISOString().split("T")[0];
export const todayStr = () => formatDate(new Date());

export const loadSettings = () => {
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return { ...defaultSettings };
  }
  try {
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return { ...defaultSettings };
  }
};

export const saveSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const loadRecords = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRecords));
    return [...seedRecords];
  }
  try {
    return JSON.parse(raw);
  } catch {
    return [...seedRecords];
  }
};

export const saveRecords = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const loadStats = () => {
  const raw = localStorage.getItem(STATS_KEY);
  if (!raw) {
    const initial = {};
    localStorage.setItem(STATS_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const saveStats = (stats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const generateCode = () =>
  `BS-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now()
    .toString()
    .slice(-2)}`;

export const formatMoney = (amount, currency = "INR") => {
  const value = Number(amount);
  const safe = Number.isFinite(value) ? value : 0;
  const symbol =
    currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "";
  return symbol ? `${symbol}${safe}` : `${safe} ${currency}`;
};

export const daysLeft = (returnDate) => {
  const now = new Date();
  const end = new Date(returnDate);
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getStatusBadge = (record, settings = loadSettings()) => {
  if (record.status === "returned") {
    return {
      label: "Returned",
      chip: "bg-emerald-500/15 text-emerald-200",
      indicator: "✅",
    };
  }
  const left = daysLeft(record.returnDate);
  if (left < 0) {
    return {
      label: "Overdue",
      chip: "bg-rose-500/15 text-rose-200",
      indicator: "🔴",
    };
  }
  if (left <= (settings?.dueSoonDays ?? 1)) {
    return {
      label: "Due Soon",
      chip: "bg-amber-500/15 text-amber-200",
      indicator: "🟡",
    };
  }
  return {
    label: "Borrowed",
    chip: "bg-emerald-500/15 text-emerald-200",
    indicator: "🟢",
  };
};

export const createLendRecord = ({ itemName, borrowerName, ownerName, returnDate }) => {
  const records = loadRecords();
  const code = generateCode();
  const type = "item";
  const record = {
    id: code,
    code,
    type,
    itemName: itemName.trim(),
    ownerName: (ownerName || "You").trim(),
    borrowerName: (borrowerName || "").trim(),
    borrowDate: todayStr(),
    returnDate: returnDate || todayStr(),
    status: "active",
    borrowerConfirmed: false,
  };
  const next = [record, ...records];
  saveRecords(next);
  return record;
};

export const createMoneyRecord = ({
  amount,
  currency,
  note,
  borrowerName,
  ownerName,
  returnDate,
}) => {
  const records = loadRecords();
  const code = generateCode();
  const record = {
    id: code,
    code,
    type: "money",
    amount: Number(amount),
    currency: currency || "INR",
    note: (note || "").trim(),
    ownerName: (ownerName || "You").trim(),
    borrowerName: (borrowerName || "").trim(),
    borrowDate: todayStr(),
    returnDate: returnDate || todayStr(),
    status: "active",
    borrowerConfirmed: false,
  };
  const next = [record, ...records];
  saveRecords(next);
  return record;
};

export const findByCode = (code) => {
  const records = loadRecords();
  return records.find((r) => r.code?.toUpperCase() === code.toUpperCase());
};

export const confirmBorrow = (code, borrowerName) => {
  const records = loadRecords();
  const next = records.map((r) =>
    r.code?.toUpperCase() === code.toUpperCase()
      ? {
          ...r,
          borrowerConfirmed: true,
          borrowerName: borrowerName?.trim() || r.borrowerName,
        }
      : r
  );
  saveRecords(next);
  return next.find((r) => r.code?.toUpperCase() === code.toUpperCase());
};

export const markReturned = (id) => {
  const records = loadRecords();
  const updated = records.map((r) =>
    r.id === id ? { ...r, status: "returned", returnedOn: todayStr() } : r
  );
  saveRecords(updated);
  // Update borrower reliability stats
  const returned = updated.find((r) => r.id === id);
  if (returned?.borrowerName) {
    const stats = loadStats();
    const key = returned.borrowerName;
    const entry = stats[key] || { returnsOnTime: 0, returnsLate: 0 };
    const late = daysLeft(returned.returnDate) < 0;
    if (late) entry.returnsLate += 1;
    else entry.returnsOnTime += 1;
    stats[key] = entry;
    saveStats(stats);
  }
  return updated.find((r) => r.id === id);
};

export const simulateReminders = () => {
  const settings = loadSettings();
  if (!settings.autoReminder) return [];
  const records = loadRecords();
  const due = records.filter(
    (r) => r.status === "active" && (daysLeft(r.returnDate) <= settings.dueSoonDays)
  );
  // Tag remindedAt for demo (no real notifications)
  const now = new Date().toISOString();
  const next = records.map((r) =>
    due.some((d) => d.id === r.id) ? { ...r, remindedAt: now } : r
  );
  saveRecords(next);
  return due.map((r) => ({
    id: r.id,
    type: r.type || "item",
    itemName: r.itemName,
    amount: r.amount,
    currency: r.currency,
    borrowerName: r.borrowerName,
    message:
      (r.type || "item") === "money"
        ? `Hey, just a reminder: ${formatMoney(r.amount, r.currency)} is due ${r.returnDate} 😊`
        : `Hey, just a reminder you borrowed ${r.itemName}, due ${r.returnDate} 😊`,
  }));
};

export const exportAllData = () => {
  const blob = {
    records: loadRecords(),
    stats: loadStats(),
    settings: loadSettings(),
  };
  return JSON.stringify(blob, null, 2);
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
};

export const qrSrcFor = (code) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    code
  )}`;

export const selectActive = () => loadRecords().filter((r) => r.status === "active");
export const selectHistory = () =>
  loadRecords().filter((r) => r.status === "returned");

export const borrowerReliability = () => {
  const stats = loadStats();
  const entries = Object.entries(stats).map(([name, s]) => {
    const total = (s.returnsLate || 0) + (s.returnsOnTime || 0);
    const score = total ? Math.round(((s.returnsOnTime || 0) / total) * 100) : 100;
    return { name, ...s, total, score };
  });
  entries.sort((a, b) => b.score - a.score);
  return entries;
};

export default {
  STORAGE_KEY,
  STATS_KEY,
  SETTINGS_KEY,
  loadRecords,
  saveRecords,
  loadStats,
  saveStats,
  loadSettings,
  saveSettings,
  seedRecords,
  formatDate,
  todayStr,
  generateCode,
  formatMoney,
  daysLeft,
  getStatusBadge,
  createLendRecord,
  createMoneyRecord,
  findByCode,
  confirmBorrow,
  markReturned,
  simulateReminders,
  exportAllData,
  clearAllData,
  qrSrcFor,
  selectActive,
  selectHistory,
  borrowerReliability,
};


