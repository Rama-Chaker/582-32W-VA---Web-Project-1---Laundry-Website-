import React from "react";
import {
    User,
    Sparkles,
    Leaf,
    HeartHandshake,
    Clock,
    MapPin,
    Phone,
    MessageSquare,
    Calendar,
    Mail,
    MessageCircle,
} from "lucide-react";
import "./css/About.css";
import logoImg from "./assets/violettaLaundryLogo.jpeg";

export default function About({
    onNavigate,
    currentUser,
    onNavigateToAuth,
    onNavigateToAdmin,
    onLogout,
    onNavigateHome,
    onNavigateToPricing,
    onNavigateToServices,
}) {
    function scrollToContact() {
        const contactElement = document.getElementById("contact");
        if (contactElement) {
            contactElement.scrollIntoView({ behavior: "smooth" });
        }
    }
    return (
        <div className="about-container">
            {/* ---------------- NAVBAR ---------------- */}
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
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigateToServices();
                            }}
                        >
                            Services
                        </a>

                        <a
                            href="#about"
                            className="active-link"
                            onClick={(e) => {
                                e.preventDefault();
                            }}
                        >
                            About Us
                        </a>

                        <a
                            href="#offers"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigateToPricing();
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

            {/* ---------------- HERO / MAIN SECTION ---------------- */}
            <main className="about-main">
                <h2 className="section-title-sub">
                    Building Better Experiences
                </h2>

                <div className="hero-card">
                    <div className="hero-logo-box">
                        <img src={logoImg} alt="Violetta Laundry Logo" />
                    </div>

                    <div className="hero-content-box">
                        <p className="story-text">
                            With 25 years of experience across Canada, Germany,
                            and Lebanon in clothing and linen cleaning, we offer
                            extensive expertise in administrative and chemical
                            aspects of cleaning materials, including their
                            environmental impact. We utilize premium,
                            eco-friendly products. Our mission is to provide
                            outstanding laundry and garment care, guaranteeing
                            freshness, cleanliness, and convenience for all our
                            clients. We aspire to be the premier laundry
                            service, renowned for our quality, efficiency, and
                            customer satisfaction, making garment care a
                            seamless and dependable experience.
                        </p>
                        <button
                            className="btn-services"
                            onClick={() => handleNav("services")}
                        >
                            Check Our Services
                        </button>
                    </div>
                </div>

                {/* ---------------- OUR CORE VALUES ---------------- */}
                <section className="values-section">
                    <h2 className="section-title">Our Core Values</h2>

                    <div className="values-grid">
                        <div className="value-card">
                            <Sparkles size={24} className="value-icon" />
                            <h3>Professional Cleaning</h3>
                            <p>We prioritize excellence in every wash.</p>
                        </div>

                        <div className="value-card">
                            <Leaf size={24} className="value-icon" />
                            <h3>Sustainability</h3>
                            <p>We are committed to eco-friendly practices.</p>
                        </div>

                        <div className="value-card">
                            <HeartHandshake size={24} className="value-icon" />
                            <h3>Customer Care</h3>
                            <p>Your satisfaction is our top priority.</p>
                        </div>

                        <div className="value-card">
                            <Clock size={24} className="value-icon" />
                            <h3>Reliability</h3>
                            <p>Consistent, dependable service you can trust.</p>
                        </div>
                    </div>
                </section>
            </main>

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
                                <a
                                    href="#home"
                                    onClick={(e) => {
                                e.preventDefault();
                                onNavigateHome();
                            }}
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
        </div>
    );
}
