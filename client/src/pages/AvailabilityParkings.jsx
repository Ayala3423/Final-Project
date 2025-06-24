import React, { useState, useEffect } from 'react';
import ParkingList from '../components/ParkingList';
import MapView from '../components/MapView';
import { apiService } from '../services/genericService';
import '../styles/AvailabilityParkings.css';
import SearchBar from '../components/SearchBar';

function AvailabilityParkings({ currentLocation, searchText, triggerSearch }) {
    
    const [searchResults, setSearchResults] = useState();
    const [hoveredParkingId, setHoveredParkingId] = useState(null);
    const [mapCenter, setMapCenter] = useState(currentLocation);  

    useEffect(() => {
        handleSearch();
    }, [triggerSearch]);

    const handleSearch = () => {
        console.log("Search Text:", searchText);
        console.log("Current Location:", currentLocation);

        if (!searchText && !currentLocation) return;

        let query = {};

        if (searchText) {
            query.searchText = searchText;
        } else if (currentLocation) {
            query = {
                lat: currentLocation.lat,
                lng: currentLocation.lng
            };
        }

        apiService.getSearch('parkings', query, (response) => {
            console.log("response", response);
            setSearchResults(response.parkings);
            setMapCenter(response.center); 
        }, (error) => console.error(error.message));
    };

    return (
        <div className="availability-container">
            <div className="map-view-wrapper">
                <SearchBar onSearch={(response) => {
                    setSearchResults(response.parkings);
                    setMapCenter(response.center);
                }} currentLocation={currentLocation} />
            </div>
            <div className="parking-list-wrapper">
                <ParkingList
                    parkings={searchResults}
                    setParkings={setSearchResults}
                    onHover={setHoveredParkingId}
                />
            </div>
            <div className="map-view-wrapper">
                <MapView
                    center={mapCenter} 
                    parkings={searchResults}
                    hoveredParkingId={hoveredParkingId}
                />
            </div>
        </div>
    );
}

export default AvailabilityParkings;