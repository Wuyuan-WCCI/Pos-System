import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CustomerDetails = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                // Fetch customer information including orders
                const response = await axios.get(`http://localhost:8080/api/customers/${customerId}`);
                setCustomer(response.data);
            } catch (error) {
                setError('Error fetching customer details.');
                console.error('Error fetching customer details:', error);
            }
        };

        fetchCustomerDetails();
    }, [customerId]);

    if (!customer) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Customer Details</h2>
            <div>
                <h3>Customer Information</h3>
                <p>Name: {customer.name}</p>
                <p>Email: {customer.email}</p>
                <p>Phone: {customer.phone}</p>
                <p>Address: {customer.address}</p>
            </div>
            <div>
                <h3>Orders</h3>
                {customer.orders.length > 0 ? (
                    <ul>
                        {customer.orders.map(order => (
                            <li key={order.id}>
                            <Link to={`/orders/${order.id}`}>
                                <p>Order ID: {order.id}</p>
                                <p>Total Amount: ${order.totalAmount}</p>
                                <p>Status: {order.status}</p>
                                <p>Payment Method: {Object.entries(order.paymentMethods).map(([method, amount]) => (
                                <li key={method}>
                                    {method}: ${amount.toFixed(2)}
                                </li>
                            ))}</p>
                                <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
                                </Link>
                                <ul>
                            
                        </ul>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No orders found for this customer.</p>
                )}
            </div>
        </div>
    );
};

export default CustomerDetails;
