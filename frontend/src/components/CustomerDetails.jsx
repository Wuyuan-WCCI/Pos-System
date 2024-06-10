// CustomerDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CustomerDetails = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                // Fetch customer information
                const customerResponse = await axios.get(`http://localhost:8080/api/customers/${customerId}`);
                setCustomer(customerResponse.data);

                // Fetch orders made by the customer
                const ordersResponse = await axios.get(`http://localhost:8080/api/customers/${customerId}/orders`);
                setOrders(ordersResponse.data);
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
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            <p>Order ID: {order.id}</p>
                            <p>Total Amount: ${order.totalAmount}</p>
                            <p>Status: {order.status}</p>
                            <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CustomerDetails;
