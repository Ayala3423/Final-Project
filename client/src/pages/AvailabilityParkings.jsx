import React, { useEffect, useState } from 'react';
import ParkingList from '../components/ParkingList';
import MapView from '../components/MapView';
import { apiService } from '../services/genericService';
import '../styles/AvailabilityParkings.css';
import SearchBar from '../components/SearchBar';

function AvailabilityParkings({ currentLocation }) {
    const [searchResults, setSearchResults] = useState();
    const [hoveredParkingId, setHoveredParkingId] = useState(null);

    useEffect(() => {
        console.log("Current Location:", currentLocation);
        
        apiService.getSearch('parking', currentLocation, (response) => {
            console.log(response);
            setSearchResults(response);
        }, (error) => console.error(error.message));

    }, [currentLocation]);

    return (
        <div className="availability-container">
            <div className="map-view-wrapper">
                <SearchBar onSearch={setSearchResults} currentLocation={currentLocation} />
            </div>
            <div className="parking-list-wrapper">
                <ParkingList
                    parkings={searchResults}
                    onHover={setHoveredParkingId}
                />
            </div>
            <div className="map-view-wrapper">
                <MapView
                    center={currentLocation}
                    parkings={searchResults}
                    hoveredParkingId={hoveredParkingId} 
                />
            </div>
        </div>
    );
}

export default AvailabilityParkings;