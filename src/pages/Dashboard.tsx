import React from 'react';
import SummaryCards from '../components/SummaryCards';
import TrendChart from '../components/TrendChart';
import DonutChart from '../components/DonutChart';
import RecentTransactions from '../components/RecentTransactions';

const Dashboard: React.FC = () => {
  return (
    <div className="page">
      <SummaryCards />

      <div className="charts-row">
        <TrendChart />
        <DonutChart />
      </div>

      <RecentTransactions />
    </div>
  );
};

export default Dashboard;
