// CustomerList.js

import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { CustomerContext } from '../context/CustomerContext';
import { useNavigate } from 'react-router-dom';


const CustomerList = () => {
    const { customers, fetchCustomers } = useContext(CustomerContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleNewCustomer = () => {
        navigate('/customers/new')
    };

    return (
        <div>
            <h2>Customer List</h2>
            <ul>
                {customers.map(customer => (
                    <li key={customer.id}>
                    <Link to={`/customers/${customer.id}`}>{customer.name}</Link>
                    </li>
                ))}
            </ul>
            <button onClick={handleNewCustomer}>New Customer</button> {/* Add New Customer button */}
        </div>
    );
};

export default CustomerList;
