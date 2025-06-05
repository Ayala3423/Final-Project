import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "../../styles/search.css";
import { apiService } from "../../services/genericService";

const SearchBar = ({ onSearch, currentLocation }) => {
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [parkingType, setParkingType] = useState("");
    const [locationText, setLocationText] = useState("");
    const [useCurrentLocation, setUseCurrentLocation] = useState(true);
    const [currentTime, setCurrentTime] = useState("");
    const [coords, setCoords] = useState({ lat: null, lng: null });

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
            // אפשר להוסיף גם הצגה טקסטואלית אם רוצים
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
                console.log("geocoded location:", geo);
                
                lat = geo.lat;
                lng = geo.lng;
            } catch (error) {
                console.error("שגיאה בהמרת מיקום:", error.message);
                return;
            }
        }
        console.log(parkingType+"parking type");
        const params = {
            minPrice: parseFloat(minPrice) || 0,
            maxPrice: parseFloat(maxPrice) || 1000,
            type: "temporary", // או "fixed" אם זה מה שנבחר
            lat,
            lng,
            startTime: new Date().toISOString(),
            hours: 2,
            radius: 10
        };

        apiService.getSearch(
            'parking',
            params,
            (response) => { console.log(response+"response of search"); onSearch(response); },
            (error) => console.error(error.message)
        );
    };

    return (
        <div className="search-container">
            <h2 className="search-title">🔍 Search for Parking</h2>
            <form onSubmit={handleSubmit} className="search-form">
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
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

                <div className="text-sm text-gray-600">🕓 Time: {currentTime}</div>

                <button type="submit" className="search-button">
                    <FaSearch /> Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
