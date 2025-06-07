import React, { useEffect } from 'react';
import ParkingList from './ParkingList';
import MapView from '../Ui/MapView';
import { apiService } from '../../services/genericService';
import '../../styles/AvailabilityParkings.css';

function AvailabilityParkings({ currentLocation, setSearchResults, searchResults }) {
    useEffect(() => {
        if (!searchResults || searchResults.length === 0) {
            apiService.getSearch('parking', currentLocation, (response) => {
                console.log(response);
                setSearchResults(response);
            }, (error) => console.error(error.message));
        }
    }, [currentLocation]);

    return (
        <div className="availability-container">
            <div className="parking-list-wrapper">
                <ParkingList parkings={searchResults} />
            </div>
            <div className="map-view-wrapper">
                <MapView center={currentLocation} parkings={searchResults} />
            </div>
        </div>
    );
}

export default AvailabilityParkings;