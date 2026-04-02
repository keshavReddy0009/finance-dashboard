import React from 'react';
import { useApp } from '../context/AppContext';
import { NavPage, Role } from '../types';

const Sidebar: React.FC = () => {
  const { currentNav, navigate, role, setRole, transactions, sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="logo">
          <div className="logo-mark">Fin<span>Flow</span></div>
          <div className="logo-sub">Finance Dashboard</div>
        </div>

        <div className="nav-section">Main</div>

        <NavItem
          page="dashboard"
          current={currentNav}
          onClick={() => navigate('dashboard')}
          icon={
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          }
        >
          Overview
        </NavItem>

        <NavItem
          page="transactions"
          current={currentNav}
          onClick={() => navigate('transactions')}
          badge={transactions.length}
          icon={
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
          }
        >
          Transactions
        </NavItem>

        <NavItem
          page="insights"
          current={currentNav}
          onClick={() => navigate('insights')}
          icon={
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
          }
        >
          Insights
        </NavItem>

        <div className="sidebar-footer">
          <div className="role-switcher">
            <label>Current Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <div className={`role-tag ${role}`}>
              &#9679; {role === 'admin' ? 'Admin Access' : 'Viewer Access'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

interface NavItemProps {
  page: NavPage;
  current: NavPage;
  onClick: () => void;
  icon: React.ReactNode;
  badge?: number;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ page, current, onClick, icon, badge, children }) => (
  <button className={`nav-item${current === page ? ' active' : ''}`} onClick={onClick}>
    {icon}
    {children}
    {badge !== undefined && <span className="nav-badge">{badge}</span>}
  </button>
);

export default Sidebar;
