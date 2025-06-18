import React from 'react';
import '../styles/OwnerStats.css';

function OwnerStats({ statistics }) {
    console.log('OwnerStats statistics:', statistics);
    
    return (
        <div className="stats-container">
            <div className="stat-card">
                <h3 className='statText'>סה"כ חניות</h3>
                <p className='statText'>{statistics.parkingCount}</p>
            </div>
            <div className="stat-card">
                <h3 className='statText'>סה"כ הזמנות</h3>
                <p className='statText'>{statistics.reservationCount}</p>
            </div>
            <div className="stat-card">
                <h3 className='statText'>סה"כ הכנסות</h3>
                <p className='statText'>{statistics.totalRevenue} ₪</p>
            </div>
            <div className="stat-card">
                <h3 className='statText'>דוחות פתוחים</h3>
                <p className='statText'>{statistics.openReportCount}</p>
            </div>
        </div>
    );
}

export default OwnerStats;
