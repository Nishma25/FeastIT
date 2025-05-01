import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../assets/css/AnalyticsPage.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const AnalyticsPage = () => {
    const [analytics, setAnalytics] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const peakHour = analytics?.orders_per_hour
        ? analytics.orders_per_hour.reduce((max, current) => current.orders > max.orders ? current : max, { orders: -1 })
        : { hour: null, orders: 0 };

    const [selectedPeriod, setSelectedPeriod] = useState('last30'); // default
    const [filteredRevenueData, setFilteredRevenueData] = useState([]);
    useEffect(() => {
        if (!analytics) return;

        const filterData = () => {
            const today = new Date();
            let cutoffDate = new Date();

            switch (selectedPeriod) {
                case 'last7':
                    cutoffDate.setDate(today.getDate() - 7);
                    break;
                case 'last30':
                    cutoffDate.setDate(today.getDate() - 30);
                    break;
                case 'q1':
                    cutoffDate = new Date(today.getFullYear(), 0, 1); // Jan 1
                    break;
                // case 'q2':
                //     cutoffDate = new Date(today.getFullYear(), 3, 1); // Apr 1
                //     break;
                // case 'q3':
                //     cutoffDate = new Date(today.getFullYear(), 6, 1); // July 1
                //     break;
                // case 'q4':
                //     cutoffDate = new Date(today.getFullYear(), 9, 1); // Oct 1
                //     break;
                default:
                    cutoffDate.setDate(today.getDate() - 30);
            }

            const filtered = analytics.revenue_per_day.filter((entry) => {
                return new Date(entry.date) >= cutoffDate;
            });

            setFilteredRevenueData(filtered);
        };

        filterData();
    }, [analytics, selectedPeriod]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/analytics/live');
                setAnalytics(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000); // refresh every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    if (!analytics) return <p>Loading analytics...</p>;

    return (
        <div className="main-container">
            <div className="top-header">
                <Header toggleSidebar={toggleSidebar} />
            </div>

            <div className="content-layout">
                {isSidebarOpen && <div className="sidebar-container"><Sidebar /></div>}

                <div className={`content ${isSidebarOpen ? 'compact' : 'expanded'}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}> 
                        <h2>System Analytics Dashboard</h2>
                        <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
                            <button
                                onClick={() => window.print()}
                                style={{
                                    backgroundColor: '#124734',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    width: '150px',
                                    marginLeft: '10px',
                                }}
                            >
                                Download Report
                            </button>
                        </div>
                    </div>


                    <div className="kpi-container">
                        <div className="kpi-card">
                            <h4>Total Orders Today</h4>
                            <p>{analytics.total_orders_today}</p>
                        </div>
                        <div className="kpi-card">
                            <h4>Total Revenue Today</h4>
                            <p>${analytics.total_revenue_today.toFixed(2)}</p>
                        </div>
                        <div className="kpi-card">
                            <h4>Top Vendor</h4>
                            <p>{analytics.top_vendor_name}</p>
                        </div>
                    </div>

                    <div className="chart-container">
                        <h3>Revenue Over Time</h3>
                        <div className="filter-container">
                            <label>Show:</label>
                            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                                <option value="last7">Last 7 Days</option>
                                <option value="last30">Last 30 Days</option>
                                <option value="q1">This Year - Q1</option>
                                {/* <option value="q2">This Year - Q2</option>
                                <option value="q3">This Year - Q3</option>
                                <option value="q4">This Year - Q4</option> */}
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={filteredRevenueData}>
                                {/* Gradient background under the line */}
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                {/* Axes */}
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => `$${value}`} />

                                {/* Tooltip */}
                                <Tooltip
                                    formatter={(value) => `$${value.toFixed(2)}`}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />

                                {/* Legend */}
                                <Legend />

                                {/* Revenue Line */}
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    strokeWidth={2}
                                    dot={({ payload, cx, cy, index }) => {
                                        const maxRevenue = Math.max(...analytics.revenue_per_day.map(d => d.revenue));
                                        const isPeak = payload.revenue === maxRevenue;
                                        return (
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={isPeak ? 7 : 4}
                                                fill={isPeak ? "#FF8042" : "#8884d8"}
                                                stroke="#fff"
                                                strokeWidth={1}
                                            />
                                        );
                                    }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-container">
                        <h3>Orders Per Hour</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={analytics.orders_per_hour}>
                                <XAxis
                                    dataKey="hour"
                                    label={{ value: 'Hour of the Day', position: 'insideBottom', dy: 10 }}
                                    tickFormatter={(hour) => `${hour}:00`}
                                />
                                <YAxis
                                    label={{ value: 'Number of Orders', angle: -90, position: 'insideLeft', dy: -10 }}
                                />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="orders"
                                // Customized coloring
                                >
                                    {analytics.orders_per_hour.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.hour === peakHour.hour ? "#FF8042" : "#82ca9d"}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>


                    <div className="chart-container">
                        <h3>Popular Vendors Today (Revenue)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { vendor: "Burger Delight", revenue: 3500 },
                                        { vendor: "Lunch Box Bowls", revenue: 2800 },
                                        { vendor: "Seoul Kitchen", revenue: 1500 },
                                        { vendor: "Arabian Bites", revenue: 1200 },
                                        { vendor: "Lime and Dime", revenue: 1000 },
                                    ]}
                                    dataKey="revenue"
                                    nameKey="vendor"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent, payload }) => `${name}: ${(percent * 100).toFixed(1)}% ($${payload.revenue})`}
                                >
                                    {[...Array(5)].map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>

                                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-container">
                        <h3>Popular Items Today</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { item: "Burger", quantity: 150 },
                                        { item: "Pizza", quantity: 120 },
                                        { item: "Sandwich", quantity: 100 },
                                        { item: "Pasta", quantity: 80 },
                                        { item: "Fries", quantity: 60 },
                                    ]}
                                    dataKey="quantity"
                                    nameKey="item"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent, payload }) => `${name}: ${(percent * 100).toFixed(1)}% (${payload.quantity})`}
                                >
                                    {[...Array(5)].map((_, index) => (
                                        <Cell key={`cell-item-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>

                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
