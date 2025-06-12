import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';
import MyParkings from './MyParkings';

function OwnerDashboard() {


    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1 id='H1'>Owner Dashboard</h1>
            </header>
            <main className="admin-content">
                {/* Outlet מייצג את המקום בו טעונים תתי העמודים */}
                <Outlet />
            </main>
        </div>
    );
}

export default OwnerDashboard;
