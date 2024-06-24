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

    // Calculate the total cost of the order items
    const totalCost = orderItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);

    return (
        <div>
            <h2>Order Items</h2>
            <ul>
                {orderItems.map(item => (
                    <li key={item.id}>
                        {item.product.name} ------ ${item.product.price} x {item.quantity} = ${(item.quantity * item.product.price).toFixed(2)}
                    </li>
                ))}
            </ul>
            <h3>Total: ${totalCost.toFixed(2)}</h3>
        </div>
    );
};

export default OrderItemsPage;
