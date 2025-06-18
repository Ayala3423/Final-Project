import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ParkingList from '../components/ParkingList';
import { apiService } from '../services/genericService';

function MyParkings() {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [myParkings, setMyParkings] = useState([]);
  const navigate = useNavigate();
  console.log("user in MyParkings:", user);

  useEffect(() => {
    fetchParkings(page);
  }, [page]);

  const fetchParkings = (pageNumber) => {
    if (loading || !hasMore) return;

    setLoading(true);

    if (!loading) {
      if (!user) {
        navigate('/login');
      } else {
        apiService.getByValue('parkings', { 'ownerId': user.id, page: pageNumber, limit: 10 }, (response) => {
          console.log("User parkings fetched:", response);

          setMyParkings((prev) => [...prev, ...response]);
          if (response.length < 10) setHasMore(false);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user parkings:", error);
          alert('Failed to load your parkings.');
          setLoading(false);

        });
      }
    }
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return <>
    <ParkingList parkings={myParkings} setParkings={setMyParkings} />;
    {hasMore && (
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button onClick={handleLoadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More'}
        </button>
      </div>
    )}
  </>
}

export default MyParkings;