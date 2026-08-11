import React, { useState, useEffect } from 'react';
import './css/AdminDashboard.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingOrderId, setEditingOrderId] = useState(null);

  // State for showing the order details popup modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect( () => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    fetch('http://127.0.0.1:5000/api/admin/orders')
      .then( (response) => {
        return response.json();
      })
      .then( (data) => {
        setOrders(data || []);
        setLoading(false);
      })
      .catch( (error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  }

  function handleSelectStatus(orderId, newStatus) {
    setEditingOrderId(null);

    fetch(`http://127.0.0.1:5000/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then( (response) => {
        return response.json();
      })
      .then( () => {
        fetchOrders();
        if (onOrderUpdated) {
          onOrderUpdated();
        }
      })
      .catch( (error) => {
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

  // Filter orders list
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'All') {
      return true;
    }
    return order.status === statusFilter;
  });

  return (
    <div className="orders-tab-container">
      <section className="recent-orders-card">
        <div className="table-header-flex">
          <h3>Orders</h3>

          <div className="filter-wrapper">
            <select
              className="filter-dropdown"
              value={statusFilter}
              onChange={ (e) => { setStatusFilter(e.target.value); }}
            >
              <option value="All">Filter By Status (All)</option>
              <option value="Pending">Pending</option>
              <option value="In Wash">In Wash</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="loading-state">Loading orders...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-table">No orders match this filter.</td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isEditing = editingOrderId === order.id;

                  return (
                    <tr key={order.id}>
                      {/* Order number button opens popup modal */}
                      <td className="order-id">
                        <button 
                          className="order-link-btn"
                          onClick={() => setSelectedOrder(order)}
                        >
                          #{order.id}
                        </button>
                      </td>
                      <td>{order.customer_name ? order.customer_name : 'Customer'}</td>
                      <td>{order.service_summary ? order.service_summary : 'General Wash'}</td>
                      <td className="order-total">${order.pricing ? order.pricing.toFixed(2) : '0.00'}</td>
                      <td>
                        <span className={getBadgeClass(order.status)}>
                          {order.status ? order.status : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <div className="action-cell-wrapper">
                          {isEditing ? (
                            <select
                              className="status-dropdown-inline"
                              value={order.status || 'Pending'}
                              onChange={(e) => { handleSelectStatus(order.id, e.target.value); }}
                              onBlur={() => { setEditingOrderId(null); }}
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
                              onClick={() => setEditingOrderId(order.id)}
                            >
                              Edit
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
        )}
      </section>

      {/* Popup Order Details Modal */}
      {selectedOrder ? (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order #{selectedOrder.id} Details</h2>
              <button className="close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <strong>Customer Name:</strong>
                <span>{selectedOrder.customer_name ? selectedOrder.customer_name : 'Customer'}</span>
              </div>

              <div className="detail-row">
                <strong>Service Choice:</strong>
                <span>{selectedOrder.fulfillment_type ? selectedOrder.fulfillment_type : 'In-Store Drop-Off'}</span>
              </div>

              <div className="detail-row">
                <strong>Date & Time:</strong>
                <span>{selectedOrder.date ? selectedOrder.date : 'N/A'} at {selectedOrder.time ? selectedOrder.time : 'N/A'}</span>
              </div>

              <div className="detail-row">
                <strong>Status:</strong>
                <span className={getBadgeClass(selectedOrder.status)}>
                  {selectedOrder.status ? selectedOrder.status : 'Pending'}
                </span>
              </div>

              <hr className="modal-divider" />

              <h4>Items Ordered</h4>
              <ul className="items-list">
                {selectedOrder.items_detail && selectedOrder.items_detail.length > 0 ? (
                  selectedOrder.items_detail.map( (item, index) => {
                    return (
                      <li key={index} className="item-row">
                        <span>{item.name} (x{item.quantity})</span>
                        <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                      </li>
                    );
                  })
                ) : (
                  <li className="item-row"><span>{selectedOrder.service_summary}</span></li>
                )}
              </ul>

              <hr className="modal-divider" />

              <div className="detail-row total-row">
                <strong>Total Amount:</strong>
                <span className="total-amount">${selectedOrder.pricing ? selectedOrder.pricing.toFixed(2) : '0.00'}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-close-modal" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}