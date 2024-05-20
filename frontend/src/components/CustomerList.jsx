import React, { useContext, useEffect } from 'react';
import { CustomerContext } from '../context/CustomerContext';

const CustomerList = () => {
    const { customers, fetchCustomers } = useContext(CustomerContext);

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div>
            <h2>Customer List</h2>
            <ul>
                {customers.map(customer => (
                    <li key={customer.id}>{customer.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerList;
