import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantityInStock, setQuantityInStock] = useState('');
    const [error, setError] = useState('');
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const { addProduct } = useContext(ProductContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !price.trim() || !quantityInStock.trim()) {
            setError('Please enter product details.');
            return;
        }

        try {
            await addProduct({
                name: name.trim(),
                brand: brand.trim(),
                description: description.trim(),
                price: parseFloat(price),
                quantityInStock: parseInt(quantityInStock)
            });
            setFeedbackMsg('Product created successfully.');
            // Clear form fields after successful submission
            setName('');
            setBrand('');
            setDescription('');
            setPrice('');
            setQuantityInStock('');
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
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Enter product brand"
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter product description"
                />
                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter product price"
                />
                <input
                    type="text"
                    value={quantityInStock}
                    onChange={(e) => setQuantityInStock(e.target.value)}
                    placeholder="Enter quantity in stock"
                />
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default ProductForm;
