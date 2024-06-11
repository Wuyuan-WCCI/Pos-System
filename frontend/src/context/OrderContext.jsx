import React, { createContext, useState, useEffect } from 'react';
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

    OrderProvider.propTypes = {
        children: PropTypes.node.isRequired
    };

    const value = {
        orders,
        order,
        fetchOrders,
        fetchOrder,
        addOrder,
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
