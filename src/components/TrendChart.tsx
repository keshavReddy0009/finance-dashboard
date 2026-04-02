import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { getMonthRange, monthKey, fmtD } from '../utils/finance';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TrendChart: React.FC = () => {
  const { transactions, activePeriod, setActivePeriod } = useApp();

  const months = getMonthRange(activePeriod);
  const incData: number[] = [];
  const expData: number[] = [];

  months.forEach((m) => {
    const txs = transactions.filter((t) => monthKey(t.date) === m);
    incData.push(txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0));
    expData.push(txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
  });

  const labels = months.map((m) => {
    const [y, mo] = m.split('-');
    return new Date(Number(y), Number(mo) - 1, 1).toLocaleDateString('en-US', { month: 'short' });
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incData,
        backgroundColor: 'rgba(45,212,160,0.7)',
        borderRadius: 6,
        borderSkipped: false as const,
      },
      {
        label: 'Expenses',
        data: expData,
        backgroundColor: 'rgba(242,107,107,0.7)',
        borderRadius: 6,
        borderSkipped: false as const,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (c: { raw: unknown }) => ' ' + fmtD(c.raw as number),
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#5c6070', font: { size: 11 } },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      y: {
        ticks: {
          color: '#5c6070',
          font: { size: 11 },
          callback: (v: string | number) => {
            const n = Number(v);
            return n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
          },
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
    },
  };

  return (
    <div className="card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Balance Trend</div>
          <div className="chart-subtitle">Income vs Expenses</div>
        </div>
        <div className="period-tabs">
          <button
            className={`period-tab${activePeriod === '6m' ? ' active' : ''}`}
            onClick={() => setActivePeriod('6m')}
          >
            6M
          </button>
          <button
            className={`period-tab${activePeriod === '12m' ? ' active' : ''}`}
            onClick={() => setActivePeriod('12m')}
          >
            1Y
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(45,212,160,0.7)', display: 'inline-block' }} />
          Income
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)' }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(242,107,107,0.7)', display: 'inline-block' }} />
          Expenses
        </div>
      </div>

      <div style={{ position: 'relative', height: 240 }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TrendChart;
