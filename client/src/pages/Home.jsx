import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AvailabilityParkings from './AvailabilityParkings';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/RentBro.css';
import { FaChevronDown } from 'react-icons/fa';

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [myLocation, setMyLocation] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedBudget, setSelectedBudget] = useState('');

    const categories = [
        { name: 'Buy', active: false },
        { name: 'Rent', active: true },
        { name: 'PG/Co-living', active: false },
        { name: 'Commercial', active: false }
    ];

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

    return (
        <div className="rentbro-container">
            <div className="hero-image-section">
                {/* <Header /> */}

                <div className="main-content">
                    <h1 className="main-title">Welcome to the Parking Management System</h1>

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

                    <div className="search-wrapper">
                        <span className="search-icon">
                            <svg className="icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.3-5.4a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Type an area..."
                            onChange={(e) => setMyLocation(e.target.value)}
                            className="search-input"
                        />
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
                </div>

                <section id="parking-section" className="parking-section">
                    {myLocation && (
                        <AvailabilityParkings currentLocation={myLocation} />
                    )}
                </section>
            </div>

            <Footer />
        </div>
    );
}

export default Home;