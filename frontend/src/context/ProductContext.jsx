import React, { createContext, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addProduct = async (product) => {
        try {
            const response = await axios.post('http://localhost:8080/api/products', product);
            setProducts([...products, response.data]);
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    };

    ProductProvider.PropTypes = {
            children: PropTypes.node.isRequired
    }

    return (
        <ProductContext.Provider value={{ products, fetchProducts, addProduct }}>
            {children}
        </ProductContext.Provider>
    );
};
