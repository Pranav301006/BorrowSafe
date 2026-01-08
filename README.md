# BorrowSafe

**A friendly borrowing & lending accountability app** — track items and money you lend or borrow with shareable proof codes, color-coded due dates, and polite reminders. No backend required; runs entirely in the browser using LocalStorage.

---

## Features

| Feature | Description |
|---------|-------------|
| **Lend Items or Money** | Create a record with borrower name, due date, and optional note. Get a unique code + QR to share. |
| **Borrow Confirmation** | Borrower enters the code to confirm — both sides now have proof. |
| **Active Borrows** | See all ongoing borrows with status badges: 🟢 Borrowed, 🟡 Due Soon, 🔴 Overdue. |
| **Polite Reminders** | System-generated reminder text preview — no awkward manual nagging. |
| **Recently Returned** | Private history of all returned items/money for trust and recall. |
| **Money Borrowing** | First-class support for lending money (amount, currency, note). |
| **QR Code Sharing** | Each borrow code generates a QR for easy sharing. |
| **Offline / LocalStorage** | All data stored in browser; works without internet after first load. |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | React 19 (functional components, hooks) |
| **Routing** | React Router DOM v7 |
| **Styling** | Tailwind CSS v4 (utility-first, dark theme) |
| **Build Tool** | Vite 7 (fast dev server, optimized production build) |
| **State / Storage** | React useState + LocalStorage (no backend) |
| **QR Generation** | [QR Server API](https://goqr.me/api/) (external, on-demand) |
| **Linting** | ESLint 9 with React hooks plugin |

---

## Project Structure

```
neighbourhood-share/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/          # (empty — all UI in pages for simplicity)
│   ├── data/
│   │   └── borrowSafeStore.js   # LocalStorage helpers, seed data, date logic
│   ├── pages/
│   │   ├── Home.jsx             # Dashboard with stats + previews
│   │   ├── LendItem.jsx         # Lend money or item form + QR
│   │   ├── BorrowItem.jsx       # Enter code to confirm borrow
│   │   ├── ActiveBorrows.jsx    # List active borrows + reminders
│   │   ├── RecentlyReturned.jsx # History of returned items/money
│   │   └── NotFound.jsx         # 404 page
│   ├── App.jsx              # Routes + navbar layout
│   ├── App.css              # Tailwind import
│   ├── index.css            # Tailwind import
│   └── main.jsx             # React DOM entry point
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

---

## Pages Overview

| Route | Page | Purpose |
|-------|------|---------|
| `/` | Dashboard | Stats (active, overdue, money loans), upcoming due, recently returned preview |
| `/lend` | Lend | Form to lend item or money; generates code + QR |
| `/borrow` | Borrow | Enter code to preview and confirm borrow |
| `/active` | Active Borrows | All ongoing borrows with status, reminder preview, mark returned |
| `/returned` | Recently Returned | Full history of returned items/money |

---

## Data Model (LocalStorage)

Records are stored under `borrowSafe_records_v1` as a JSON array.

```js
{
  id: "BS-XXXX00",       // unique code
  code: "BS-XXXX00",     // same as id, used for lookup
  type: "item" | "money",
  itemName: "Charger",   // for items
  amount: 500,           // for money
  currency: "INR",       // for money
  note: "For books",     // optional, for money
  ownerName: "Rahul",
  borrowerName: "Ajay",
  borrowDate: "2026-01-07",
  returnDate: "2026-01-12",
  status: "active" | "returned",
  borrowerConfirmed: true | false,
  returnedOn: "2026-01-12"  // set when marked returned
}
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173` with hot reload.

### Production Build

```bash
npm run build
npm run preview   # preview the production build locally
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production (output in `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## Customization

- **Change seed data**: Edit `seedRecords` in `src/data/borrowSafeStore.js`.
- **Adjust "Due Soon" threshold**: Modify `dueSoonDays` in `defaultSettings` inside `borrowSafeStore.js`.
- **Add new fields**: Extend the record object in `createLendRecord()` and update UI accordingly.

---

## Limitations (by design for demo)

- **Single device**: Data is in browser LocalStorage; not synced across devices.
- **No authentication**: Assumes personal/shared device usage.
- **Mock reminders**: Reminder text is previewed, not actually sent (no email/SMS integration).

---

## Future Enhancements (optional)

- Backend + database for multi-device sync
- Real push notifications / WhatsApp / email reminders
- Partial payments for money loans
- Borrower reliability score dashboard
- Export to PDF / print borrow agreement

---

## License

MIT — free to use, modify, and distribute.

---

## Author

Built as a semester project to demonstrate **behavior-first design**: reducing social discomfort in informal borrowing, not just storing data.

