import React, { createContext, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
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

    OrderProvider.PropTypes = {
        children: PropTypes.node.isRequired
    }

    return (
        <OrderContext.Provider value={{ orders, fetchOrders, addOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
