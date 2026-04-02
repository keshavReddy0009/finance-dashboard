import React from 'react';
import { useApp } from '../context/AppContext';
import { fmt } from '../utils/finance';

const SummaryCards: React.FC = () => {
  const { summaryStats } = useApp();
  const { balance, thisMonthIncome, thisMonthExpenses, savingsRate, incomeChange, expenseChange } = summaryStats;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <>
      <div className="section-title">Financial Overview</div>
      <div className="section-sub">As of {today}</div>

      <div className="summary-grid">
        <div className="sum-card" style={{ borderColor: 'rgba(108,114,245,0.25)' }}>
          <div className="sum-card-icon" style={{ background: 'var(--accent-dim)' }}>💰</div>
          <div className="sum-card-label">Total Balance</div>
          <div className="sum-card-value">{fmt(balance)}</div>
          <div className={`sum-card-change ${balance >= 0 ? 'up' : 'down'}`}>
            {balance >= 0 ? '↑' : '↓'} {Math.abs(Math.round((balance / (Math.max(Math.abs(balance), 1))) * 100))}%
          </div>
          <div className="sum-card-sub">net all time</div>
        </div>

        <div className="sum-card" style={{ borderColor: 'rgba(45,212,160,0.25)' }}>
          <div className="sum-card-icon" style={{ background: 'var(--green-dim)' }}>📈</div>
          <div className="sum-card-label">Income</div>
          <div className="sum-card-value">{fmt(thisMonthIncome)}</div>
          <div className={`sum-card-change ${incomeChange >= 0 ? 'up' : 'down'}`}>
            {incomeChange >= 0 ? '↑' : '↓'} {Math.abs(incomeChange)}%
          </div>
          <div className="sum-card-sub">vs last month</div>
        </div>

        <div className="sum-card" style={{ borderColor: 'rgba(242,107,107,0.25)' }}>
          <div className="sum-card-icon" style={{ background: 'var(--red-dim)' }}>📉</div>
          <div className="sum-card-label">Expenses</div>
          <div className="sum-card-value">{fmt(thisMonthExpenses)}</div>
          <div className={`sum-card-change ${expenseChange > 0 ? 'down' : 'up'}`}>
            {expenseChange > 0 ? '↑' : '↓'} {Math.abs(expenseChange)}%
          </div>
          <div className="sum-card-sub">vs last month</div>
        </div>

        <div className="sum-card" style={{ borderColor: 'rgba(245,166,35,0.25)' }}>
          <div className="sum-card-icon" style={{ background: 'var(--amber-dim)' }}>🎯</div>
          <div className="sum-card-label">Savings Rate</div>
          <div className="sum-card-value">{savingsRate}%</div>
          <div className="sum-card-change up">↑ target 20%</div>
          <div className="sum-card-sub">this month</div>
        </div>
      </div>
    </>
  );
};

export default SummaryCards;
