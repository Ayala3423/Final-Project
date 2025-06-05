// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { apiService } from '../services/genericService';
// import SearchBar from '../components/Ui/SearchBar';
// import AvailabilityParkings from '../components/Parking/AvailabilityParkings';
// const API_KEY = 'AIzaSyCcteuv39cQV0oEpPLjoXCJfN_D7f_yNTs'; // <-- החליפי כאן במפתח שלך

// function Home() {
//     const navigate = useNavigate();
//     const mapRef = useRef(null);
//     const mapInstance = useRef(null); // לשמירת מופע המפה
//     const [currentLocation, setCurrentLocation] = useState({});
//     const [searchResults, setSearchResults] = useState([]);

//     const handleLogin = () => {
//         navigate('/user/login');
//     };

//     const handleRegister = () => {
//         navigate('/register');
//     };

//     useEffect(() => {
//         if (!window.google) {
//             const script = document.createElement('script');
//             script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
//             script.async = true;
//             script.defer = true;
//             script.onload = initMap;
//             document.head.appendChild(script);
//         } else {
//             initMap();
//         }

//         function initMap() {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     async position => {

//                         setCurrentLocation({
//                             lat: position.coords.latitude,
//                             lng: position.coords.longitude
//                         });

//                         const userLocation = {
//                             lat: position.coords.latitude,
//                             lng: position.coords.longitude
//                         };

//                         mapInstance.current = new window.google.maps.Map(mapRef.current, {
//                             center: userLocation,
//                             zoom: 14
//                         });

//                         new window.google.maps.Marker({
//                             position: userLocation,
//                             map: mapInstance.current,
//                             title: "Your Location"
//                         });

//                         await loadParkingSpots({
//                             lat: position.coords.latitude,
//                             lng: position.coords.longitude
//                         }); // טען חניות
//                     },
//                     async error => {
//                         console.error("Error getting location:", error);
//                         const fallback = { lat: 32.0853, lng: 34.7818 }; // תל אביב

//                         mapInstance.current = new window.google.maps.Map(mapRef.current, {
//                             center: fallback,
//                             zoom: 12
//                         });

//                         await loadParkingSpots(fallback); // טען חניות גם במקרה זה
//                     }
//                 );
//             }
//         }

//         async function loadParkingSpots(location) {
//             try {
//                 console.log(location, "Current Location");

//                 apiService.getSearch('parking', location, (response) => {

//                     console.log("Parking spots loaded:", response);
//                     response.forEach(spot => {
//                         new window.google.maps.Marker({
//                             position: { lat: spot.lat, lng: spot.lng },
//                             map: mapInstance.current,
//                             title: spot.name,
//                             icon: {
//                                 url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
//                             }
//                         });
//                     });
//                 }, (error) => {
//                     console.error("Error loading parking spots:", error);
//                 });


//             } catch (err) {
//                 console.error("Failed to load parking spots:", err);
//             }
//         }
//     }, []);

//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px' }}>
//             <h1>Welcome to the Parking Management System</h1>
//             <p>Manage your parking spaces efficiently.</p>
//             <button onClick={handleLogin} style={{ marginRight: '10px' }}>
//                 Login
//             </button>
//             <button onClick={handleRegister}>
//                 Register
//             </button>
//             <SearchBar onSearch={setSearchResults} />
//             <AvailabilityParkings searchResults={searchResults} />
//             {/* מפת גוגל */}
//             <div
//                 ref={mapRef}
//                 style={{ width: '100%', height: '400px', marginTop: '30px' }}
//             />
//         </div>
//     );
// }

// export default Home;


//////////////////////
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/Ui/SearchBar';
import AvailabilityParkings from '../components/Parking/AvailabilityParkings';

function Home() {
    const navigate = useNavigate();
    const [currentLocation, setCurrentLocation] = useState(null);
    const [searchResults, setSearchResults] = useState([]);

useEffect(() => {
    navigator.geolocation.getCurrentPosition(
        pos => {setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        console.log("Current Location:", pos.coords.latitude, pos.coords.longitude);}
        ,
        err => {
            console.error("שגיאה באיתור מיקום:", err.message);
            setCurrentLocation({ lat: 32.0853, lng: 34.7818 }); // ברירת מחדל תל אביב
        }
    );
}, []);


    return (
        <div>
            <h1>Welcome to the Parking Management System</h1>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
            <SearchBar onSearch={setSearchResults} currentLocation={currentLocation}/>
            {currentLocation && (
                <AvailabilityParkings
                    currentLocation={currentLocation}
                    setSearchResults={setSearchResults}
                    searchResults={searchResults}
                />
            )}
        </div>
    );
}

export default Home;