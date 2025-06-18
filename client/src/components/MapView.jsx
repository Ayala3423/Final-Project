import React, { useEffect, useRef } from 'react';
import '../styles/MapView.css';

const API_KEY = 'AIzaSyCcteuv39cQV0oEpPLjoXCJfN_D7f_yNTs';

function MapView({ center, parkings, hoveredParkingId }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({}); 

    useEffect(() => {
        const initializeMap = () => {
            if (!mapRef.current || mapInstance.current) return;

            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center,
                zoom: 14
            });

            new window.google.maps.Marker({
                position: center,
                map: mapInstance.current,
                title: 'Your Location'
            });

            if (Array.isArray(parkings)) {
                parkings.forEach(spot => {
                    console.log("spot", spot);

                    const marker = new window.google.maps.Marker({
                        position: { lat: spot.lat, lng: spot.lng },
                        map: mapInstance.current,
                        title: spot.address || '',
                        icon: {
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        }
                    });

                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `<div style="font-size:14px; font-weight:bold;">₪${spot.price}</div>`
                    });

                    marker.addListener('mouseover', () => {
                        infoWindow.open(mapInstance.current, marker);
                    });

                    marker.addListener('mouseout', () => {
                        infoWindow.close();
                    });

                    markersRef.current[spot.id] = marker;
                });
            }
        };

        if (window.google && window.google.maps) {
            initializeMap();
        } else {
            const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
                script.async = true;
                script.defer = true;
                script.onload = initializeMap;
                document.head.appendChild(script);
            } else {
                existingScript.addEventListener('load', initializeMap);
            }
        }

        return () => {
            markersRef.current = {};
            mapInstance.current = null;
        };
    }, [center, parkings]);

    useEffect(() => {
        Object.values(markersRef.current).forEach(marker => {
            marker.setIcon({
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            });
        });

        if (hoveredParkingId && markersRef.current[hoveredParkingId]) {
            markersRef.current[hoveredParkingId].setIcon({
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
        }
    }, [hoveredParkingId]);

    return (
        <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />
    );
}

export default MapView;