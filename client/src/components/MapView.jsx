import React, { useEffect, useRef } from 'react';
import '../styles/MapView.css';

const API_KEY = 'AIzaSyCcteuv39cQV0oEpPLjoXCJfN_D7f_yNTs';

const toNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
};

function MapView({ center, parkings, hoveredParkingId }) {
    
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({});
    const centerMarkerRef = useRef(null);

    useEffect(() => {
        const initializeMap = () => {
            if (!mapRef.current || mapInstance.current) return;

            const lat = toNumber(center?.lat);
            const lng = toNumber(center?.lng);

            if (lat === null || lng === null) {
                console.warn("MapView: מרכז לא תקין, לא מאתחל מפה");
                return;
            }

            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center: { lat, lng },
                zoom: 14,
            });
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
            Object.values(markersRef.current).forEach(marker => marker.setMap(null));
            markersRef.current = {};
            if (centerMarkerRef.current) {
                centerMarkerRef.current.setMap(null);
            }
            centerMarkerRef.current = null;
            mapInstance.current = null;
        };
    }, []);

    useEffect(() => {
        if (mapInstance.current && center) {
            const lat = toNumber(center.lat);
            const lng = toNumber(center.lng);

            if (lat === null || lng === null) {
                console.warn("MapView: Center is incorrect");
                return;
            }

            mapInstance.current.setCenter({ lat, lng });

            if (centerMarkerRef.current) {
                centerMarkerRef.current.setMap(null);
            }

            centerMarkerRef.current = new window.google.maps.Marker({
                position: { lat, lng },
                map: mapInstance.current,
                title: 'Center Location',
                icon: {
                    url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                },
            });
        }
    }, [center]);

    useEffect(() => {
        if (!mapInstance.current) return;

        Object.values(markersRef.current).forEach(marker => marker.setMap(null));
        markersRef.current = {};

        if (Array.isArray(parkings)) {
            parkings.forEach(spot => {
                const lat = toNumber(spot.lat);
                const lng = toNumber(spot.lng);

                if (lat === null || lng === null) {
                    console.warn("MapView: Coordinates are incorrect", spot);
                    return;
                }

                const marker = new window.google.maps.Marker({
                    position: { lat, lng },
                    map: mapInstance.current,
                    title: spot.address || '',
                    icon: {
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                    },
                });

                const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div style="font-size:14px; font-weight:bold;">₪${spot.price}</div>`,
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
    }, [parkings]);

    useEffect(() => {
        Object.values(markersRef.current).forEach(marker => {
            marker.setIcon({
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            });
        });

        if (hoveredParkingId && markersRef.current[hoveredParkingId]) {
            markersRef.current[hoveredParkingId].setIcon({
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            });
        }
    }, [hoveredParkingId]);

    return <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />;
}

export default MapView;