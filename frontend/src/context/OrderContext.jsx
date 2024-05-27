import React, { createContext, useState, useEffect } from 'react';
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
    


    OrderProvider.propTypes = {
        children: PropTypes.node.isRequired
    }

    const value = {
        orders,
        fetchOrders,
        addOrder,
      };

      return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
    
};
