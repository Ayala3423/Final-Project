import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import '../styles/Dashboard.css';

function AdminDashboard() {


    return (
        <div className="admin-layout">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
            </header>
            <main className="admin-content">
                {/* Outlet מייצג את המקום בו טעונים תתי העמודים */}
                <Outlet />
            </main>

        </div>
    );
}

export default AdminDashboard;