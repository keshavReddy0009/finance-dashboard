# FinFlow — Finance Dashboard

A clean, interactive single-file finance dashboard built with vanilla JavaScript, HTML, and CSS. No frameworks or build tools required.

---

## Setup & Running

Since this is a single HTML file, setup is instant:

1. Download `finance-dashboard.html`
2. Open it in any modern browser (Chrome, Firefox, Edge, Safari)
3. No server, no install, no build step needed

To serve it locally (optional):
```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```
Then open `http://localhost:8080/finance-dashboard.html`

---

## Features Overview

### Dashboard Overview
- **4 Summary Cards** — Total Balance, Income, Expenses, Savings Rate with month-over-month change indicators
- **Balance Trend Chart** — Bar chart comparing monthly income vs expenses (6M / 1Y toggle)
- **Spending Donut Chart** — Category breakdown with custom legend and percentage bars
- **Recent Transactions** — Quick view of the 5 most recent transactions

### Transactions Section
- Full paginated table (10 per page) with all transaction details
- **Filter** by type (Income / Expense) and category
- **Sort** by date, amount (ascending / descending)
- **Search** via the top search bar (searches description and category)
- **Add / Edit / Delete** transactions (Admin role only)
- **Export CSV** button (Admin only) — downloads all transactions as a CSV file

### Role-Based UI
Switch roles via the dropdown in the sidebar footer:

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Add transactions | ❌ | ✅ |
| Edit transactions | ❌ | ✅ |
| Delete transactions | ❌ | ✅ |
| Export CSV | ❌ | ✅ |

Role is persisted to `localStorage` across page refreshes.

### Insights Page
- Top spending category with total amount
- Average transaction size
- Busiest day of the week
- Largest single expense
- Spending vs income ratio with health indicator
- Total transaction counts
- **Monthly Comparison** — Progress bars comparing income vs expenses for last 3 months
- **Category Breakdown** — Horizontal bar chart for all expense categories

### State Management
All state is managed in a single `state` object:
- `transactions` — array of all transaction records
- `role` — current user role
- `filters` — active filter/sort/search values
- `currentPage` — pagination state

Persisted to `localStorage`:
- Transactions survive page refreshes
- Role selection persists

### UX Details
- **Empty states** — friendly messages when no data matches filters
- **Toast notifications** — success/error feedback for all actions
- **Responsive** — works on mobile (hamburger menu), tablet, and desktop
- **Smooth animations** — card hover effects, chart transitions, modal slide-in
- **Donut chart legend** — proportional mini-bars next to each category label

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Vanilla JS | Zero dependencies, instant load |
| Charts | Chart.js 4.4 (CDN) | Lightweight, easy to configure |
| Styling | Pure CSS with CSS variables | Full control, dark theme |
| Fonts | Syne + DM Sans (Google Fonts) | Distinctive, readable pairing |
| Storage | localStorage | Simple, browser-native persistence |

---

## Data Structure

Each transaction follows this shape:
```json
{
  "id": 1,
  "date": "2025-04-01",
  "description": "Monthly Salary",
  "category": "Salary",
  "type": "income",
  "amount": 5200
}
```

40 seed transactions are included across 6 months (Nov 2024 – Apr 2025) covering categories: Salary, Freelance, Investment, Food, Transport, Housing, Entertainment, Healthcare, Shopping, Other.

---

## Approach

The goal was to keep everything in one self-contained file with zero build tooling, while still delivering a polished, production-feel UI. State flows one-way: user actions mutate the `state` object → `save()` persists to localStorage → render functions re-draw the relevant UI sections. Charts are rebuilt on navigation to ensure they reflect the latest data. Role switching is purely presentational — CSS class `.admin-only` controls visibility of action elements.

---

## Optional Enhancements Implemented

- ✅ Dark mode (default, full dark theme)
- ✅ Data persistence via localStorage
- ✅ Export to CSV
- ✅ Animations and transitions (modal, cards, toasts, charts)
- ✅ Advanced filtering (type + category + search + sort combined)