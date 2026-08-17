import React, { useState } from "react";
import "./css/Pricing.css";
import logoImg from "./assets/violettaLaundryLogo.jpeg";
import BookingModal from "./BookingModal";
import {
    Tag,
    Shirt,
    Truck,
    Shield,
    Star,
    Gift,
    User,
    Home,
    MapPin,
    Phone,
    MessageSquare,
    Clock,
    Mail,
} from "lucide-react";

export default function Pricing({
    currentUser,
    onNavigateToHome,
    onNavigateToServices,
    onNavigateToAbout,
    onNavigateToAuth,
    onNavigateToAdmin,
    onLogout,
}) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

     function scrollToContact() {
        const contactElement = document.getElementById("contact");
        if (contactElement) {
            contactElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    // Check login state before opening booking modal or subscribing
    const handleBookPickup = () => {
        if (!currentUser) {
            alert("Please log in first to book a pickup.");
            onNavigateToAuth();
            return;
        }
        setIsBookingOpen(true);
    };

    const handleSubscribe = (packageName) => {
        if (!currentUser) {
            alert(
                `Please log in first to subscribe to the ${packageName} package.`,
            );
            onNavigateToAuth();
            return;
        }
        alert(`Thank you for selecting the ${packageName} package!`);
    };

    return (
        <div className="pricing-page">
            {/* --- HEADER NAVBAR --- */}
            <header className="pricing-navbar">
                <div className="navbar-container">
                    <div className="logo-area" onClick={onNavigateToHome}>
                        <img
                            src={logoImg}
                            alt="Violetta Laundry Logo"
                            className="brand-logo"
                        />
                    </div>

                    <nav className="nav-links">
                        <a
                            href="#home"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigateToHome();
                            }}
                        >
                            Home
                        </a>
                        <a
                            href="#services"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigateToServices();
                            }}
                        >
                            Services
                        </a>
                        <a
                            href="#about"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigateToAbout();
                            }}
                        >
                            About Us
                        </a>
                        <a href="#pricings" className="active-link">
                            Pricings
                        </a>
                       <a
                            href="#contact"
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToContact();
                            }}
                        >
                            Contact
                        </a>
                    </nav>

                    <div className="header-actions">
                        <button
                            className="btn-primary-pill"
                            onClick={handleBookPickup}
                        >
                            Book Pickup
                        </button>

                        {currentUser ? (
                            <div className="user-profile-badge">
                                <span>
                                    Hi, <strong>{currentUser.username}</strong>
                                </span>
                                <button
                                    className="btn-logout-sm"
                                    onClick={onLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn-outline-pill"
                                onClick={onNavigateToAuth}
                            >
                                Sign In / Register
                            </button>
                        )}

                        <button
                            className="user-icon-btn"
                            onClick={() =>
                                currentUser?.role === "Admin"
                                    ? onNavigateToAdmin()
                                    : onNavigateToAuth()
                            }
                            title="Account"
                        >
                            <User size={22} />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MONTHLY PACKAGES SECTION --- */}
            <section className="packages-container">
                <div className="packages-wrapper">
                    <h1 className="main-title">
                        Violetta Laundry – Monthly Wash & Iron Packages
                    </h1>

                    <div className="promo-badge">
                        <Tag size={18} />
                        <span>Order Now & Get 50% OFF On Your First Order</span>
                    </div>

                    {/* 3 Monthly Subscription Cards */}
                    <div className="cards-grid">
                        {/* Starter Card */}
                        <div className="package-card">
                            <div className="card-icon-circle">
                                <Tag size={20} color="#3b2b68" />
                            </div>
                            <h2>Starter</h2>
                            <div className="price-tag">59 $ / Month</div>
                            <ul className="card-features">
                                <li>
                                    <Shirt size={16} /> Up To 40 pieces
                                </li>
                                <li>
                                    <Truck size={16} /> x2 Per Week Free pick-up
                                    & delivery
                                </li>
                            </ul>
                            <button
                                className="btn-subscribe"
                                onClick={() => handleSubscribe("Starter")}
                            >
                                Subscribe Now
                            </button>
                        </div>

                        {/* Family Saver Card */}
                        <div className="package-card">
                            <div className="card-icon-circle">
                                <Home size={20} color="#3b2b68" />
                            </div>
                            <h2>Family Saver</h2>
                            <div className="price-tag">89 $ / Month</div>
                            <ul className="card-features">
                                <li>
                                    <Shirt size={16} /> Up To 75 pieces
                                </li>
                                <li>
                                    <Truck size={16} /> x3 Per Week Free pick-up
                                    & delivery
                                </li>
                            </ul>
                            <button
                                className="btn-subscribe"
                                onClick={() => handleSubscribe("Family Saver")}
                            >
                                Subscribe Now
                            </button>
                        </div>

                        {/* VIP Care Card */}
                        <div className="package-card">
                            <div className="card-icon-circle">
                                <Star size={20} color="#3b2b68" />
                            </div>
                            <h2>VIP Care</h2>
                            <div className="price-tag">129 $ / Month</div>
                            <ul className="card-features">
                                <li>
                                    <Shirt size={16} /> Up To 40 pieces
                                </li>
                                <li>
                                    <Truck size={16} /> x4 Per Week Free pick-up
                                    & delivery
                                </li>
                                <li>
                                    <Shield size={16} /> Priority Handling
                                </li>
                                <li>
                                    <Gift size={16} /> 5 Extra Pieces Free
                                </li>
                            </ul>
                            <button
                                className="btn-subscribe"
                                onClick={() => handleSubscribe("VIP Care")}
                            >
                                Subscribe Now
                            </button>
                        </div>
                    </div>

                    {/* No Payment Upfront Note Banner */}
                    <div className="satisfaction-banner">
                        Pay only at the end of the month – after you’re
                        satisfied
                    </div>
                </div>
            </section>

            {/* --- OUR PRICING (ITEMIZED PILLS) SECTION --- */}
            <section className="itemized-pricing-section">
                <h2 className="section-title">Our Pricing</h2>

                <div className="itemized-list">
                    {/* Row 1: Full width */}
                    <div className="price-pill full-width">
                        <span>Wash & Fold</span>
                        <span className="price-value">
                            4.99 $ / KG <Shirt size={18} />
                        </span>
                    </div>

                    {/* Row 2: 2 items */}
                    <div className="price-row-2">
                        <div className="price-pill">
                            <span>Blouse</span>
                            <span className="price-value">
                                4.99 $ <Shirt size={18} />
                            </span>
                        </div>
                        <div className="price-pill">
                            <span>
                                Suit / Dress <small>Starting from</small>
                            </span>
                            <span className="price-value">
                                7.99 $ <Shirt size={18} />
                            </span>
                        </div>
                    </div>

                    {/* Row 3: 2 items */}
                    <div className="price-row-2">
                        <div className="price-pill">
                            <span>Jeans</span>
                            <span className="price-value">
                                3.99 $ <Shirt size={18} />
                            </span>
                        </div>
                        <div className="price-pill">
                            <span>
                                Jacket / Skirt <small>Starting from</small>
                            </span>
                            <span className="price-value">
                                4.99 $ <Shirt size={18} />
                            </span>
                        </div>
                    </div>

                    {/* Row 4: 2 items */}
                    <div className="price-row-2">
                        <div className="price-pill">
                            <span>
                                Coat <small>Starting from</small>
                            </span>
                            <span className="price-value">
                                9.99 $ <Shirt size={18} />
                            </span>
                        </div>
                        <div className="price-pill">
                            <span>
                                Carpets <small>Starting from</small>
                            </span>
                            <span className="price-value">
                                4.99 $ / m² <Home size={18} />
                            </span>
                        </div>
                    </div>

                    {/* Row 5: Full width */}
                    <div className="price-pill full-width">
                        <span>T-Shirt / Long Sleeves Shirt / Polo</span>
                        <span className="price-value">
                            2.99 $ <Shirt size={18} />
                        </span>
                    </div>

                    {/* Row 6: Full width */}
                    <div className="price-pill full-width">
                        <span>
                            Duvet / Blanket / Bed Sheet / Fitted Sheets / Pillow
                            / Table Cloth / Sofa Cover{" "}
                            <small>Starting from</small>
                        </span>
                        <span className="price-value">
                            4.99 $ <Home size={18} />
                        </span>
                    </div>

                    {/* Row 7: Full width */}
                    <div className="price-pill full-width">
                        <span>
                            Towel / Pillow Case <small>Starting from</small>
                        </span>
                        <span className="price-value">
                            0.99 $ <Home size={18} />
                        </span>
                    </div>
                </div>
            </section>

            {/* --- FOOTER SECTION --- */}
            <footer id="contact" className="site-footer">
                <div className="footer-container">
                    {/* Logo & Description */}
                    <div className="footer-col brand-col">
                        <img
                            src={logoImg}
                            alt="Violetta Laundry"
                            className="footer-logo"
                        />
                        <p>
                            Professional laundry and dry cleaning services with
                            exceptional care, fast turnaround, and customer
                            satisfaction.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-col">
                        <h3>Quick Links</h3>
                        <ul>
                            <li>
                                <a href="#home" onClick={onNavigateToHome}>
                                    1. Home
                                </a>
                            </li>
                            <li>
                                <a href="#about" onClick={onNavigateToAbout}>
                                    2. About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={onNavigateToServices}
                                >
                                    3. Services
                                </a>
                            </li>
                            <li>
                                <a href="#contact">4. Contact</a>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="footer-col">
                        <h3>Services</h3>
                        <ul>
                            <li>1. Wash & Fold</li>
                            <li>2. Dry Cleaning</li>
                            <li>3. Ironing</li>
                            <li>4. Comforters & Blankets</li>
                            <li>5. Curtains</li>
                            <li>6. Pickup & Delivery</li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="footer-col">
                        <h3>Contact Us</h3>
                        <ul className="contact-list">
                            <li>
                                <MapPin size={16} /> St Sarkis & Bakhos Jdeideh,
                                street 10-7, GF
                            </li>
                            <li>
                                <Phone size={16} /> +961 1 890 566
                            </li>
                            <li>
                                <MessageSquare size={16} /> +961 81 669 373
                            </li>
                            <li>
                                <Clock size={16} /> Monday → Friday: 8h00 →
                                19h00 | Saturday: 8h00 → 14h00
                            </li>
                            <li>
                                <Mail size={16} /> info@violettalaundry.com
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>

            {/* Booking Modal Popup */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                currentUser={currentUser}
            />
        </div>
    );
}
