import React, { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { TextField, Button, Typography, Box } from '@mui/material';

const ProductForm = () => {
    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [quantityInStock, setQuantityInStock] = useState('');
    const [errors, setErrors] = useState({});
    const [feedbackMsg, setFeedbackMsg] = useState('');
    const { addProduct } = useContext(ProductContext);

    const validate = () => {
        const errors = {};
        if (!name.trim()) errors.name = 'Product name is required';
        if (!price.trim()) errors.price = 'Product price is required';
        if (isNaN(price) || parseFloat(price) <= 0) errors.price = 'Product price must be a positive number';
        if (!quantityInStock.trim()) errors.quantityInStock = 'Quantity in stock is required';
        if (isNaN(quantityInStock) || parseInt(quantityInStock) < 0) errors.quantityInStock = 'Quantity in stock must be a non-negative integer';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
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
            setErrors({});
        } catch (error) {
            console.error('Error creating product:', error);
            setFeedbackMsg('Failed to create product. Please try again later.');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {feedbackMsg && <Typography color="primary">{feedbackMsg}</Typography>}
            <TextField
                fullWidth
                margin="normal"
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                error={!!errors.name}
                helperText={errors.name}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                variant="outlined"
            />
            <TextField
                fullWidth
                margin="normal"
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={4}
                variant="outlined"
            />
            <TextField
                fullWidth
                margin="normal"
                label="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                variant="outlined"
                error={!!errors.price}
                helperText={errors.price}
            />
            <TextField
                fullWidth
                margin="normal"
                label="Quantity in Stock"
                value={quantityInStock}
                onChange={(e) => setQuantityInStock(e.target.value)}
                type="number"
                variant="outlined"
                error={!!errors.quantityInStock}
                helperText={errors.quantityInStock}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
            >
                Add Product
            </Button>
        </Box>
    );
};

export default ProductForm;
