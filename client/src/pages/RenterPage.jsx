import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {

    return (
        <div className="admin-layout">
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;