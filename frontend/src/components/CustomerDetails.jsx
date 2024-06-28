import React, { useContext, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext'; // Update the path accordingly
import './CustomerDetails.css'; // Import the CSS file for styling

const CustomerDetails = () => {
    const { customerId } = useParams();
    const { customer, fetchCustomer } = useContext(CustomerContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCustomer(customerId)
            .then(() => setLoading(false))
            .catch((error) => {
                setError('Error fetching customer details.');
                console.error('Error fetching customer details:', error);
                setLoading(false);
            });
    }, [fetchCustomer, customerId]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="customer-detail-container">
            <h2>Customer Details</h2>
            {customer && (
                <div className="customer-details">
                    <div className="customer-info card">
                        <p><strong>Name:</strong> {customer.name}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                        <p><strong>Phone:</strong> {customer.phone}</p>
                        <p><strong>Address:</strong> {customer.address}</p>
                    </div>
                    <div className="customer-orders card">
                        <h3>Orders</h3>
                        {customer.orders.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Order Id</th>
                                        <th>Order Date</th>
                                        <th>Total Amount</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customer.orders.map((order) => (
                                        <tr key={order.id}>
                                            <td><Link to={`/orders/${order.id}`}>{order.id}</Link></td>
                                            <td>{new Date(order.orderDate).toLocaleString()}</td>
                                            <td>${order.totalAmount.toFixed(2)}</td>
                                            <td>{order.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No orders found for this customer.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerDetails;
