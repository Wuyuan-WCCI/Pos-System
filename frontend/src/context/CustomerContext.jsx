import React, { createContext, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const addCustomer = async (customer) => {
        try {
            const response = await axios.post('http://localhost:8080/api/customers', customer);
            setCustomers([...customers, response.data]);
        } catch (error) {
            console.error('Error adding customer:', error);
            throw error;
        }
    };

    CustomerProvider.propTypes = {
        children: PropTypes.node.isRequired // Validate children prop
    };

    return (
        <CustomerContext.Provider value={{ customers, fetchCustomers, addCustomer }}>
            {children}
        </CustomerContext.Provider>
    );
};
