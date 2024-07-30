import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import './SalesHistoryPage.css'; // Import CSS file for styling

const SalesHistoryPage = () => {
    const [salesHistory, setSalesHistory] = useState([]);
    const [allSalesHistory, setAllSalesHistory] = useState([]); // State to hold all sales data
    const [date, setDate] = useState(new Date());
    const [period, setPeriod] = useState('day');
    const [pageSize, setPageSize] = useState(25); // Default page size
    const [currentPage, setCurrentPage] = useState(1); // Current page

    const fetchSalesHistory = useCallback(async () => {
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const response = await axios.get(`http://localhost:8080/api/sales-history/${period}?date=${formattedDate}&pageSize=${pageSize}&page=${currentPage}`);
            console.log('API Response:', response.data); // Log the response
            setSalesHistory(response.data.content);
        } catch (error) {
            console.error('Error fetching sales history:', error);
        }
    }, [date, period, pageSize, currentPage]);

    const fetchAllSalesHistory = useCallback(async () => {
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            let allData = [];
            let page = 1;
            while (true) {
                const response = await axios.get(`http://localhost:8080/api/sales-history/${period}?date=${formattedDate}&pageSize=100&page=${page}`);
                const data = response.data.content;
                if (data.length === 0) break;
                allData = [...allData, ...data];
                page += 1;
            }
            setAllSalesHistory(allData);
        } catch (error) {
            console.error('Error fetching all sales history:', error);
        }
    }, [date, period]);

    useEffect(() => {
        fetchSalesHistory();
        fetchAllSalesHistory(); // Fetch all sales data for totals
    }, [fetchSalesHistory, fetchAllSalesHistory]);

    const calculateTotalByPaymentMethod = (data) => {
        return data.reduce((acc, order) => {
            // Exclude 'Pending' orders from the calculation
            if (order.status !== 'Pending') {
                const paymentMethods = order.paymentMethods || {};
                for (const [method, amount] of Object.entries(paymentMethods)) {
                    if (!acc[method]) {
                        acc[method] = 0;
                    }
                    acc[method] += amount;
                }
            }
            return acc;
        }, {});
    };

    const totalByPaymentMethod = calculateTotalByPaymentMethod(allSalesHistory);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDateChange = (e) => {
        const selectedDate = parseISO(e.target.value);
        setDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 0, 0, 0)); // Set to start of day local time
        setCurrentPage(1); // Reset to first page when date changes
    };

    return (
        <div className="sales-history-page">
            <header className="header">
                <h1>Sales History</h1>
            </header>

            <section className="filters">
                <div className="filter-item">
                    <label>Date:</label>
                    <input
                        type="date"
                        value={format(date, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="filter-item">
                    <label>Period:</label>
                    <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                        <option value="day">Day</option>
                        <option value="week">Week</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </div>
                <div className="filter-item">
                    <label>Show per page:</label>
                    <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </section>

            {/* Order Summary */}
            <section className="order-summary">
                <h2>Order Summary</h2>
                <div className="order-summary-header">
                    <span>Order Id</span>
                    <span>Customer</span>
                    <span>Order Date</span>
                    <span>Order Status</span>
                    <span>Order Total</span>
                </div>
                {salesHistory.map(order => (
                    <div className="sales-card" key={order.id}>
                        <Link to={`/orders/${order.id}`}>
                            <div>{order.id}</div>
                        </Link>
                        <div>{order.customerName}</div>
                        <div>{new Date(order.orderDate).toLocaleString()}</div>
                        <div>{order.status}</div>
                        <div>${(order.totalAmount ?? 0).toFixed(2)}</div>
                    </div>
                ))}
            </section>

            {/* Totals */}
            <section className="totals">
                <h2>Total Sales by Payment Method:</h2>
                <ul>
                    {Object.entries(totalByPaymentMethod).map(([method, total]) => (
                        <li key={method}>
                            {method}: ${(total ?? 0).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <h2>Total Sales: ${(allSalesHistory.reduce((total, order) => total + (order.status !== 'Pending' ? (order.totalAmount ?? 0) : 0), 0)).toFixed(2)}</h2>
            </section>

            {/* Pagination Controls */}
            {salesHistory.length > 0 && (
                <section className="pagination">
                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                    <button disabled={salesHistory.length < pageSize} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                </section>
            )}
        </div>
    );
};

export default SalesHistoryPage;
