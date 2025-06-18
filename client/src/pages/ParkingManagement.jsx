import React, { useEffect, useState } from 'react';
import ParkingList from '../components/ParkingList';
import { apiService } from '../services/genericService';

function ParkingManagement() {
  const [parkings, setParkings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParkings(page);
  }, [page]);

  const fetchParkings = (pageNumber) => {
    if (loading || !hasMore) return;

    setLoading(true);
    apiService.getByValue(
      'parkings',
      { page: pageNumber, limit: 10 }, 
      (response) => {
        setParkings((prev) => [...prev, ...response]);
        if (response.length < 10) setHasMore(false);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to fetch parkings:", error);
        setLoading(false);
      }
    );
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div>
      <h2>Parking Management</h2>
      <ParkingList parkings={parkings} setParkings={setParkings}/>
      
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={handleLoadMore} disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

export default ParkingManagement;