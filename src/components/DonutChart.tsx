import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useApp } from '../context/AppContext';
import { CAT_COLORS } from '../data/seed';
import { pct, fmtD } from '../utils/finance';

ChartJS.register(ArcElement, Tooltip);

const DonutChart: React.FC = () => {
  const { transactions } = useApp();

  const expenses = transactions.filter((t) => t.type === 'expense');
  const catTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });

  const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const total = sorted.reduce((s, e) => s + e[1], 0);
  const colors = sorted.map((e) => CAT_COLORS[e[0]] || '#9399a8');

  const data = {
    labels: sorted.map((e) => e[0]),
    datasets: [
      {
        data: sorted.map((e) => e[1]),
        backgroundColor: colors.map((c) => c + 'cc'),
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: colors,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (c: { raw: unknown }) =>
            ' ' + fmtD(c.raw as number) + ' (' + pct(c.raw as number, total) + '%)',
        },
      },
    },
  };

  const maxV = sorted[0] ? sorted[0][1] : 1;

  return (
    <div className="card">
      <div className="chart-header">
        <div>
          <div className="chart-title">Spending Breakdown</div>
          <div className="chart-subtitle">By category</div>
        </div>
      </div>

      <div style={{ position: 'relative', height: 160 }}>
        {sorted.length > 0 ? (
          <Doughnut data={data} options={options} />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <p>No expense data</p>
          </div>
        )}
      </div>

      <div className="donut-legend">
        {sorted.map(([cat, val]) => {
          const p = pct(val, total);
          const color = CAT_COLORS[cat] || '#9399a8';
          return (
            <div className="legend-item" key={cat}>
              <div className="legend-dot" style={{ background: color }} />
              <span className="legend-name">{cat}</span>
              <div className="legend-bar-wrap">
                <div
                  className="legend-bar-fill"
                  style={{ width: `${pct(val, maxV)}%`, background: color }}
                />
              </div>
              <span className="legend-pct">{p}%</span>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div style={{ color: 'var(--text3)', fontSize: 13 }}>No expense data</div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
