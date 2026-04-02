# FinFlow — Finance Dashboard (React)

A clean, interactive finance dashboard built with React 18 + TypeScript + Vite + Chart.js.

---

## Setup & Running

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
finflow-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx         # Navigation sidebar with role switcher
│   │   ├── Topbar.tsx          # Top bar with search, export, avatar
│   │   ├── SummaryCards.tsx    # 4 summary stat cards
│   │   ├── TrendChart.tsx      # Bar chart: income vs expenses over time
│   │   ├── DonutChart.tsx      # Donut chart: spending by category
│   │   ├── RecentTransactions.tsx  # Last 5 transactions table
│   │   ├── TransactionTable.tsx    # Full paginated transactions table
│   │   ├── TransactionModal.tsx    # Add/Edit transaction modal
│   │   └── Toast.tsx           # Toast notification system
│   ├── context/
│   │   └── AppContext.tsx       # Global state (transactions, role, filters)
│   ├── data/
│   │   └── seed.ts             # Seed transactions & category colors
│   ├── hooks/
│   │   └── useToast.ts         # Toast hook
│   ├── pages/
│   │   ├── Dashboard.tsx       # Overview page
│   │   ├── Transactions.tsx    # Transactions page
│   │   └── Insights.tsx        # Insights page
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   ├── utils/
│   │   └── finance.ts          # Utility functions (fmt, dateLabel, etc.)
│   ├── App.tsx                 # Root app component
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles (CSS variables + layout)
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Features

### Dashboard Overview
- 4 Summary Cards — Total Balance, Income, Expenses, Savings Rate with month-over-month change
- Balance Trend Chart — Bar chart comparing monthly income vs expenses (6M / 1Y toggle)
- Spending Donut Chart — Category breakdown with custom legend and percentage bars
- Recent Transactions — Quick view of the 5 most recent transactions

### Transactions Section
- Full paginated table (10 per page)
- Filter by type (Income / Expense) and category
- Sort by date, amount (ascending / descending)
- Search via the top search bar
- Add / Edit / Delete transactions (Admin role only)
- Export CSV button (Admin only)

### Role-Based UI
| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Add transactions | ❌ | ✅ |
| Edit transactions | ❌ | ✅ |
| Delete transactions | ❌ | ✅ |
| Export CSV | ❌ | ✅ |

### Insights Page
- Top spending category
- Average transaction size
- Busiest day of the week
- Largest single expense
- Spending vs income ratio
- Monthly comparison with progress bars
- Category breakdown horizontal bar chart

### State & Persistence
- React Context for global state
- localStorage persistence for transactions and role

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Charts | Chart.js 4 + react-chartjs-2 |
| Styling | Pure CSS with CSS variables (dark theme) |
| Fonts | Syne + DM Sans (Google Fonts) |
| Storage | localStorage |
