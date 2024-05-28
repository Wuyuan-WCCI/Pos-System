import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderItemsPage = () => {
    const [orderItems, setOrderItems] = useState([]);
    const { orderId } = useParams();

    useEffect(() => {
        const fetchOrderItems = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/orders/${orderId}/items`);
                setOrderItems(response.data);
            } catch (error) {
                console.error('Error fetching order items:', error);
            }
        };

        fetchOrderItems();
    }, [orderId]);

    return (
        <div>
            <h2>Order Items</h2>
            <ul>
                {orderItems.map(item => (
                    <li key={item.id}>
                        {item.product.name} - Quantity: {item.quantity} - Price: ${item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderItemsPage;
