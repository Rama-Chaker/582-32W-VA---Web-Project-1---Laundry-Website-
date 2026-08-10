import React, { useState, useEffect } from 'react';
import './css/AdminDashboard.css';

export default function AdminDashboard({ currentUser, onLogout, onNavigateHome }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track which row currently has its dropdown open (orderId or null)
  const [editingOrderId, setEditingOrderId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  function loadDashboardData() {
    fetch('http://127.0.0.1:5000/api/admin/dashboard')
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setRevenue(data.total_revenue || 0);
        setExpenses(data.total_expenses || 0);
        setTotalOrders(data.total_orders || 0);
        setRecentOrders(data.recent_orders || []);
        setLoading(false);
      })
      .catch(function (error) {
        console.error('Error loading admin dashboard:', error);
        setLoading(false);
      });
  }

  // Toggle the dropdown for a specific order row
  function toggleDropdown(orderId) {
    if (editingOrderId === orderId) {
      setEditingOrderId(null);
    } else {
      setEditingOrderId(orderId);
    }
  }

  // Handle choice selection from dropdown
  function handleSelectStatus(orderId, newStatus) {
    setEditingOrderId(null);

    fetch(`http://127.0.0.1:5000/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        loadDashboardData();
      })
      .catch(function (error) {
        console.error('Error updating status:', error);
      });
  }

  function getBadgeClass(status) {
    if (status === 'In Wash') {
      return 'status-badge in-wash';
    }
    if (status === 'Completed') {
      return 'status-badge completed';
    }
    if (status === 'Cancelled') {
      return 'status-badge cancelled';
    }
    return 'status-badge pending';
  }

  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand" onClick={onNavigateHome}>
          <h2>Violetta Admin</h2>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={activeTab === 'Dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('Dashboard')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>

          <button 
            className={activeTab === 'Orders' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('Orders')}
          >
            <span className="nav-icon">🧺</span>
            Orders
          </button>

          <button 
            className={activeTab === 'Expenses' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('Expenses')}
          >
            <span className="nav-icon">💵</span>
            Expenses & Finance
          </button>

          <button 
            className={activeTab === 'Customers' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('Customers')}
          >
            <span className="nav-icon">👥</span>
            Customers
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Dashboard Overview</h1>
          <button className="user-avatar-btn" onClick={onLogout} title="Logout">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b2b68" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
        </header>

        {loading ? (
          <p className="loading-state">Loading dashboard data...</p>
        ) : (
          <div className="dashboard-content">
            {/* Top Cards Section */}
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Total Revenue</span>
                <span className="stat-value">${revenue.toFixed(2)}</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Total Expenses</span>
                <span className="stat-value">${expenses.toFixed(2)}</span>
              </div>

              <div className="stat-card">
                <span className="stat-label">Total Orders</span>
                <span className="stat-value">{totalOrders}</span>
              </div>
            </div>

            {/* Recent Orders Section */}
            <section className="recent-orders-card">
              <h3>Recent Orders</h3>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-table">No orders found.</td>
                    </tr>
                  ) : (
                    recentOrders.map(function (order) {
                      const isEditing = editingOrderId === order.id;

                      return (
                        <tr key={order.id}>
                          <td className="order-id">#{order.id}</td>
                          <td>{order.customer_name || 'Customer'}</td>
                          <td className="order-total">${order.pricing ? order.pricing.toFixed(2) : '0.00'}</td>
                          <td>
                            <span className={getBadgeClass(order.status)}>
                              {order.status || 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div className="action-cell-wrapper">
                              {isEditing ? (
                                <select
                                  className="status-dropdown-inline"
                                  value={order.status || 'Pending'}
                                  onChange={(e) => handleSelectStatus(order.id, e.target.value)}
                                  onBlur={() => setEditingOrderId(null)}
                                  autoFocus
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Wash">In Wash</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              ) : (
                                <button 
                                  className="btn-update-sm"
                                  onClick={() => toggleDropdown(order.id)}
                                >
                                  Update
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}