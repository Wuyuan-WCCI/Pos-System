import React, { useState, useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';

const CustomerForm = ({ closeModal }) => {
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
            closeModal(); // Close modal on successful submission
        } catch (error) {
            console.error('Error creating customer:', error);
            setError('Failed to create customer. Please try again later.');
        }
    };

    const handleCancel = () => {
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setError('');
        setFeedbackMsg('');
        closeModal(); // Close modal on cancel
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create Customer</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {feedbackMsg && <div className="alert alert-success">{feedbackMsg}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter customer name"
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter customer email"
                    />
                </div>
                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter customer phone"
                    />
                </div>
                <div className="form-group">
                    <label>Address:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter customer address"
                    />
                </div>
                <div className="d-flex justify-content-between" >
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        Add Customer
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
