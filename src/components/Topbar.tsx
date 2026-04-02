import React from 'react';
import { useApp } from '../context/AppContext';

const pageTitles: Record<string, string> = {
  dashboard: 'Overview',
  transactions: 'Transactions',
  insights: 'Insights',
};

const Topbar: React.FC = () => {
  const { currentNav, setSidebarOpen, setFilters, filters, role, doExportCSV } = useApp();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={() => setSidebarOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="page-title">{pageTitles[currentNav]}</div>
      </div>

      <div className="search-bar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5c6070" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
        />
      </div>

      <div className="topbar-right">
        <div className="icon-btn" title="Notifications">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9399a8" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <div className="notif-dot"/>
        </div>

        {role === 'admin' && (
          <button className="icon-btn" title="Export CSV" onClick={doExportCSV}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9399a8" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
        )}

        <div className="avatar">AK</div>
      </div>
    </header>
  );
};

export default Topbar;
