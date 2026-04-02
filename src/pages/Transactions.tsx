import React from 'react';
import TransactionTable from '../components/TransactionTable';

const Transactions: React.FC = () => {
  return (
    <div className="page">
      <div className="section-title">Transactions</div>
      <div className="section-sub">Manage and explore your financial activity</div>
      <TransactionTable />
    </div>
  );
};

export default Transactions;
