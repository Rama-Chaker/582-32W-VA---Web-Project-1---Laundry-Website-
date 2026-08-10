import React, { useState, useEffect } from 'react';
import './css/BookingModal.css';

export default function BookingModal({ isOpen, onClose, currentUser }) {
  const [step, setStep] = useState(1);
  const [catalogItems, setCatalogItems] = useState([]);

  // Form states
  const [serviceType, setServiceType] = useState('In-Store Drop-Off');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [selectedItems, setSelectedItems] = useState({});
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('http://127.0.0.1:5000/api/items')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCatalogItems(data);
          }
        })
        .catch(err => console.error('Error fetching choices:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const updateQuantity = (itemId, delta) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || 0;
      const updated = current + delta;
      if (updated <= 0) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      }
      return { ...prev, [itemId]: updated };
    });
  };

  const deliveryFee = serviceType === 'Home Pickup & Delivery' ? 2.00 : 0.00;
  
  const itemsSubtotal = Object.entries(selectedItems).reduce((sum, [itemId, qty]) => {
    const item = catalogItems.find(i => i.id === parseInt(itemId) || i.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const totalAmount = itemsSubtotal + deliveryFee;

  const filteredCatalog = activeCategory === 'All Items'
    ? catalogItems
    : catalogItems.filter(item => item.category === activeCategory);

  const handleConfirmBooking = async () => {
    if (!currentUser) {
      alert('Please log in first to confirm your booking.');
      return;
    }

    setIsSubmitting(true);
    
    const payload = {
      user_id: currentUser.id,
      service_type: serviceType,
      date: pickupDate,
      time: pickupTime,
      address: pickupAddress,
      instructions: instructions,
      total_price: totalAmount,
      items: selectedItems
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Booking submitted successfully!');
        onClose();
        setStep(1);
        setSelectedItems({});
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to submit order.');
      }
    } catch (err) {
      alert('Network error. Make sure your Python Flask backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal-card">
        <div className="modal-header">
          <div>
            <h2>Schedule Pickup / Drop off</h2>
            <p className="step-indicator">Step {step} of 3</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {step === 1 && (
          <div className="step-body">
            <div className="service-options">
              <div 
                className="service-radio-card disabled"
                style={{ opacity: 0.5, cursor: 'not-allowed', position: 'relative' }}
              >
                <div className="icon-badge">🚗</div>
                <div className="card-info">
                  <strong>Home Pickup & Delivery</strong>
                  <p>We pick up and return items to your door</p>
                </div>
              </div>

              <div 
                className={`service-radio-card ${serviceType === 'In-Store Drop-Off' ? 'selected' : ''}`}
                onClick={() => setServiceType('In-Store Drop-Off')}
              >
                <div className="icon-badge">🏪</div>
                <div className="card-info">
                  <strong>In-Store Drop-Off</strong>
                  <p>Bring items directly to our store.</p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Pickup Date</label>
              <input 
                type="date" 
                value={pickupDate} 
                onChange={(e) => setPickupDate(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Pickup Time</label>
              <input 
                type="time" 
                value={pickupTime} 
                onChange={(e) => setPickupTime(e.target.value)} 
              />
            </div>

            {serviceType === 'Home Pickup & Delivery' && (
              <div className="form-group">
                <label>Pickup Address</label>
                <input 
                  type="text" 
                  placeholder="Building, Street, Area" 
                  value={pickupAddress} 
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
              </div>
            )}

            <div className="modal-footer">
              <button 
                className="btn-primary-modal" 
                disabled={!pickupDate || !pickupTime || (serviceType === 'Home Pickup & Delivery' && !pickupAddress)}
                onClick={() => setStep(2)}
              >
                Continue To Step 2 →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="step-body">
            <div className="category-pills">
              {['All Items', 'Everyday Wash', 'Dry Cleaning'].map(cat => (
                <button
                  key={cat}
                  className={`pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="catalog-grid">
              {filteredCatalog.map(item => {
                const qty = selectedItems[item.id] || 0;
                return (
                  <div key={item.id} className="item-row-card">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">${item.price.toFixed(2)}</span>
                    </div>

                    <div className="item-action">
                      {qty === 0 ? (
                        <button className="add-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                      ) : (
                        <div className="qty-controls">
                          <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                          <span>{qty}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-footer step-between">
              <button className="btn-secondary-modal" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button 
                className="btn-primary-modal" 
                disabled={Object.keys(selectedItems).length === 0}
                onClick={() => setStep(3)}
              >
                Continue To Step 3 →
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-body">
            <div className="summary-box">
              <div className="summary-row">
                <span>Service Selected:</span>
                <strong>{serviceType}</strong>
              </div>
              <div className="summary-row">
                <span>Scheduled Date & Time:</span>
                <strong>{pickupDate} at {pickupTime}</strong>
              </div>
              <div className="summary-row">
                <span>Address:</span>
                <strong>{pickupAddress || 'In-Store Drop-off'}</strong>
              </div>
              <div className="instructions-row">
                <label>Special Instructions (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Leave with security" 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <hr className="divider" />

              <div className="receipt-items">
                {Object.entries(selectedItems).map(([itemId, qty]) => {
                  const item = catalogItems.find(i => i.id === parseInt(itemId) || i.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="receipt-line">
                      <span>{item.name}</span>
                      <span>x{qty}</span>
                      <span>${(item.price * qty).toFixed(2)}</span>
                    </div>
                  );
                })}

                {serviceType === 'Home Pickup & Delivery' && (
                  <div className="receipt-line">
                    <span>Delivery Fee</span>
                    <span></span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <hr className="divider" />

              <div className="total-row">
                <span>Total Amount</span>
                <strong>${totalAmount.toFixed(2)}</strong>
              </div>
            </div>

            <div className="modal-footer step-between">
              <button className="btn-secondary-modal" onClick={() => setStep(2)}>
                ← Back
              </button>
              <button 
                className="btn-primary-modal" 
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}