import React, { useState } from "react";
import "./css/Home.css";
import logoImg from "./assets/violettaLaundryLogo.jpeg";
import foldedTowelsImg from "./assets/violettafoldedTowels.jpeg";
import BookingModal from "./BookingModal";
import {
    Shirt,
    Clock,
    Sparkles,
    CheckCircle2,
    Droplets,
    BedDouble,
    Blinds,
    Building2,
    Gift,
    HeartHandshake,
    MapPin,
    Phone,
    MessageCircle,
    Truck,
    User,
    Mail,
    CalendarDays,
} from "lucide-react";

export default function Home({
    onNavigateToServices,
    onNavigateToAuth,
    onNavigateToAdmin,
    onNavigateToAbout,
    currentUser,
    onLogout,
}) {
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const handleBookPickup = () => {
        if (!currentUser) {
            alert("Please log in first to book a pickup.");
            onNavigateToAuth(); // Redirect to login page
            return;
        }
        setIsBookingOpen(true);
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="home-page">
            {/* --- HEADER NAVBAR --- */}
            <header className="figma-header">
                <div className="header-container">
                    <div
                        className="logo-area"
                        onClick={() => scrollToSection("home")}
                    >
                        <img
                            src={logoImg}
                            alt="Violetta Laundry Logo"
                            className="brand-logo"
                        />
                    </div>

                    <nav className="nav-links">
                        <a
                            href="#home"
                            className="active-link"
                            onClick={function (e) {
                                e.preventDefault();
                                scrollToSection("home");
                            }}
                        >
                            Home
                        </a>

                        <a
                            href="#services"
                            onClick={function (e) {
                                e.preventDefault();
                                onNavigateToServices();
                            }}
                        >
                            Services
                        </a>

                        <a
                            href="#about"
                            onClick={ (e) => {
                                e.preventDefault();
                                onNavigateToAbout();
                            }}
                        >
                            About Us
                        </a>

                        <a
                            href="#offers"
                            onClick={function (e) {
                                e.preventDefault();
                                scrollToSection("offers");
                            }}
                        >
                            Pricings
                        </a>

                        <a
                            href="#contact"
                            onClick={function (e) {
                                e.preventDefault();
                                scrollToSection("contact");
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
                            title="Account"
                            onClick={() => {
                                if (
                                    currentUser &&
                                    currentUser.role === "Admin"
                                ) {
                                    onNavigateToAdmin();
                                } else {
                                    onNavigateToAuth();
                                }
                            }}
                            title={currentUser?.role === 'Admin' ? "Dashboard" : "Account"}
                        >
                            <User size={22} color="currentColor" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section id="home" className="hero-section">
                <div className="hero-content">
                    <span className="hero-subtitle">
                        Trusted Laundry & Dry Cleaning Services
                    </span>
                    <h1 className="hero-title">
                        Professional Laundry
                        <br />
                        & Dry Cleaning
                        <br />
                        Services.
                    </h1>
                    <p className="hero-description">
                        Fresh clothes, exceptional care, and service you can
                        trust. Serving our community with professional cleaning,
                        fast turnaround, and affordable prices.
                    </p>
                    <div className="hero-cta-group">
                        <button
                            className="btn-primary-pill"
                            onClick={() => setIsBookingOpen(true)}
                        >
                            Get 50% OFF
                        </button>
                        <button
                            className="btn-outline-pill"
                            onClick={onNavigateToServices}
                        >
                            Our Services
                        </button>
                    </div>
                </div>
                <div className="hero-image-wrapper">
                    <img
                        src={foldedTowelsImg}
                        alt="Neatly folded towels"
                        className="hero-img"
                    />
                </div>
            </section>

            {/* --- WHY CHOOSE VIOLETTA --- */}
            <section id="about" className="why-section">
                <div className="section-header">
                    <h2>Why Choose Violetta?</h2>
                    <p>
                        We provide professional laundry services with quality,
                        care, and convenience you can count on.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="icon-circle">
                            <Shirt size={22} color="#3b2b68" />
                        </div>
                        <h3>Quality Cleaning</h3>
                        <p>
                            Professional cleaning for every garment with
                            attention to detail.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-circle">
                            <Clock size={22} color="#3b2b68" />
                        </div>
                        <h3>Fast Turnaround</h3>
                        <p>
                            Reliable service with quick turnaround for your busy
                            schedule.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-circle">
                            <HeartHandshake size={22} color="#3b2b68" />
                        </div>
                        <h3>Affordable Prices</h3>
                        <p>
                            Quality laundry services at fair prices without
                            compromise.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="icon-circle">
                            <CheckCircle2 size={22} color="#3b2b68" />
                        </div>
                        <h3>Customer Care</h3>
                        <p>
                            Friendly service focused on customer satisfaction
                            every time.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- OUR SERVICES --- */}
            <section id="services" className="services-section">
                <div className="section-header" onClick={onNavigateToServices}>
                    <h2>Our Services</h2>
                    <p>
                        From everyday laundry to delicate garments, we provide
                        professional cleaning solutions with care and attention
                        to details.
                    </p>
                </div>

                <div className="services-grid">
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

            {/* --- SPECIAL OFFERS --- */}
            <section id="offers" className="offers-section">
                <div className="section-header">
                    <h2>Special Offers</h2>
                    <p>
                        Enjoy exclusive promotions designed to reward both new
                        and returning customers.
                    </p>
                </div>

                <div className="offers-grid">
                    <div className="offer-card">
                        <div className="icon-circle">
                            <Gift size={22} color="#3b2b68" />
                        </div>
                        <h3>50% OFF</h3>
                        <p>
                            Try our professional laundry service, get 50% OFF
                            your first order
                        </p>
                        <button
                            className="btn-primary-pill card-btn"
                            onClick={() => setIsBookingOpen(true)}
                        >
                            Book Pickup
                        </button>
                    </div>
                    <div className="offer-card">
                        <div className="icon-circle">
                            <HeartHandshake size={22} color="#3b2b68" />
                        </div>
                        <h3>Loyalty Rewards</h3>
                        <p>
                            Wash 10 times and receive 50% OFF your next wash (up
                            to 100 pieces)
                        </p>
                        <button
                            className="btn-primary-pill card-btn"
                            onClick={() => setIsBookingOpen(true)}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="how-section">
                <div className="section-header">
                    <h2>How it works?</h2>
                    <p>Getting your laundry done has never been easier</p>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <div className="step-icon">
                            <Droplets size={22} color="#3b2b68" />
                        </div>
                        <h3>Drop Off</h3>
                        <p>
                            Bring your laundry to our store at your convenience
                        </p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">2</div>
                        <div className="step-icon">
                            <Sparkles size={22} color="#3b2b68" />
                        </div>
                        <h3>We Clean</h3>
                        <p>
                            We carefully wash, dry, clean or iron your garments.
                        </p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">3</div>
                        <div className="step-icon">
                            <CheckCircle2 size={22} color="#3b2b68" />
                        </div>
                        <h3>Quality Check</h3>
                        <p>
                            Every item is inspected to ensure excellent results
                        </p>
                    </div>
                    <div className="step-card">
                        <div className="step-number">4</div>
                        <div className="step-icon">
                            <Truck size={22} color="#3b2b68" />
                        </div>
                        <h3>Pickup or Delivery</h3>
                        <p>
                            Pickup your fresh laundry at our store or have it
                            delivered to you
                        </p>
                    </div>
                </div>
            </section>

            {/* --- VISIT OUR STORE --- */}
            <section id="contact" className="store-section">
                <div className="store-card-large">
                    <h2>Visit Our Store</h2>
                    <p className="store-intro">
                        We'd love to welcome you! Visit our laundry for
                        professional cleaning services or contact us to arrange
                        a pickup or delivery.
                    </p>

                    <div className="store-details">
                        <p>
                            <MapPin size={16} className="inline-icon" />{" "}
                            <strong>Address:</strong> St Sarkis & Bakhos
                            Jdeideh, street 10-7, GF
                        </p>
                        <p>
                            <Phone size={16} className="inline-icon" />{" "}
                            <strong>Phone:</strong> +961 1 890 566
                        </p>
                        <p>
                            <MessageCircle size={16} className="inline-icon" />{" "}
                            <strong>WhatsApp:</strong> +961 81 669 373
                        </p>
                        <p>
                            <Clock size={16} className="inline-icon" />{" "}
                            <strong>Hours:</strong> Monday ➔ Friday: 8h00 ➔
                            19h00 &nbsp;|&nbsp; Saturday: 8h00 ➔ 14h00
                        </p>
                        <p>
                            <Truck size={16} className="inline-icon" />{" "}
                            <strong>Services:</strong> Pickup & Delivery
                            Available
                        </p>
                    </div>

                    <button
                        className="btn-primary-pill directions-btn"
                        onClick={() => {
                            const address =
                                "Violetta Laundry Jdeideh, Abi Lamaa Street, Jdeideh, Lebanon";
                            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                            window.open(
                                googleMapsUrl,
                                "_blank",
                                "noopener,noreferrer",
                            );
                        }}
                    >
                        Get Directions
                    </button>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="figma-footer">
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
                                <a
                                    href="#home"
                                    onClick={() => scrollToSection("home")}
                                >
                                    1. Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigateToAbout();
                                    }}
                                >
                                    2. About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigateToServices();
                                    }}
                                >
                                    3. Services
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    onClick={() => scrollToSection("contact")}
                                >
                                    4. Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col">
                        <h4>Services</h4>
                        <ul>
                            <li>
                                <a
                                    href="#services"
                                    onClick={() => scrollToSection("services")}
                                >
                                    1. Wash & Fold
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={() => scrollToSection("services")}
                                >
                                    2. Dry Cleaning
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={() => scrollToSection("services")}
                                >
                                    3. Ironing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={() => scrollToSection("services")}
                                >
                                    4. Comforters & Blankets
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={() => scrollToSection("services")}
                                >
                                    5. Curtains
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    onClick={() => scrollToSection("services")}
                                >
                                    6. Pickup & Delivery
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-col contact-col">
                        <h4>Contact Us</h4>
                        <p>
                            <MapPin size={16} className="inline-icon" /> St
                            Sarkis & Bakhos Jdeideh, street 10-7, GF
                        </p>
                        <p>
                            <Phone size={16} className="inline-icon" /> +961 1
                            890 566
                        </p>
                        <p>
                            <MessageCircle size={16} className="inline-icon" />{" "}
                            +961 81 669 373
                        </p>
                        <p>
                            <Clock size={16} className="inline-icon" /> Monday ➔
                            Friday: 8h00 ➔ 19h00
                            <br />
                            Saturday: 8h00 ➔ 14h00
                        </p>
                        <p>
                            <Mail size={16} className="inline-icon" />{" "}
                            info@violettalaundry.com
                        </p>
                    </div>
                </div>
            </footer>

            {/* --- BOOKING MODAL POPUP --- */}
            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                currentUser={currentUser}
            />
        </div>
    );
}
