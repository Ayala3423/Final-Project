import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, LabelList } from 'recharts';
import '../styles/OrdersChart.css';

function OrdersChart({ chartData }) {
  const data = Object.entries(chartData || {}).map(([month, total]) => ({
    month,
    total,
  }));

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3>הכנסות חודשיות</h3>
        <div className="no-data">אין נתונים זמינים</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>הכנסות חודשיות</h3>
      <div style={{ width: 600, height: 300, margin: '0 auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              isAnimationActive={false}
              cursor={{ fill: 'rgba(0,0,0,0.1)' }}
              allowEscapeViewBox={{ x: false, y: true }}
              wrapperStyle={{
                fontSize: 14,
                borderRadius: 6,
                padding: '5px 10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                backgroundColor: '#fff',
              }}
            />
            <Bar
              dataKey="total"
              fill="#ffc100"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            >
              <LabelList dataKey="total" position="top" style={{ fill: '#333', fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default OrdersChart;