import React, { useEffect, useRef } from 'react';

const API_KEY = 'AIzaSyCcteuv39cQV0oEpPLjoXCJfN_D7f_yNTs';

function MapView({ center, parkings }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

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
                    new window.google.maps.Marker({
                        position: { lat: spot.lat, lng: spot.lng },
                        map: mapInstance.current,
                        title: spot.name,
                        icon: {
                            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                        }
                    });
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
            mapInstance.current = null;
        };
    }, [center, parkings]);

    return (
        <div ref={mapRef} style={{ width: '100%', height: '100vh' }} />
    );
}

export default MapView;