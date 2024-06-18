import React, { createContext, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchOrder = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    };

    const addOrder = async (order) => {
        try {
            const response = await axios.post('http://localhost:8080/api/orders', order);
            setOrders([...orders, response.data]);
        } catch (error) {
            console.error('Error adding order:', error);
            throw error;
        }
    };

    const updateOrder = async (orderId, updatedOrderData) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/orders/${orderId}`, updatedOrderData);
            // Update the local orders state with the updated order
            const updatedOrders = orders.map(order => (order.id === orderId ? response.data : order));
            setOrders(updatedOrders);
            setOrder(response.data); // Optionally update the current order state
            return response.data; // Return the updated order data if needed
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    };

    OrderProvider.propTypes = {
        children: PropTypes.node.isRequired
    };

    const value = {
        orders,
        order,
        fetchOrders,
        fetchOrder,
        addOrder,
        updateOrder
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
