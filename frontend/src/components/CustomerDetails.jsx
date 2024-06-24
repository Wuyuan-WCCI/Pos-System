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
                                    Order ID: {order.id}<br />
                                    Total Amount: ${order.totalAmount}<br />
                                    Status: {order.status}<br />
                                    Order Date: {new Date(order.orderDate).toLocaleString()}<br />
                                </Link><br />
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
