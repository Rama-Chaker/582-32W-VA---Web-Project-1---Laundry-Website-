import React, { useState, useEffect } from 'react';
import './css/AdminDashboard.css';

export default function AdminExpenses({ currentUser, onExpenseAdded }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);

  // Track if we are editing an existing expense (expenseId or null)
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  // Form input state
  const [expenseItem, setExpenseItem] = useState('');
  const [category, setCategory] = useState('');
  const [cost, setCost] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  function fetchExpenses() {
    fetch('http://127.0.0.1:5000/api/admin/expenses')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setExpenses(data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading expenses:', error);
        setLoading(false);
      });
  }

  // Open modal for adding a fresh expense
  function handleOpenAddModal() {
    setEditingExpenseId(null);
    setExpenseItem('');
    setCategory('');
    setCost('');
    setDate('');
    setShowModal(true);
  }

  // Open modal and pre-fill form fields for editing
  function handleOpenEditModal(expense) {
    setEditingExpenseId(expense.id);
    setExpenseItem(expense.title || '');
    setCategory(expense.category || '');
    setCost(expense.amount ? expense.amount.toString() : '');
    setDate(expense.date || '');
    setShowModal(true);
  }

  // Close modal and reset fields
  function handleCloseModal() {
    setShowModal(false);
    setEditingExpenseId(null);
    setExpenseItem('');
    setCategory('');
    setCost('');
    setDate('');
  }

  // Save changes (Handles both ADD and EDIT)
  function handleSaveExpense(event) {
    event.preventDefault();

    if (!expenseItem || !category || !cost || !date) {
      alert('Please fill in all expense fields.');
      return;
    }

    const payload = {
      title: expenseItem,
      category: category,
      amount: parseFloat(cost),
      date: date,
      user_id: currentUser ? currentUser.id : 1
    };

    let url = 'http://127.0.0.1:5000/api/admin/expenses';
    let httpMethod = 'POST';

    // If editing, point to the specific expense endpoint with PUT
    if (editingExpenseId) {
      url = `http://127.0.0.1:5000/api/admin/expenses/${editingExpenseId}`;
      httpMethod = 'PUT';
    }

    fetch(url, {
      method: httpMethod,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then( (response) => {
        return response.json();
      })
      .then( () => {
        if (editingExpenseId) {
          alert('Expense updated successfully!');
        } else {
          alert('New expense logged successfully!');
        }

        handleCloseModal();
        fetchExpenses(); // Refresh expense list

        if (onExpenseAdded) {
          onExpenseAdded(); // Refresh Total Expenses in dashboard stats
        }
      })
      .catch((error) => {
        console.error('Error saving expense:', error);
      });
  }

  return (
    <div className="expenses-tab-container">
      <section className="recent-orders-card">
        <div className="table-header-flex">
          <h3>Expenses Log</h3>
          <button className="btn-add-expense" onClick={handleOpenAddModal}>
            Add Expense +
          </button>
        </div>

        {loading ? (
          <p className="loading-state">Loading expenses...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Expense Item</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-table">No expenses logged yet.</td>
                </tr>
              ) : (
                expenses.map((item) => {
                  return (
                    <tr key={item.id}>
                      <td className="order-id">{item.title}</td>
                      <td>{item.category}</td>
                      <td className="order-total">${item.amount ? item.amount.toFixed(2) : '0.00'}</td>
                      <td>{item.date}</td>
                      <td>
                        <button 
                          className="btn-update-sm"
                          onClick={() => handleOpenEditModal(item)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </section>

      {/* --- ADD / EDIT EXPENSE POPUP MODAL --- */}
      {showModal ? (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingExpenseId ? 'Edit Expense' : 'Log New Expense'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>✕</button>
            </div>

            <form onSubmit={handleSaveExpense} className="modal-body">
              <div className="form-group-row">
                <label>Expense Item</label>
                <input
                  type="text"
                  placeholder="Detergent Refill"
                  className="expense-input"
                  value={expenseItem}
                  onChange={(e) => setExpenseItem(e.target.value)} />
              </div>

              <div className="form-group-row">
                <label>Category</label>
                <select
                  className="expense-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)} >
                
                  <option value="">Select Category</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Repair">Repair</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              <div className="form-group-row">
                <label>Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="expense-input"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)} />
              </div>

              <div className="form-group-row">
                <label>Date</label>
                <input
                  type="date"
                  className="expense-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)} />
              </div>

              <div className="modal-footer-flex">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}