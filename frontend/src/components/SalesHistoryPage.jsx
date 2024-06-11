import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const SalesHistoryPage = () => {
    const [salesHistory, setSalesHistory] = useState([]);
    const [date, setDate] = useState(new Date());
    const [period, setPeriod] = useState('day');

    useEffect(() => {
        fetchSalesHistory();
    }, [date, period]);

    const fetchSalesHistory = async () => {
        try {
            const formattedDate = format(date, 'yyyy-MM-dd');
            const response = await axios.get(`http://localhost:8080/api/sales-history/${period}?date=${formattedDate}`);
            setSalesHistory(response.data);
        } catch (error) {
            console.error('Error fetching sales history:', error);
        }
    };

    const calculateTotalByPaymentMethod = () => {
        return salesHistory.reduce((acc, order) => {
            const paymentMethods = order.paymentMethods || {};
            for (const [method, amount] of Object.entries(paymentMethods)) {
                if (!acc[method]) {
                    acc[method] = 0;
                }
                acc[method] += amount;
            }
            return acc;
        }, {});
    };

    const totalByPaymentMethod = calculateTotalByPaymentMethod();

    return (
        <div>
            <h2>Sales History</h2>
            <label>
                Date:
                <input
                    type="date"
                    value={format(date, 'yyyy-MM-dd')}
                    onChange={(e) => setDate(new Date(e.target.value))}
                />
            </label>
            <label>
                Period:
                <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                </select>
            </label>
            <ul>
            {salesHistory.map(order => (
    <li key={order.id}>
        <Link to={`/orders/${order.id}/items`}>
            {order.id} -- {new Date(order.orderDate).toLocaleString()} - {order.status} - ${(order.totalAmount ?? 0).toFixed(2)}
        </Link>
        <ul>
            {Object.entries(order.paymentMethods || {}).map(([method, amount], index) => (
                <li key={`${order.id}-${method}-${index}`}>
                    {method}: ${(amount ?? 0).toFixed(2)}
                </li>
            ))}
        </ul>
    </li>
))}
</ul>

            <div>
                <h3>Total Sales by Payment Method:</h3>
                <ul>
                    {Object.entries(totalByPaymentMethod).map(([method, total]) => (
                        <li key={method}>
                            {method}: ${(total ?? 0).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <h3>Total Sales: ${(salesHistory.reduce((total, order) => total + (order.totalAmount ?? 0), 0)).toFixed(2)}</h3>
            </div>
        </div>
    );
};

export default SalesHistoryPage;
