import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/Ui/SearchBar';
import AvailabilityParkings from '../components/Parking/AvailabilityParkings';
import '../styles/RentBro.css'; // Assuming you have a CSS file for styles
import { FaChevronDown } from 'react-icons/fa'; // נשתמש בספריית react-icons לחץ יפה

function Home() {
    const location = useLocation(); // במקום בתוך הפונקציה
    const navigate = useNavigate();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');

    const categories = [
        { name: 'Buy', active: false },
        { name: 'Rent', active: true },
        { name: 'PG/Co-living', active: false },
        { name: 'Commercial', active: false }
    ];

    const searchTags = [
        'Trending Searches',
        'Uttam Nagar',
        'Sector 44 Noida',
        'Dwarka More',
        'Rajdhon Vihar',
        'More'
    ];

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            pos => {
                setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                console.log("Current Location:", pos.coords.latitude, pos.coords.longitude);
            },
            err => {
                console.error("שגיאה באיתור מיקום:", err.message);
                setCurrentLocation({ lat: 32.0853, lng: 34.7818 });
            }
        );
    }, []);

    return (

        <div className="rentbro-container">
            <div className="hero-image-section">
                {/* Header */}
                <header className="header">
                    <div className="logo">
                        <span className="logo-text">ParkIt</span>
                        <span className="location-text">Delhi</span>
                    </div>
                    <div className="header-right">
                        <button className="list-property-btn" onClick={() => navigate('/login', { state: { backgroundLocation: location } })}>Login</button>
                        <button className="list-property-btn" onClick={() => navigate('/register', { state: { backgroundLocation: location } })}>Register</button>
                    </div>
                </header>

                {/* Main Content */}
                <div className="main-content">
                    <h1 className="main-title">Welcome to the Parking Management System</h1>

                    {/* Category Buttons */}
                    <div className="category-buttons">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                className={`category-btn ${category.active ? 'active' : ''}`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>

                    <div
                        className="scroll-down-arrow"
                        onClick={() => {
                            const mapSection = document.getElementById('parking-section');
                            if (mapSection) {
                                mapSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        <FaChevronDown size={30} />
                    </div>

                    <SearchBar onSearch={setSearchResults} currentLocation={currentLocation} />

                    

                </div>
            </div>

            <section id="parking-section" className="parking-section">
                {currentLocation && (
                    <AvailabilityParkings
                        currentLocation={currentLocation}
                        setSearchResults={setSearchResults}
                        searchResults={searchResults}
                    />
                )}
            </section>

            {/* Footer */}
            <footer className="footer">
                <p className="footer-text">© 2025 ParkIt. All rights reserved.</p>
            </footer>

        </div >

    );
}

export default Home;