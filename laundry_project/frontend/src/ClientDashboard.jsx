import React, { useState, useEffect } from "react";
import {
    User,
    ShoppingBag,
    Mail,
    Phone,
    FileText,
    LogOut,
    Home,
    Loader,
} from "lucide-react";
import "./css/ClientDashboard.css";

export default function ClientDashboard({ currentUser, onLogout, onNavigateHome }) {
    const [activeTab, setActiveTab] = useState("profile");

    // Dynamic State from DB
    const [userInfo, setUserInfo] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Profile Edit States
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
    });

    const handleViewDetails = async (order) => {
        setSelectedOrder(order);
        setLoadingDetails(true);

        try {
            const res = await fetch(`/api/orders/${order.id}/items`);
            if (res.ok) {
                const data = await res.json();
                setOrderDetails(data);
            }
        } catch (err) {
            console.error("Failed to fetch order items:", err);
        } finally {
            setLoadingDetails(false);
        }
    };

    // Fetch User Info & Orders from Backend on Component Mount
    useEffect(() => {
        console.log("Current User in Dashboard:", currentUser);

        if (!currentUser?.id) return;

        const fetchClientData = async () => {
            try {
                setLoading(true);

                // 1. Fetch Profile Data
                try {
                    const profileRes = await fetch(
                        `/api/client/profile/${currentUser.id}`,
                    );
                    console.log("Profile Status:", profileRes.status);
                    if (profileRes.ok) {
                        const profileData = await profileRes.json();
                        setUserInfo(profileData);
                    }
                } catch (e) {
                    console.error("Error loading profile:", e);
                }

                // 2. Fetch Orders
                try {
                    const ordersRes = await fetch(
                        `/api/client/orders/${currentUser.id}`,
                    );
                    console.log("Orders Status:", ordersRes.status);
                    const contentType = ordersRes.headers.get("content-type");

                    if (
                        ordersRes.ok &&
                        contentType &&
                        contentType.includes("application/json")
                    ) {
                        const ordersData = await ordersRes.json();
                        console.log("Orders Data:", ordersData);
                        setOrders(ordersData);
                    } else {
                        const rawText = await ordersRes.text();
                        console.error(
                            "Orders returned non-JSON response:",
                            rawText,
                        );
                    }
                } catch (e) {
                    console.error("Error loading orders:", e);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [currentUser]);

    const renderStatusBadge = (status) => {
        switch (status) {
            case "Completed":
                return (
                    <span className="status-badge status-completed">
                        {status}
                    </span>
                );
            case "In Wash":
            case "In Progress":
                return (
                    <span className="status-badge status-wash">{status}</span>
                );
            case "Pending":
            default:
                return (
                    <span className="status-badge status-pending">
                        {status}
                    </span>
                );
        }
    };

    // Fallback data source (DB data first, then currentUser prop)
    const displayUser = userInfo || currentUser;

    const handleStartEdit = () => {
        setFormData({
            username: displayUser?.username || "",
            email: displayUser?.email || "",
            phone: displayUser?.phone || "",
        });
        setIsEditing(true);
    };

    // Strict phone validation: allows only digits and a single leading '+'
    const handlePhoneChange = (e) => {
        let input = e.target.value;
        
        // Strip everything except numbers and '+'
        input = input.replace(/[^0-9+]/g, "");

        // Ensure '+' can only appear at index 0
        if (input.indexOf("+") > 0) {
            input = input.replace(/\+/g, (match, offset) => (offset === 0 ? "+" : ""));
        }

        setFormData((prev) => ({ ...prev, phone: input }));
    };

    // Save profile handler with API update & state sync
   const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        const res = await fetch(`/api/client/profile/${currentUser.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
            // Extract the user object from the API response
            const updatedUser = data.user || data;

            // Map backend 'phone_number' or 'phone' to expected front-end state key
            setUserInfo({
                ...updatedUser,
                phone: updatedUser.phone || updatedUser.phone_number || formData.phone,
            });

            setIsEditing(false);
        } else {
            setError(data.message || data.error || "Failed to update profile.");
        }
    } catch (err) {
        console.error("Error saving profile:", err);
        setError("Network error. Please try again.");
    }
};

    if (loading) {
        return (
            <div className="dashboard-loading">
                <Loader className="spin-icon" size={32} />
                <p>Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            {/* ---------------- SIDEBAR ---------------- */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2>
                        Hello {displayUser?.username?.split(" ")[0] || "User"}
                    </h2>
                </div>

                <nav className="sidebar-menu">
                    <button
                        className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
                        onClick={() => setActiveTab("profile")}
                    >
                        <User size={18} />
                        <span>My Profile</span>
                    </button>

                    <button
                        className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
                        onClick={() => setActiveTab("orders")}
                    >
                        <ShoppingBag size={18} />
                        <span>Orders</span>
                    </button>
                </nav>

                {onLogout && (
                    <button className="btn-logout-sidebar" onClick={onLogout}>
                        <LogOut size={16} /> Sign Out
                    </button>
                )}
            </aside>

            {/* ---------------- MAIN CONTENT AREA ---------------- */}
            <main className="dashboard-main">
                <header className="dashboard-topbar">
                    <h1>
                        <em>{displayUser?.username || "User"}’s</em>{" "}
                        {activeTab === "profile" ? "Profile" : "Orders"}
                    </h1>
                    {/* Top Right Home Button */}
                    <button 
                        className="user-avatar-top clickable" 
                        onClick={onNavigateHome} 
                        title="Go to Home"
                    >
                        <Home size={22} />
                    </button>
                </header>

                {error && <div className="dashboard-error-banner">{error}</div>}

                {/* --- TAB 1: MY PROFILE --- */}
                {activeTab === "profile" && (
                    <div className="tab-content profile-tab-content">
                        <div className="profile-card-main">
                            <div className="profile-avatar-large">
                                <User size={48} />
                            </div>

                            {!isEditing ? (
                                <>
                                    <h3 className="user-fullname">
                                        {displayUser?.username || "Client Name"}
                                    </h3>

                                    <div className="info-list">
                                        <div className="info-row">
                                            <User size={16} className="info-icon" />
                                            <span>{displayUser?.role || "Client"}</span>
                                        </div>

                                        <div className="info-row">
                                            <Mail size={16} className="info-icon" />
                                            <span>{displayUser?.email || "No email available"}</span>
                                        </div>

                                        <div className="info-row">
                                            <Phone size={16} className="info-icon" />
                                            <span>{displayUser?.phone || "No phone number"}</span>
                                        </div>
                                    </div>

                                    <button className="btn-edit-profile" onClick={handleStartEdit}>
                                        Edit Profile
                                    </button>
                                </>
                            ) : (
                                <form className="profile-edit-form" onSubmit={handleSaveProfile}>
                                    <div className="form-group">
                                        <label>Username</label>
                                        <input
                                            type="text"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                        />
                                    </div>

                                    <div className="edit-actions">
                                        <button type="submit" className="btn-edit-profile">
                                            Save Changes
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn-cancel-edit" 
                                            onClick={() => setIsEditing(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                {/* --- TAB 2: ORDERS --- */}
                {activeTab === "orders" && (
                    <div className="tab-content orders-tab-content">
                        <div className="orders-table-card">
                            <h3 className="table-title">Recent Orders</h3>

                            {orders.length === 0 ? (
                                <p className="empty-orders-msg">
                                    No orders found in database.
                                </p>
                            ) : (
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Order #</th>
                                            <th>Date</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-slate-50/50"
                                            >
                                                <td className="py-3 px-4 text-sm font-semibold text-slate-800">
                                                    #{order.id}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-slate-600">
                                                    {order.date}
                                                </td>
                                                <td className="py-3 px-4 text-sm font-medium text-slate-800">
                                                    $
                                                    {order.pricing != null
                                                        ? order.pricing.toFixed(2)
                                                        : "0.00"}
                                                </td>
                                                <td className="py-3 px-4 text-sm">
                                                    {renderStatusBadge(order.status)}
                                                </td>
                                                <td className="py-3 px-4 text-sm text-right">
                                                    <button
                                                        className="btn-view-details"
                                                        onClick={() => handleViewDetails(order)}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {/* Centered Popup Overlay */}
                            {selectedOrder && (
                                <div
                                    className="modal-overlay"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    <div
                                        className="order-details-modal"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <h3>
                                            Order #{selectedOrder.id} Details
                                        </h3>
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {selectedOrder.date}
                                        </p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            {selectedOrder.status}
                                        </p>

                                        {loadingDetails ? (
                                            <p className="modal-loading-text">
                                                Loading items...
                                            </p>
                                        ) : (
                                            <table className="modal-items-table">
                                                <thead>
                                                    <tr>
                                                        <th>Item Name</th>
                                                        <th>Qty</th>
                                                        <th>Unit Price</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orderDetails.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.item_name}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>${item.unit_price}</td>
                                                            <td>
                                                                $
                                                                {(
                                                                    item.quantity *
                                                                    item.unit_price
                                                                ).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                        <button
                                            className="btn-close-modal"
                                            onClick={() => setSelectedOrder(null)}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}