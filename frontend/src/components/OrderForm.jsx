import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';

const OrderForm = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const { products, fetchProducts } = useContext(ProductContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleQuantityChange = (productId, quantity) => {
        const updatedItems = [...orderItems];
        const index = updatedItems.findIndex(item => item.productId === productId);
        if (index !== -1) {
            updatedItems[index].quantity = quantity;
        } else {
            const product = products.find(p => p.id === productId);
            updatedItems.push({ 
                productId, 
                quantity, 
                productName: product.name, 
                productPrice: product.price 
            });
        }
        setOrderItems(updatedItems);
        calculateTotalPrice(updatedItems);
    };

    const calculateTotalPrice = (items) => {
        let total = 0;
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        }
        setTotalPrice(total);
    };

    const handleAddToOrder = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = orderItems.find(item => item.productId === productId);
            if (existingItem) {
                handleQuantityChange(productId, existingItem.quantity + 1);
            } else {
                const updatedItems = [...orderItems, { 
                    productId, 
                    quantity: 1, 
                    productName: product.name, 
                    productPrice: product.price 
                }];
                setOrderItems(updatedItems);
                calculateTotalPrice(updatedItems);
            }
        }
    };

    const handleCheckout = () => {
        navigate('/payment', { state: { orderItems, totalPrice } });
    };

    return (
        <div>
            <h2>Create Order</h2>
            <div>
                <h3>Products</h3>
                <ul>
                    {products.map(product => (
                        <li key={product.id}>
                            <span>{product.name} - ${product.price.toFixed(2)}</span>
                            <input
                                type="number"
                                value={orderItems.find(item => item.productId === product.id)?.quantity || ''}
                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10) || 0)}
                            />
                            <button onClick={() => handleAddToOrder(product.id)}>Add</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Order Summary</h3>
                <ul>
                    {orderItems.map(item => (
                        <li key={item.productId}>
                            {products.find(p => p.id === item.productId)?.name}: {item.quantity}
                        </li>
                    ))}
                </ul>
                <p>Total Price: ${totalPrice.toFixed(2)}</p>
                <button onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    );
};

export default OrderForm;
