import React from 'react';
import '../styles/OwnerStats.css';

function OwnerStats({ statistics }) {
    return (
        <div className="stats-container">
            <div className="stat-card">
                <h3 className='statText'>Total Parkings</h3>
                <p className='statText'>{statistics.parkingCount}</p>
            </div>
            <div className="stat-card">
                <h3 className='statText'>Total Reservations</h3>
                <p className='statText'>{statistics.reservationCount}</p>
            </div>
            <div className="stat-card">
                <h3 className='statText'>Total Revenue</h3>
                <p className='statText'>{statistics.totalRevenue} ₪</p>
            </div>
            <div className="stat-card">
                <h3 className='statText'>Open Reports</h3>
                <p className='statText'>{statistics.openReportCount}</p>
            </div>
        </div>
    );
}

export default OwnerStats;
