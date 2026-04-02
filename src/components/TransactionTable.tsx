import React from 'react';
import { useApp } from '../context/AppContext';
import { dateLabel, fmtD } from '../utils/finance';
import { CAT_COLORS } from '../data/seed';
import { SortOption } from '../types';

const TransactionTable: React.FC = () => {
  const {
    filteredTransactions,
    pagedTransactions,
    currentPage,
    setCurrentPage,
    totalPages,
    role,
    filters,
    setFilters,
    categories,
    resetFilters,
    openModal,
    deleteTransaction,
    addToast,
  } = useApp();

  const isAdmin = role === 'admin';

  const handleSort = (col: string) => {
    const sortMap: Record<string, SortOption> = {
      date: filters.sort === 'date-desc' ? 'date-asc' : 'date-desc',
      amount: filters.sort === 'amount-desc' ? 'amount-asc' : 'amount-desc',
    };
    if (sortMap[col]) setFilters({ sort: sortMap[col] });
  };

  const start = (currentPage - 1) * 10;

  return (
    <div className="card">
      <div className="tx-filters">
        <select
          className="filter-select"
          value={filters.type}
          onChange={(e) => setFilters({ type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.sort}
          onChange={(e) => setFilters({ sort: e.target.value as SortOption })}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>

        <button className="btn btn-outline btn-sm" onClick={resetFilters}>
          Reset
        </button>

        <div className="ml-auto" style={{ display: 'flex', gap: 8 }}>
          {isAdmin && (
            <button className="btn btn-primary btn-sm" onClick={() => openModal()}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="tx-table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('date')}>
                Date <span style={{ opacity: 0.5 }}>↕</span>
              </th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th style={{ textAlign: 'right' }} onClick={() => handleSort('amount')}>
                Amount <span style={{ opacity: 0.5 }}>↕</span>
              </th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {pagedTransactions.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5}>
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <p>No transactions match your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              pagedTransactions.map((t) => {
                const color = CAT_COLORS[t.category] || '#9399a8';
                return (
                  <tr key={t.id}>
                    <td>{dateLabel(t.date)}</td>
                    <td className="tx-desc">{t.description}</td>
                    <td>
                      <span className="cat-pill" style={{ background: color + '22', color }}>
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
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => openModal(t.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteTransaction(t.id)}
                          >
                            Del
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          Showing {filteredTransactions.length === 0 ? 0 : start + 1}–
          {Math.min(start + 10, filteredTransactions.length)} of {filteredTransactions.length}
        </span>
        <div className="page-btns">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`page-btn${p === currentPage ? ' active' : ''}`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
