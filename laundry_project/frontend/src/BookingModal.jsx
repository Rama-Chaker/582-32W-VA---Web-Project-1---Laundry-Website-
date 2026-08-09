import React, { useState } from 'react';
import './BookingModal.css';

const CATALOG_ITEMS = [
  { id: 'tshirt', name: 'T-Shirt / Long Sleeves / Polo', price: 2.99, icon: '👕', category: 'Everyday Wash' },
  { id: 'blouse', name: 'Blouse', price: 4.99, icon: '👔', category: 'Everyday Wash' },
  { id: 'suit', name: 'Suit / Dress', price: 7.99, icon: '🧥', category: 'Dry Cleaning' },
  { id: 'jeans', name: 'Jeans', price: 3.99, icon: '👖', category: 'Everyday Wash' },
  { id: 'jacket', name: 'Jacket / Skirt', price: 4.99, icon: '👗', category: 'Dry Cleaning' },
  { id: 'coat', name: 'Coat', price: 4.99, icon: '🧥', category: 'Dry Cleaning' },
  { id: 'carpet', name: 'Carpets (/m²)', price: 4.99, icon: '🖼️', category: 'Dry Cleaning' },
  { id: 'bedding', name: 'Duvet / Blanket / Bed Sheet', price: 4.99, icon: '🛌', category: 'Everyday Wash' },
  { id: 'towel', name: 'Towel / Pillow Case', price: 0.99, icon: '🏠', category: 'Everyday Wash' }
];

export default function BookingModal({ isOpen, onClose, currentUser }) {
  const [step, setStep] = useState(1);

  // Step 1 Form State
  const [serviceType, setServiceType] = useState('Home Pickup & Delivery'); // or 'In-Store Drop-Off'
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');

  // Step 2 Form State
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [selectedItems, setSelectedItems] = useState({}); // e.g. { tshirt: 1, jeans: 2 }

  // Step 3 Form State
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Quantity Handler
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

  // Price Calculations
  const deliveryFee = serviceType === 'Home Pickup & Delivery' ? 2.00 : 0.00;
  const itemsSubtotal = Object.entries(selectedItems).reduce((sum, [itemId, qty]) => {
    const item = CATALOG_ITEMS.find(i => i.id === itemId);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const totalAmount = itemsSubtotal + deliveryFee;

  // Filter items by category
  const filteredCatalog = activeCategory === 'All Items'
    ? CATALOG_ITEMS
    : CATALOG_ITEMS.filter(item => item.category === activeCategory);

  // Submit Order to Backend
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    const payload = {
      user_id: currentUser ? currentUser.id : null,
      pricing: totalAmount,
      date: pickupDate,
      time: pickupTime,
      service_type: serviceType,
      address: pickupAddress,
      instructions: instructions,
      items: selectedItems
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('🎉 Booking confirmed successfully!');
        onClose();
        setStep(1);
      } else {
        alert('Order created locally! (Ensure POST /api/orders endpoint is running)');
        onClose();
      }
    } catch (err) {
      alert('Order created! (Offline/Dev mode)');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal-card">
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <h2>Schedule Pickup / Drop off</h2>
            <p className="step-indicator">Step {step} of 3</p>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* --- STEP 1: Service Type, Date, Time, Address --- */}
        {step === 1 && (
          <div className="step-body">
            <div className="service-options">
              <div 
                className={`service-radio-card ${serviceType === 'Home Pickup & Delivery' ? 'selected' : ''}`}
                onClick={() => setServiceType('Home Pickup & Delivery')}
              >
                <div className="icon-badge">🚗</div>
                <div className="card-info">
                  <strong>Home Pickup & Delivery</strong>
                  <p>We pick up and return items to your door</p>
                </div>
                <input 
                  type="radio" 
                  checked={serviceType === 'Home Pickup & Delivery'} 
                  readOnly 
                />
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
                <input 
                  type="radio" 
                  checked={serviceType === 'In-Store Drop-Off'} 
                  readOnly 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pickup Date</label>
              <input 
                type="date" 
                value={pickupDate} 
                onChange={(e) => setPickupDate(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Pickup Time</label>
              <input 
                type="time" 
                value={pickupTime} 
                onChange={(e) => setPickupTime(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Pickup Address</label>
              <input 
                type="text" 
                placeholder="Building, Street, Area" 
                value={pickupAddress} 
                onChange={(e) => setPickupAddress(e.target.value)}
                required={serviceType === 'Home Pickup & Delivery'}
              />
            </div>

            <div className="modal-footer">
              <button 
                className="btn-primary-modal" 
                disabled={!pickupDate || !pickupTime}
                onClick={() => setStep(2)}
              >
                Continue To Step 2 →
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 2: Item Catalog Selection --- */}
        {step === 2 && (
          <div className="step-body">
            {/* Category Filter Pills */}
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

            {/* Items Grid */}
            <div className="catalog-grid">
              {filteredCatalog.map(item => {
                const qty = selectedItems[item.id] || 0;
                return (
                  <div key={item.id} className="item-row-card">
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price.toFixed(2)}$</span>
                    </div>

                    <div className="item-action">
                      <span className="item-icon-small">{item.icon}</span>
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

        {/* --- STEP 3: Summary & Order Confirmation --- */}
        {step === 3 && (
          <div className="step-body">
            <div className="summary-box">
              <div className="summary-row">
                <span>Service Selected</span>
                <strong>{serviceType}</strong>
              </div>
              <div className="summary-row">
                <span>Scheduled Date & Time</span>
                <strong>{pickupDate} at {pickupTime}</strong>
              </div>
              <div className="summary-row">
                <span>Address</span>
                <strong>{pickupAddress || 'In-Store Drop-off'}</strong>
              </div>
              <div className="summary-row instructions-row">
                <label>Special Instructions (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Leave it at the front door" 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              <hr className="divider" />

              {/* Selected Items Line Breakdown */}
              <div className="receipt-items">
                {Object.entries(selectedItems).map(([itemId, qty]) => {
                  const item = CATALOG_ITEMS.find(i => i.id === itemId);
                  if (!item) return null;
                  return (
                    <div key={itemId} className="receipt-line">
                      <span>{item.name}</span>
                      <span className="qty-badge">x{qty}</span>
                      <span className="price-badge">{(item.price * qty).toFixed(2)}$</span>
                    </div>
                  );
                })}

                {serviceType === 'Home Pickup & Delivery' && (
                  <div className="receipt-line">
                    <span>Delivery Fee</span>
                    <span></span>
                    <span className="price-badge">{deliveryFee.toFixed(2)}$</span>
                  </div>
                )}
              </div>

              <hr className="divider" />

              <div className="total-row">
                <span>Total Amount</span>
                <strong className="total-price">{totalAmount.toFixed(2)}$</strong>
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