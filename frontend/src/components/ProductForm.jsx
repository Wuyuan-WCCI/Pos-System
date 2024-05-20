import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const { addProduct } = useContext(ProductContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !price.trim()) {
            setError('Please enter a product name and price.');
            return;
        }

        try {
            await addProduct({ name: name.trim(), price: parseFloat(price) });
            setFeedbackMsg('Product created successfully.');
            setName('');
            setPrice('');
        } catch (error) {
            console.error('Error creating product:', error);
            setError('Failed to create product. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Create Product</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {feedbackMsg && <p style={{ color: 'green' }}>{feedbackMsg}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                />
                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter product price"
                />
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default ProductForm;
