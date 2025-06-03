import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "../styles/search.css";

const Search = ({ onSearch }) => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [parkingType, setParkingType] = useState("");
  const [location, setLocation] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentTime(formattedTime);
  }, []);

  useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
            );
            const data = await res.json();
            setLocation(data.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`);
          } catch (err) {
            setLocation(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
          }
        },
        () => setLocation("Location access denied")
      );
    }
  }, [useCurrentLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.({
      minPrice,
      maxPrice,
      parkingType,
      location,
      currentTime,
    });
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
          <option value="">Select Type</option>
          <option value="permanent">Permanent</option>
          <option value="temporary">Temporary</option>
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
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        )}

        {useCurrentLocation && location && (
          <div className="text-sm text-gray-700">
            📍 Location: {location}
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

export default Search;