import React, { useState } from "react";
import "./css/Services.css";
import logoImg from "./assets/violettaLaundryLogo.jpeg";
import BookingModal from "./BookingModal";

// Import icons from lucide-react
import {
    Shirt,
    Droplets,
    Sparkles,
    BedDouble,
    Blinds,
    Building2,
    User,
    MapPin,
    Phone,
    MessageCircle,
    Clock,
    Mail,
} from "lucide-react";

export default function Services({
    onNavigateToAuth,
    currentUser,
    onLogout,
    onNavigateHome,
    onNavigateToAbout,
}) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    function scrollToContact() {
        const contactElement = document.getElementById("contact");
        if (contactElement) {
            contactElement.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <div className="services-page">
            {/* --- HEADER NAVBAR --- */}
            <header className="figma-header">
                <div className="header-container">
                    <div className="logo-area" onClick={onNavigateHome}>
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
                                onNavigateHome();
                            }}
                        >
                            Home
                        </a>

                        <a
                            href="#services"
                            className="active-link"
                            onClick={(e) => {
                                e.preventDefault();
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

                        <a
                            href="#offers"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigateHome();
                            }}
                        >
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
                            onClick={(e) => {
                                e.preventDefault();
                                setIsBookingOpen(true);
                            }}
                        >
                            Book Pickup
                        </button>

                        {currentUser ? (
                            <div className="user-profile-badge">
                                <span className="user-name">
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
                                className="btn-outline-pill auth-btn"
                                onClick={onNavigateToAuth}
                            >
                                Sign In / Register
                            </button>
                        )}

                        <button
                            className="user-icon-btn"
                            onClick={onNavigateToAuth}
                            title="Account"
                        >
                            <User size={22} color="currentColor" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- TOP HERO BANNER  --- */}
            <section className="services-hero-container">
                <div className="services-hero-card">
                    <div className="hero-left-text">
                        <h2>Our Professional Services</h2>
                        <p>
                            From everyday clothing to delicate luxury fabrics,
                            we deliver pristine cleanliness, crisp pressing, and
                            unmatched garment care.
                        </p>
                    </div>

                    <div className="hero-right-box">
                        <h3>Need custom care or bulk commercial orders?</h3>
                        <p>
                            Get in touch with our team in Jdeideh or schedule a
                            direct pickup.
                        </p>
                        <button
                            className="btn-contact-box"
                            onClick={scrollToContact}
                        >
                            Contact Us
                        </button>
                    </div>
                </div>
            </section>

            {/* --- SERVICES GRID SECTION --- */}
            <section className="services-grid-section">
                <div className="section-title-wrapper">
                    <h2>Our Services</h2>
                    <p>
                        From everyday laundry to delicate garments, we provide
                        professional cleaning solutions with care and attention
                        to details.
                    </p>
                </div>

                <div className="services-grid">
                    {/* Card 1 */}
                    <div className="service-card">
                        <div className="icon-circle">
                            <Shirt size={22} color="#3b2b68" />
                        </div>
                        <h3>Dry Cleaning</h3>
                        <p>
                            Professional cleaning for delicate and special
                            garments
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="service-card">
                        <div className="icon-circle">
                            <Droplets size={22} color="#3b2b68" />
                        </div>
                        <h3>Wash & Fold</h3>
                        <p>
                            Freshly washed, dried and neatly folded clothes
                            ready for you
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="service-card">
                        <div className="icon-circle">
                            <Sparkles size={22} color="#3b2b68" />
                        </div>
                        <h3>Ironing</h3>
                        <p>
                            Perfectly pressed clothes with a clean and polished
                            finish
                        </p>
                    </div>

                    {/* Card 4 */}
                    <div className="service-card">
                        <div className="icon-circle">
                            <BedDouble size={22} color="#3b2b68" />
                        </div>
                        <h3>Comforters & Blankets</h3>
                        <p>
                            Deep cleaning for bulky items while protecting
                            fabric quality
                        </p>
                    </div>

                    {/* Card 5 */}
                    <div className="service-card">
                        <div className="icon-circle">
                            <Blinds size={22} color="#3b2b68" />
                        </div>
                        <h3>Curtains</h3>
                        <p>
                            Careful cleaning to refresh and maintain your
                            curtains.
                        </p>
                    </div>

                    {/* Card 6 */}
                    <div className="service-card">
                        <div className="icon-circle">
                            <Building2 size={22} color="#3b2b68" />
                        </div>
                        <h3>Commercial Laundry</h3>
                        <p>
                            Reliable laundry solutions for businesses and
                            organizations
                        </p>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer id="contact" className="figma-footer">
                <div className="footer-container">
                    <div className="footer-col brand-col">
                        <div className="footer-logo">
                            <img
                                src={logoImg}
                                alt="Violetta Laundry"
                                className="brand-logo footer-brand-logo"
                            />
                        </div>
                        <p>
                            Professional laundry and dry cleaning services with
                            exceptional care, fast turnaround, and customer
                            satisfaction.
                        </p>
                    </div>

                    <div className="footer-col">
                        <h4>Quick Links</h4>
                        <ul>
                            <li>
                                <a href="#home" onClick={onNavigateHome}>
                                    1. Home
                                </a>
                            </li>
                            <li>
                                <a href="#about" onClick={onNavigateToAbout}>
                                    2. About Us
                                </a>
                            </li>
                            <li>
                                <a href="#services">3. Services</a>
                            </li>
                            <li>
                                <a href="#contact" onClick={scrollToContact}>
                                    4. Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Services</h4>
                        <ul>
                            <li>
                                <a href="#services">1. Wash & Fold</a>
                            </li>
                            <li>
                                <a href="#services">2. Dry Cleaning</a>
                            </li>
                            <li>
                                <a href="#services">3. Ironing</a>
                            </li>
                            <li>
                                <a href="#services">4. Comforters & Blankets</a>
                            </li>
                            <li>
                                <a href="#services">5. Curtains</a>
                            </li>
                            <li>
                                <a href="#services">6. Pickup & Delivery</a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col contact-col">
                        <h4>Contact Us</h4>
                        <p>
                            <MapPin size={14} className="inline-icon" /> St
                            Sarkis & Bakhos Jdeideh, street 10-7, GF
                        </p>
                        <p>
                            <Phone size={14} className="inline-icon" /> +961 1
                            890 566
                        </p>
                        <p>
                            <MessageCircle size={14} className="inline-icon" />{" "}
                            +961 81 669 373
                        </p>
                        <p>
                            <Clock size={14} className="inline-icon" /> Monday ➔
                            Friday: 8h00 ➔ 19h00
                            <br />
                            Saturday: 8h00 ➔ 14h00
                        </p>
                        <p>
                            <Mail size={14} className="inline-icon" />{" "}
                            info@violettalaundry.com
                        </p>
                    </div>
                </div>
            </footer>

            {/* --- BOOKING MODAL --- */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={function () {
                    setIsBookingOpen(false);
                }}
                currentUser={currentUser}
            />
        </div>
    );
}
