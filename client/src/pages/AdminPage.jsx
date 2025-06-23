import React, { useEffect, useState, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import Stats from '../components/Stats';
import OrdersChart from '../components/OrdersChart';
import { apiService } from '../services/genericService';
import { AuthContext } from '../context/AuthContext';

function AdminDashboard() {

    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const isRootAdminPath = location.pathname === '/admin';

    useEffect(() => {
        if (isRootAdminPath) {
            async function fetchData() {
                try {
                    apiService.get('data/dashboard', (response) => {
                        setDashboardData(response);
                    }, (error) => {
                        console.error("Error fetching admin dashboard data:", error);
                    });
                } catch (error) {
                    console.error("Error fetching admin dashboard data:", error);
                } finally {
                    setLoading(false);
                }
            }
            fetchData();
        } else {
            setLoading(false); 
        }
    }, [isRootAdminPath]);

    return (
        <div className="admin-layout">
            <main className="admin-content">
                {isRootAdminPath ? (
                    loading ? (
                        <div>טוען...</div>
                    ) : !dashboardData ? (
                        <div>שגיאה בטעינת הנתונים</div>
                    ) : (
                        <>
                            <Stats statistics={dashboardData.statistics} />
                            <OrdersChart chartData={dashboardData.chartData} />
                        </>
                    )
                ) : (
                    <Outlet />
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;