import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { HiMenuAlt3 } from 'react-icons/hi';
import '../styles/Dashboard.css';

function AdminDashboard() {

    return (
        <div className="admin-layout">
            <main className="admin-content">
                <Outlet />
            </main>

        </div>
    );
}

export default AdminDashboard;