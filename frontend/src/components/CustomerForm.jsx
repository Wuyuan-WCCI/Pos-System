import React, { useState, useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';

const CustomerForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const { addCustomer } = useContext(CustomerContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            await addCustomer({ name: name.trim(), email: email.trim(), phone: phone.trim(), address: address.trim() });
            setFeedbackMsg('Customer created successfully.');
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
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
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter customer name"
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter customer email"
                    />
                </div>
                <div>
                    <label>Phone:</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter customer phone"
                    />
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter customer address"
                    />
                </div>
                <button type="submit">Create Customer</button>
            </form>
        </div>
    );
};

export default CustomerForm;
