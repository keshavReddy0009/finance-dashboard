# FinFlow — Finance Dashboard

> A clean, interactive personal finance dashboard built with React 18, TypeScript, and Vite. Built as part of a frontend internship assignment for Zorvyn FinTech.

🔗 **Live Demo:** https://keshavreddy0009.github.io/finance-dashboard/

---

## Preview

| Overview | Transactions | Insights |
|---|---|---|
| Summary cards, trend chart, donut chart | Paginated table, filters, add/edit/delete | Spending patterns, monthly comparison |

---

## Features

### 📊 Dashboard Overview
- **4 Summary Cards** — Total Balance, Monthly Income, Expenses, Savings Rate with month-over-month change indicators
- **Balance Trend Chart** — Bar chart comparing income vs expenses with 6M / 1Y period toggle
- **Spending Donut Chart** — Top 5 expense categories with proportional legend bars
- **Recent Transactions** — Latest 5 transactions at a glance

### 💳 Transactions
- Full **paginated table** (10 per page) with all transaction details
- **Filter** by type (Income / Expense) and category
- **Sort** by date or amount (ascending / descending)
- **Search** by description or category (live from topbar)
- **Add / Edit / Delete** transactions — Admin role only
- **Export CSV** — downloads all transactions instantly

### 🔐 Role-Based UI
Switch roles using the dropdown in the sidebar — no login needed, purely frontend simulation.

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard & transactions | ✅ | ✅ |
| Add transactions | ❌ | ✅ |
| Edit transactions | ❌ | ✅ |
| Delete transactions | ❌ | ✅ |
| Export CSV | ❌ | ✅ |

### 📈 Insights
- Top spending category with total amount
- Average transaction size across all records
- Busiest day of the week by transaction count
- Largest single expense
- Spending vs income health ratio (with color indicator)
- Monthly income vs expense comparison (last 3 months)
- Full category breakdown horizontal bar chart

### ⚙️ State Management
All state lives in a single React Context (`AppContext`), with derived data computed via `useMemo` for performance. No prop drilling.

- `transactions` — full array of records
- `role` — current user role
- `filters` — type / category / search / sort
- `currentPage` — pagination
- `activePeriod` — chart time range

Persisted to `localStorage` — transactions and role survive page refresh.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + TypeScript | Component architecture, type safety |
| Build Tool | Vite | Fast dev server, optimized builds |
| Charts | Chart.js 4 + react-chartjs-2 | Lightweight, easy React integration |
| Styling | Pure CSS + CSS variables | Full control, dark theme, no bloat |
| Fonts | Syne + DM Sans (Google Fonts) | Distinctive, readable pairing |
| State | React Context + useMemo | Simple, no over-engineering |
| Storage | localStorage | Browser-native persistence |
| Hosting | GitHub Pages | Zero-cost static deployment |

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.tsx              # Navigation + role switcher
│   ├── Topbar.tsx               # Search, export, avatar
│   ├── SummaryCards.tsx         # 4 stat cards with change indicators
│   ├── TrendChart.tsx           # Bar chart: income vs expenses
│   ├── DonutChart.tsx           # Spending breakdown by category
│   ├── RecentTransactions.tsx   # Last 5 transactions
│   ├── TransactionTable.tsx     # Full paginated table with filters
│   ├── TransactionModal.tsx     # Add / Edit modal
│   └── Toast.tsx                # Notification system
├── context/
│   └── AppContext.tsx           # Global state, derived data, actions
├── data/
│   └── seed.ts                  # 40 seed transactions across 6 months
├── pages/
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   └── Insights.tsx
├── types/
│   └── index.ts                 # TypeScript interfaces
└── utils/
    └── finance.ts               # Formatting, date utils, CSV export
```

---

## Setup & Running

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
git clone https://github.com/keshavreddy0009/finance-dashboard.git
cd finance-dashboard
npm install
npm run dev
```

Open `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Data Structure

Each transaction:

```ts
{
  id: number;
  date: string;        // "YYYY-MM-DD"
  description: string;
  category: string;    // Food | Transport | Housing | ...
  type: "income" | "expense";
  amount: number;
}
```

40 seed transactions across 6 months (Nov 2024 – Apr 2025) covering 10 categories: Salary, Freelance, Investment, Food, Transport, Housing, Entertainment, Healthcare, Shopping, Other.

---

## Design Decisions

- **Single Context, no Redux** — state is simple enough; adding Redux would be over-engineering for this scope
- **CSS variables, no Tailwind** — gives precise control over the dark theme without shipping a large utility CSS file
- **react-chartjs-2 over Recharts** — lighter bundle, better canvas performance for multiple simultaneous charts
- **Derived data in useMemo** — filtered/sorted transactions and summary stats are computed from source data, never stored separately, keeping state single-source-of-truth
- **No router** — single-page navigation via state keeps the bundle minimal and avoids hash/history issues on GitHub Pages

---

## Optional Enhancements Implemented

- ✅ Dark mode (default)
- ✅ localStorage persistence
- ✅ Export to CSV
- ✅ Animations and transitions (modal, cards, toasts, charts)
- ✅ Advanced filtering (type + category + search + sort combined)
- ✅ Responsive design (mobile hamburger menu, adaptive grid layouts)
- ✅ Empty state handling
- ✅ Toast notifications for all actions

---

## Author

**Chilkuri Sai Keshav Reddy** 