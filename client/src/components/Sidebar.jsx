import React from 'react';
import './Sidebar.css';
import { canAccessCustomers, canAccessSettings, hasAdminAccess } from '../utils/roles';

function SidebarIcon({ name }) {
  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </svg>
      );
    case 'billing':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3h10v18l-2-1.5L13 21l-2-1.5L9 21l-2-1.5L5 21V5a2 2 0 0 1 2-2Z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
          <path d="M9 16h4" />
        </svg>
      );
    case 'products':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" />
          <path d="m12 12 8-4.5" />
          <path d="m12 12-8-4.5" />
          <path d="M12 12v9" />
        </svg>
      );
    case 'stock':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
          <path d="M7 5v4" />
          <path d="M12 10v4" />
          <path d="M17 15v4" />
        </svg>
      );
    case 'pricing':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 13V7a2 2 0 0 0-2-2h-6l-8 8 7 7 8-8Z" />
          <path d="M15 9h.01" />
        </svg>
      );
    case 'priceboard':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 5h14v11H5z" />
          <path d="M9 16v3" />
          <path d="M15 16v3" />
          <path d="M8 9h8" />
          <path d="M8 12h5" />
        </svg>
      );
    case 'sales':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 19V9" />
          <path d="M12 19V5" />
          <path d="M19 19v-7" />
          <path d="M3 19h18" />
        </svg>
      );
    case 'customers':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M16 19a4 4 0 0 0-8 0" />
          <circle cx="12" cy="11" r="3" />
          <path d="M5 19a3 3 0 0 1 2-2.82" />
          <path d="M19 19a3 3 0 0 0-2-2.82" />
          <path d="M7.5 10a2.5 2.5 0 1 0-1.5-4.5" />
          <path d="M16.5 10A2.5 2.5 0 1 1 18 5.5" />
        </svg>
      );
    case 'reports':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      );
    case 'loginlog':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a2 2 0 1 1 0 4h-.2a1 1 0 0 0-.9.6Z" />
        </svg>
      );
    default:
      return null;
  }
}

function NavItem({ id, icon, label, currentPage, setCurrentPage }) {
  return (
    <div
      className={`nav-item ${currentPage === id ? 'active' : ''}`}
      onClick={() => setCurrentPage(id)}
    >
      {icon ? <span className="icon">{icon}</span> : null}
      <span className="nav-label">{label}</span>
    </div>
  );
}

export default function Sidebar({ currentPage, setCurrentPage, user, onLogout }) {
  const role = user?.role || 'Staff';
  const canManageAdminPages = hasAdminAccess(role);
  const canViewCustomers = canAccessCustomers(role);
  const canViewSettings = canAccessSettings(role);
  const isManager = role === 'Manager';
  const sidebarRole = canManageAdminPages
    ? (isManager ? 'manager' : 'admin')
    : 'staff';

  return (
    <div className="sidebar" data-role={sidebarRole}>
      <div className="sidebar-brand">
        <div className="shop-name gold-text" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.svg" alt="Logo" style={{ height: '32px' }} />
          <div>
            Sri Nikil
            <br />
            Tradings
          </div>
        </div>
        <div className="user-role">{role.toUpperCase()}</div>
      </div>

      <div className="sidebar-nav">
        <>
          <div className="nav-group-label">Main</div>
          <NavItem id="dashboard" icon={<SidebarIcon name="dashboard" />} label="Dashboard" currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {!canManageAdminPages && (
            <NavItem id="billing" icon={<SidebarIcon name="billing" />} label="Billing" currentPage={currentPage} setCurrentPage={setCurrentPage} />
          )}

          <div className="nav-group-label">Inventory</div>
          <NavItem id="products" icon={<SidebarIcon name="products" />} label="Products" currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <NavItem id="stock" icon={<SidebarIcon name="stock" />} label="Stock" currentPage={currentPage} setCurrentPage={setCurrentPage} />
          {canManageAdminPages ? (
            <NavItem id="pricing" icon={<SidebarIcon name="pricing" />} label="Pricing" currentPage={currentPage} setCurrentPage={setCurrentPage} />
          ) : null}
          <NavItem id="priceboard" icon={<SidebarIcon name="priceboard" />} label="Price Board" currentPage={currentPage} setCurrentPage={setCurrentPage} />

          {canManageAdminPages && (
            <>
              <div className="nav-group-label">Business</div>
              <NavItem id="sales" icon={<SidebarIcon name="sales" />} label="Sales" currentPage={currentPage} setCurrentPage={setCurrentPage} />
              {canViewCustomers ? (
                <NavItem id="customers" icon={<SidebarIcon name="customers" />} label="Customers" currentPage={currentPage} setCurrentPage={setCurrentPage} />
              ) : null}

              <div className="nav-group-label">Reports</div>
              <NavItem id="reports" icon={<SidebarIcon name="reports" />} label="Reports" currentPage={currentPage} setCurrentPage={setCurrentPage} />

              <div className="nav-group-label">Admin</div>
              <NavItem id="loginlog" icon={<SidebarIcon name="loginlog" />} label="Login Activity" currentPage={currentPage} setCurrentPage={setCurrentPage} />
              {canViewSettings ? (
                <NavItem id="settings" icon={<SidebarIcon name="settings" />} label="Settings" currentPage={currentPage} setCurrentPage={setCurrentPage} />
              ) : null}
            </>
          )}
        </>
      </div>

      <div className="sidebar-footer">
        <button className="btn btn-secondary btn-full btn-sm" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}
