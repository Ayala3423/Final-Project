import React, { useEffect, useRef } from 'react';

const API_KEY = 'AIzaSyCcteuv39cQV0oEpPLjoXCJfN_D7f_yNTs';

function MapView({ center, parkings }) {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        const loadGoogleMaps = () => {
            if (!window.google) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
                script.async = true;
                script.onload = () => initMap(center);
                document.head.appendChild(script);
            } else {
                initMap(center);
            }
        };

        const initMap = (center) => {
            mapInstance.current = new window.google.maps.Map(mapRef.current, {
                center,
                zoom: 14
            });

            new window.google.maps.Marker({
                position: center,
                map: mapInstance.current,
                title: 'Your Location'
            });

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
        };

        loadGoogleMaps();
    }, [center, parkings]);

    return (
        <div ref={mapRef} style={{ width: '100%', height: '400px', marginTop: '30px' }} />
    );
}

export default MapView;
