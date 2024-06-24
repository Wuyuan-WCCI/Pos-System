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
            console.error('Error fetching orders:', error.message);
        }
    };

    const fetchOrder = async (orderId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error.message);
            throw new Error('Failed to fetch order details. Please try again later.');
        }
    };

    const addOrder = async (order) => {
        try {
            const response = await axios.post('http://localhost:8080/api/orders', order);
            setOrders([...orders, response.data]);
        } catch (error) {
            console.error('Error adding order:', error.message);
            throw new Error('Failed to add order. Please try again later.');
        }
    };

    const updateOrder = async (orderId, updatedOrderData) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/orders/${orderId}`, updatedOrderData);
            const updatedOrders = orders.map(order => (order.id === orderId ? response.data : order));
            setOrders(updatedOrders);
            setOrder(response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating order:', error.message);
            throw new Error('Failed to update order. Please try again later.');
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
