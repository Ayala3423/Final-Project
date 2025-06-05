import React, { useEffect } from 'react';
import ParkingList from './ParkingList';
import MapView from '../Ui/MapView';
import { apiService } from '../../services/genericService';

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
        <div>
            <ParkingList parkings={searchResults} />
            <MapView center={currentLocation} parkings={searchResults} />
        </div>
    );
}

export default AvailabilityParkings;
