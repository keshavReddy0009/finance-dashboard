import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { CAT_COLORS } from '../data/seed';
import { fmtD, fmt, monthKey, nowDate, pct, dayName, monthName, getMonthRange } from '../utils/finance';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const Insights: React.FC = () => {
  const { transactions } = useApp();

  const expenses = transactions.filter((t) => t.type === 'expense');
  const income = transactions.filter((t) => t.type === 'income');

  // Top spending category
  const catTotals: Record<string, number> = {};
  expenses.forEach((t) => { catTotals[t.category] = (catTotals[t.category] || 0) + t.amount; });
  const topCatEntry = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0];
  const topCat = topCatEntry ? topCatEntry[0] : '—';
  const topCatVal = topCatEntry ? topCatEntry[1] : 0;

  // Avg transaction
  const avgTx = transactions.length > 0 ? transactions.reduce((s, t) => s + t.amount, 0) / transactions.length : 0;

  // Busiest day
  const dayCounts: Record<string, number> = {};
  transactions.forEach((t) => {
    const d = dayName(t.date);
    dayCounts[d] = (dayCounts[d] || 0) + 1;
  });
  const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];

  // Largest expense
  const largest = expenses.sort((a, b) => b.amount - a.amount)[0];

  // Spending vs income ratio
  const totalInc = income.reduce((s, t) => s + t.amount, 0);
  const totalExp = expenses.reduce((s, t) => s + t.amount, 0);
  const ratio = totalInc > 0 ? Math.round((totalExp / totalInc) * 100) : 0;

  // Monthly comparison (last 3 months)
  const last3 = getMonthRange('6m').slice(-3);
  const monthData = last3.map((m) => {
    const txs = transactions.filter((t) => monthKey(t.date) === m);
    const inc = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const exp = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { month: m, inc, exp };
  });

  // Category bar chart
  const catSorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
  const catColors = catSorted.map((e) => (CAT_COLORS[e[0]] || '#9399a8') + 'bb');

  const catBarData = {
    labels: catSorted.map((e) => e[0]),
    datasets: [
      {
        data: catSorted.map((e) => e[1]),
        backgroundColor: catColors,
        borderRadius: 6,
      },
    ],
  };

  const catBarOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: { label: (c: { raw: unknown }) => ' ' + fmtD(c.raw as number) },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#5c6070',
          callback: (v: string | number) => {
            const n = Number(v);
            return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
          },
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      y: {
        ticks: { color: '#9399a8' },
        grid: { display: false },
      },
    },
  };

  const maxMonthVal = Math.max(...monthData.map((m) => Math.max(m.inc, m.exp)), 1);

  return (
    <div className="page">
      <div className="section-title">Insights</div>
      <div className="section-sub">Key observations from your financial data</div>

      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'var(--red-dim)' }}>🔥</div>
          <div className="insight-label">Top Spending Category</div>
          <div className="insight-value">{topCat}</div>
          <div className="insight-desc">{topCatVal > 0 ? `Total: ${fmtD(topCatVal)}` : 'No expense data'}</div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'var(--green-dim)' }}>💸</div>
          <div className="insight-label">Avg. Transaction</div>
          <div className="insight-value">{fmtD(avgTx)}</div>
          <div className="insight-desc">{transactions.length} total transactions</div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'var(--accent-dim)' }}>📅</div>
          <div className="insight-label">Busiest Day</div>
          <div className="insight-value">{busiestDay ? busiestDay[0] : '—'}</div>
          <div className="insight-desc">{busiestDay ? `${busiestDay[1]} transactions` : 'No data'}</div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'var(--amber-dim)' }}>⚡</div>
          <div className="insight-label">Largest Single Expense</div>
          <div className="insight-value">{largest ? fmtD(largest.amount) : '—'}</div>
          <div className="insight-desc">{largest ? largest.description : 'No expenses'}</div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(176,110,245,0.12)' }}>🎯</div>
          <div className="insight-label">Spending vs Income</div>
          <div
            className="insight-value"
            style={{ color: ratio > 80 ? 'var(--red)' : ratio > 60 ? 'var(--amber)' : 'var(--green)' }}
          >
            {ratio}%
          </div>
          <div className="insight-desc">
            {ratio > 80 ? '⚠ High spending ratio' : ratio > 60 ? 'Moderate spending' : '✓ Healthy ratio'}
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon" style={{ background: 'rgba(62,207,207,0.12)' }}>📊</div>
          <div className="insight-label">Total Transactions</div>
          <div className="insight-value">{transactions.length}</div>
          <div className="insight-desc">
            {income.length} income · {expenses.length} expenses
          </div>
        </div>
      </div>

      <div className="month-compare-row">
        <div className="card">
          <div className="chart-title" style={{ marginBottom: 16 }}>Monthly Comparison</div>
          {monthData.map(({ month, inc, exp }) => {
            const maxV = Math.max(inc, exp, 1);
            return (
              <div key={month} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 8, fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
                  {monthName(month)}
                </div>
                <div className="progress-label">
                  <span>Income</span>
                  <span style={{ color: 'var(--green)' }}>{fmt(inc)}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct(inc, maxMonthVal)}%`, background: 'var(--green)' }} />
                </div>
                <div className="progress-label">
                  <span>Expenses</span>
                  <span style={{ color: 'var(--red)' }}>{fmt(exp)}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${pct(exp, maxMonthVal)}%`, background: 'var(--red)' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="chart-title" style={{ marginBottom: 16 }}>Category Breakdown</div>
          <div style={{ position: 'relative', height: Math.max(280, catSorted.length * 44 + 80) }}>
            {catSorted.length > 0 ? (
              <Bar data={catBarData} options={catBarOptions} />
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <p>No expense data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
