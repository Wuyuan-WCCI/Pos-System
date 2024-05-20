import React, { useState, useEffect, useContext } from 'react';
import { CustomerContext } from '../context/CustomerContext';
import { ProductContext } from '../context/ProductContext';
import { OrderContext } from '../context/OrderContext';

const OrderForm = () => {
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const { customers, fetchCustomers } = useContext(CustomerContext);
    const { products, fetchProducts } = useContext(ProductContext);
    const { addOrder } = useContext(OrderContext);

    useEffect(() => {
        fetchCustomers();
        fetchProducts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCustomer || !selectedProduct || !quantity.trim()) {
            setError('Please select a customer, product, and enter quantity.');
            return;
        }

        const orderItems = [{
            product: products.find(product => product.id === parseInt(selectedProduct)),
            quantity: parseInt(quantity.trim(), 10)
        }];

        const order = {
            customer: customers.find(customer => customer.id === selectedCustomer),
            orderItems,
            orderDate: new Date(),
            status: 'Pending',
            totalAmount: orderItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
        };

        try {
            await addOrder(order);
            setFeedbackMsg('Order created successfully.');
            setSelectedCustomer('');
            setSelectedProduct('');
            setQuantity('');
        } catch (error) {
            console.error('Error creating order:', error);
            setError('Failed to create order. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Create Order</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {feedbackMsg && <p style={{ color: 'green' }}>{feedbackMsg}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Select Customer:</label>
                    <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                        <option value="">-- Select Customer --</option>
                        {customers.map(customer => (
                            <option key={customer.id} value={customer.id}>{customer.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Select Product:</label>
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        <option value="">-- Select Product --</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name} - ${product.price.toFixed(2)}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                    />
                </div>
                <button type="submit">Create Order</button>
            </form>
        </div>
    );
};

export default OrderForm;
