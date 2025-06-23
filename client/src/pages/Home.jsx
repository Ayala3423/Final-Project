import React, { useRef, useEffect, useState } from 'react';
import AvailabilityParkings from './AvailabilityParkings';
import Footer from '../components/Footer';
import '../styles/RentBro.css';
import { apiService } from '../services/genericService';
import { FaChevronDown, FaCar, FaShieldAlt, FaClock, FaMobile, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Home() {

    const [myLocation, setMyLocation] = useState();
    const [searchText, setSearchText] = useState('');
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactMsg, setContactMsg] = useState('');
    const [contactSent, setContactSent] = useState(false);
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [contactError, setContactError] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            err => {
                console.error("שגיאה באיתור מיקום:", err.message);
                setMyLocation({ lat: 32.0853, lng: 34.7818 });
            }
        );
    }, []);

    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setSuggestions([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();

        if (!contactName || !contactEmail || !contactMsg) {
            setContactError('נא למלא את כל השדות');
            return;
        }

        const messageObj = {
            senderId: 1,
            receiverId: 2,
            content: `שם: ${contactName}\nאימייל: ${contactEmail}\n\n${contactMsg}`,
            sentAt: new Date().toISOString(),
            conversationId: null
        };

        try {
            apiService.create('messages', messageObj, () => {
                setContactSent(true);
                setContactName('');
                setContactEmail('');
                setContactMsg('');
                setContactError('');
            }, (err) => {
                console.error("Error sending contact message:", err);
                setContactError("שגיאה בשליחת ההודעה");
            });
        } catch (err) {
            console.error("Error submitting contact form:", err);
            setContactError("שגיאה כללית בשליחה");
        }
    };

    let debounceTimer = null;

    const handleSearchTextChange = (value) => {
        setSearchText(value);

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (value.trim() === '') {
                setSuggestions([]);
                return;
            }

            fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`)
                .then(res => res.json())
                .then(data => setSuggestions(data))
                .catch(err => {
                    console.error("Autocomplete error:", err);
                    setSuggestions([]);
                });
        }, 400);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchText(suggestion.display_name);
        setSuggestions([]);
    };

    return (
        <div className="rentbro-container">
            {/* Hero Section */}
            <div className="hero-image-section">
                <div className="main-content">
                    <h1 className="main-title">Find Your Perfect Parking Spot in Seconds</h1>
                    {/* <p className="subtitle">The smart way to discover, book, and manage parking spaces across the city</p> */}

                    <div className="search-wrapper">
                        {/* <span className="search-icon">
                            <svg className="icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.3-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
                            </svg>
                        </span> */}
                        <div ref={wrapperRef} style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Type an area or address..."
                                value={searchText}
                                onChange={(e) => handleSearchTextChange(e.target.value)}
                                className="search-input"
                            />

                            {suggestions.length > 0 && (
                                <ul className="suggestions-list">
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                                            {suggestion.display_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>


                        <button className="search-btn" onClick={() => { scrollToSection('parking-section'); setTriggerSearch(prev => !prev) }}>
                            Search Now
                        </button>

                    </div>

                    {/* Stats Bar */}
                    {/* <div className="stats-bar">
                        <div className="stat">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Parking Spots</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">50K+</span>
                            <span className="stat-label">Happy Users</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Support</span>
                        </div>
                    </div> */}

                    <div
                        className="scroll-down-arrow"
                        onClick={() => scrollToSection('about-section')}
                    >
                        <FaChevronDown size={30} />
                    </div>
                </div>
            </div>

            {/* About Section */}
            <section id="about-section" className="about-section">
                <div className="container1">
                    <div className="section-header">
                        <h2>About Our Parking System</h2>
                        <p className="section-subtitle">Revolutionizing urban parking with smart technology</p>
                    </div>

                    <div className="about-content">
                        <div className="about-text">
                            <h3>Why Choose Us?</h3>
                            <p>
                                Our parking management system is designed to make finding and booking parking
                                spots as simple as possible. Using real-time data and smart algorithms, we help
                                you save time and reduce the stress of urban parking.
                            </p>
                            <ul className="benefits-list">
                                <li>✓ Real-time availability updates</li>
                                <li>✓ Easy online booking and payment</li>
                                <li>✓ Secure and monitored parking spaces</li>
                                <li>✓ 24/7 customer support</li>
                            </ul>
                        </div>

                        <div className="about-visual">
                            <div className="video-placeholder">
                                <div className="play-button">▶</div>
                                <p>Watch How It Works</p>
                                <small>See our system in action</small>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container1">
                    <div className="section-header">
                        <h2>Key Features</h2>
                        <p className="section-subtitle">Everything you need for hassle-free parking</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <FaCar className="feature-icon" />
                            </div>
                            <h3>Real-Time Availability</h3>
                            <p>Get live updates on parking availability and never waste time driving around looking for a spot.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <FaClock className="feature-icon" />
                            </div>
                            <h3>Instant Booking</h3>
                            <p>Reserve your parking spot in advance and guarantee your space when you arrive.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <FaShieldAlt className="feature-icon" />
                            </div>
                            <h3>Secure Payments</h3>
                            <p>Safe and secure payment processing with multiple payment options available.</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon-wrapper">
                                <FaMobile className="feature-icon" />
                            </div>
                            <h3>Mobile Optimized</h3>
                            <p>Perfect mobile experience that works seamlessly on all your devices, anywhere.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Parking Results Section */}
            <section id="parking-section" className="parking-section">
                <div className="container">
                    <h2>Available Parking Spots</h2>
                    {myLocation ? (
                        <AvailabilityParkings
                            currentLocation={myLocation}
                            searchText={searchText}
                            triggerSearch={triggerSearch}
                        />
                    ) : (
                        <div>Loading location...</div>
                    )}

                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section">
                <div className="container1">
                    <div className="section-header">
                        <h2>Get in Touch</h2>
                        <p className="section-subtitle">Need help? We're here for you 24/7</p>
                    </div>

                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="contact-item">
                                <FaPhone className="contact-icon" />
                                <div>
                                    <h4>Call Us</h4>
                                    <p>+972-3-123-4567</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <FaEnvelope className="contact-icon" />
                                <div>
                                    <h4>Email Us</h4>
                                    <p>support@parkingbro.com</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <FaMapMarkerAlt className="contact-icon" />
                                <div>
                                    <h4>Visit Us</h4>
                                    <p>Tel Aviv, Israel<br />Rothschild Blvd 123</p>
                                </div>
                            </div>
                        </div>

                        <div className="contact-form">
                            <h3>Send us a message</h3>
                            <form onSubmit={handleContactSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="form-input"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="form-input"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        placeholder="Your Message"
                                        className="form-textarea"
                                        rows="4"
                                        value={contactMsg}
                                        onChange={(e) => setContactMsg(e.target.value)}
                                    ></textarea>
                                </div>
                                {contactError && <div className="error">{contactError}</div>}
                                {contactSent && <div className="success">הודעה נשלחה בהצלחה!</div>}
                                <button type="submit" className="contact-submit-btn">Send Message</button>
                            </form>

                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;