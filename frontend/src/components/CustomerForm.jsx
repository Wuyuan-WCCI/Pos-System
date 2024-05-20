import React, { useState, useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';

const CustomerForm = () => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const { addCustomer } = useContext(CustomerContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter a customer name.');
            return;
        }

        try {
            await addCustomer({ name: name.trim() });
            setFeedbackMsg('Customer created successfully.');
            setName('');
        } catch (error) {
            console.error('Error creating customer:', error);
            setError('Failed to create customer. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Create Customer</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {feedbackMsg && <p style={{ color: 'green' }}>{feedbackMsg}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter customer name"
                />
                <button type="submit">Create Customer</button>
            </form>
        </div>
    );
};

export default CustomerForm;
