import React, { useState, useEffect, useContext } from 'react';
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
        const updatedItems = orderItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        );
        setOrderItems(updatedItems);
        calculateTotalPrice(updatedItems);
    };

    const calculateTotalPrice = (items) => {
        const total = items.reduce((acc, item) => acc + item.quantity * item.product.price, 0);
        setTotalPrice(total);
    };

    const handleAddToOrder = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const existingItem = orderItems.find(item => item.product.id === productId);
            if (existingItem) {
                handleQuantityChange(productId, existingItem.quantity + 1);
            } else {
                setOrderItems([...orderItems, { product, quantity: 1 }]);
                calculateTotalPrice([...orderItems, { product, quantity: 1 }]);
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
                                value={orderItems.find(item => item.product.id === product.id)?.quantity || ''}
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
                        <li key={item.product.id}>
                            {item.product.name}: {item.quantity}
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
