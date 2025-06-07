import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import '../styles/search'

const ParkingSearch = () => {
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
    if (useCurrentLocation) {
      setLocation("תל אביב, ישראל");
    }
  }, [useCurrentLocation]);

  const handleSubmit = () => {
    console.log({
      minPrice: parseFloat(minPrice) || 0,
      maxPrice: parseFloat(maxPrice) || Infinity,
      type: parkingType,
      location: useCurrentLocation ? "current" : location,
      startTime: new Date().toISOString(),
      hours: 2,
      radius: 1000
    });
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
        <Search className="w-5 h-5" />
        חיפוש חנייה
      </h2>
      
      <div className="space-y-4">
        {/* Price Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מחיר מינימום</label>
            <input
              type="number"
              placeholder="₪0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">מחיר מקסימום</label>
            <input
              type="number"
              placeholder="₪100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Parking Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">סוג חנייה</label>
          <select
            value={parkingType}
            onChange={(e) => setParkingType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">בחר סוג</option>
            <option value="fixed">קבועה</option>
            <option value="temporary">זמנית</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <input
              type="checkbox"
              checked={useCurrentLocation}
              onChange={(e) => setUseCurrentLocation(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            השתמש במיקום הנוכחי
          </label>
          
          {!useCurrentLocation && (
            <input
              type="text"
              placeholder="הכנס כתובת"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          )}
          
          {useCurrentLocation && location && (
            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              📍 {location}
            </div>
          )}
        </div>

        {/* Current Time Display */}
        <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
          🕐 זמן נוכחי: {currentTime}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          חפש חנייה
        </button>
      </div>
    </div>
  );
};

export default ParkingSearch;