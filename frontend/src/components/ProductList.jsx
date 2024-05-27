import React, { useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';

const ProductList = () => {
    const { products, fetchProducts } = useContext(ProductContext);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div>
            <h2>Product List</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>{product.name} - ${product.price.toFixed(2)}</li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
