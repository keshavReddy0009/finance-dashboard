import React from 'react';
import { useApp } from '../context/AppContext';
import { dateLabel, fmtD } from '../utils/finance';
import { CAT_COLORS } from '../data/seed';

const RecentTransactions: React.FC = () => {
  const { transactions, navigate } = useApp();

  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="card" style={{ marginTop: 0 }}>
      <div className="chart-header" style={{ marginBottom: 12 }}>
        <div className="chart-title">Recent Transactions</div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => navigate('transactions')}
        >
          View All
        </button>
      </div>

      <div className="tx-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <p>No transactions found</p>
                  </div>
                </td>
              </tr>
            ) : (
              recent.map((t) => {
                const color = CAT_COLORS[t.category] || '#9399a8';
                return (
                  <tr key={t.id}>
                    <td>{dateLabel(t.date)}</td>
                    <td className="tx-desc">{t.description}</td>
                    <td>
                      <span
                        className="cat-pill"
                        style={{ background: color + '22', color }}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge ${t.type}`}>{t.type}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`tx-amount ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}{fmtD(t.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
