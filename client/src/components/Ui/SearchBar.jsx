import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "../../styles/search.css";
import { apiService } from "../../services/genericService";

const SearchBar = ({ onSearch, currentLocation }) => {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(100);
    const [parkingType, setParkingType] = useState("temporary");
    const [locationText, setLocationText] = useState("");
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [currentTime, setCurrentTime] = useState("");
    const [coords, setCoords] = useState({ lat: null, lng: null });

    const [radius, setRadius] = useState(10); // רדיוס
    const [startTime, setStartTime] = useState(""); // שעת התחלה
    const [duration, setDuration] = useState(2); // משך בשעות

    useEffect(() => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        setCurrentTime(formattedTime);
    }, []);

    useEffect(() => {
        if (useCurrentLocation && currentLocation?.lat && currentLocation?.lng) {
            setCoords(currentLocation);
            setLocationText(`${currentLocation.lat.toFixed(5)}, ${currentLocation.lng.toFixed(5)}`);
        }
    }, [useCurrentLocation, currentLocation]);

    const geocodeLocation = async (address) => {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
        );
        const data = await res.json();
        if (data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon),
            };
        } else {
            throw new Error("כתובת לא נמצאה");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let lat, lng;

        if (useCurrentLocation) {
            if (!currentLocation?.lat || !currentLocation?.lng) {
                console.error("No current location provided");
                return;
            }
            lat = currentLocation.lat;
            lng = currentLocation.lng;
        } else {
            try {
                const geo = await geocodeLocation(locationText);
                lat = geo.lat;
                lng = geo.lng;
            } catch (error) {
                console.error("שגיאה בהמרת מיקום:", error.message);
                return;
            }
        }

        const params = {
            minPrice,
            maxPrice,
            type: parkingType,
            lat,
            lng,
            startTime: startTime || new Date().toISOString(),
            hours: duration,
            radius
        };
        console.log("Search parameters:", params);
        apiService.getSearch(
            'parking',
            params,
            (response) => { onSearch(response); 
                console.log("Search results:", response);
                // setCoords({ lat, lng }); // Update coords for map center
            },
            (error) => console.error(error.message)
        );
    };

    return (
        <div className="search-container">
            <h2 className="search-title">🔍 Search for Parking</h2>
            <form onSubmit={handleSubmit} className="search-form">

                <div className="price-slider-container">
                    <label>💰 Price Range:</label>
                    <div className="range-group">
                        <input
                            type="range"
                            min="0"
                            max="500"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                        />
                        <input
                            type="range"
                            min="0"
                            max="500"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                    </div>
                    <div className="price-inputs">
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(Number(e.target.value))}
                        />
                        <span> - </span>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(Number(e.target.value))}
                        />
                    </div>
                </div>

                <select
                    value={parkingType}
                    onChange={(e) => setParkingType(e.target.value)}
                >
                    <option value="temporary">Temporary</option>
                    <option value="fixed">Permanent</option>
                </select>

                <label className="text-sm text-gray-700">
                    <input
                        type="checkbox"
                        checked={useCurrentLocation}
                        onChange={(e) => setUseCurrentLocation(e.target.checked)}
                    />{" "}
                    Use current location
                </label>

                {!useCurrentLocation && (
                    <input
                        type="text"
                        placeholder="Enter address"
                        value={locationText}
                        onChange={(e) => setLocationText(e.target.value)}
                    />
                )}

                {useCurrentLocation && locationText && (
                    <div className="text-sm text-gray-700">
                        📍 Location: {locationText}
                    </div>
                )}

                {/* רדיוס חיפוש */}
                <input
                    type="number"
                    placeholder="Search radius (km)"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                />

                {/* שעת התחלה */}
                <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />

                {/* משך זמן */}
                <input
                    type="number"
                    placeholder="Duration (hours)"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                />

                <div className="text-sm text-gray-600">🕓 Current time: {currentTime}</div>

                <button type="submit" className="search-button">
                    <FaSearch /> Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
