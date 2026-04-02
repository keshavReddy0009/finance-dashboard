import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import TransactionModal from './components/TransactionModal';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';

const AppShell: React.FC = () => {
  const { currentNav } = useApp();

  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        {currentNav === 'dashboard' && <Dashboard />}
        {currentNav === 'transactions' && <Transactions />}
        {currentNav === 'insights' && <Insights />}
      </div>
      <TransactionModal />
      <Toast />
    </div>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppShell />
  </AppProvider>
);

export default App;
