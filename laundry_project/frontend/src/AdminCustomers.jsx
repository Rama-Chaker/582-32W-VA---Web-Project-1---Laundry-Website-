import React, { useState, useEffect } from 'react';
import './css/AdminDashboard.css';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    fetchCustomers();
  }, []);

  function fetchCustomers() {
    fetch('http://127.0.0.1:5000/api/admin/customers')
      .then( (response) => {
        return response.json();
      })
      .then( (data) => {
        setCustomers(data || []);
        setLoading(false);
      })
      .catch( (error) => {
        console.error('Error fetching customers directory:', error);
        setLoading(false);
      });
  }

  return (
    <div className="customers-tab-container">
      <section className="recent-orders-card">
        <div className="table-header-flex">
          <h3>Customers</h3>
        </div>

        {loading ? (
          <p className="loading-state">Loading customers...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Orders</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table">No customers found.</td>
                </tr>
              ) : (
                customers.map((customer) => {
                  return (
                    <tr key={customer.id}>
                      <td className="order-id">{customer.username}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.total_orders}</td>
                      <td className="order-total">${customer.total_spent ? customer.total_spent.toFixed(2) : '0.00'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}