import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Create a new context for Order Items
const OrderItemContext = createContext();

// Create a custom hook to access the OrderItemContext
export const useOrderItemContext = () => useContext(OrderItemContext);

// Create a provider component for the OrderItemContext
export const OrderItemProvider = ({ children }) => {
    // State to hold order items
    const [orderItems, setOrderItems] = useState([]);

    // Function to add an order item
    const addOrderItem = (orderItem) => {
        setOrderItems(prevOrderItems => [...prevOrderItems, orderItem]);
    };

    // Function to remove an order item
    const removeOrderItem = (index) => {
        setOrderItems(prevOrderItems => {
            const updatedOrderItems = [...prevOrderItems];
            updatedOrderItems.splice(index, 1);
            return updatedOrderItems;
        });
    };

    // Function to clear all order items
    const clearOrderItems = () => {
        setOrderItems([]);
    };

    // Value to be provided by the context
    const value = {
        orderItems,
        addOrderItem,
        removeOrderItem,
        clearOrderItems
    };

    OrderItemProvider.propTypes = {
        children: PropTypes.node.isRequired
    }

    return (
        <OrderItemContext.Provider value={value}>
            {children}
        </OrderItemContext.Provider>
    );
};
