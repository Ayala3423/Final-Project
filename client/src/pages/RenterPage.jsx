

import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

function Dashboard() {


    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1>Renter Dashboard</h1>
            </header>
            <main className="admin-content">
                {/* Outlet מייצג את המקום בו טעונים תתי העמודים */}
                <Outlet />
            </main>
        </div>
    );
}

export default Dashboard;