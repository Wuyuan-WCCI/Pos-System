import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import axios from 'axios';

const OrderForm = () => {
    const [orderItems, setOrderItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' });
    const [isExistingCustomer, setIsExistingCustomer] = useState(false);
    const { products, fetchProducts } = useContext(ProductContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleQuantityChange = (productId, quantity) => {
        if (quantity < 0) return;
        const updatedItems = orderItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
        );
        setOrderItems(updatedItems);
        calculateTotalPrice(updatedItems);
    };

    const calculateTotalPrice = (items) => {
        if (!items) return;
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
                const newOrderItems = [...orderItems, { product, quantity: 1 }];
                setOrderItems(newOrderItems);
                calculateTotalPrice(newOrderItems);
            }
        }
    };

    const handleCustomerLookup = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/customers/by-phone`, {
                params: { phone: customerInfo.phone }
            });
            const existingCustomer = response.data;
            if (existingCustomer) {
                setCustomerInfo(existingCustomer);
            } else {
                alert('No customer found with this phone number.');
            }
        } catch (error) {
            console.error('Error fetching existing customer:', error);
            alert('Error fetching existing customer. Please try again.');
        }
    };

    const handleCheckout = () => {
        navigate('/payment', { state: { orderItems, totalPrice, customerInfo } });
    };

    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    return (
        <div>
            <h2>Create Order</h2>
            <div>
                <h3>Customer Type</h3>
                <label>
                    <input
                        type="radio"
                        name="customerType"
                        value="new"
                        checked={!isExistingCustomer}
                        onChange={() => setIsExistingCustomer(false)}
                    />
                    New Customer
                </label>
                <label>
                    <input
                        type="radio"
                        name="customerType"
                        value="existing"
                        checked={isExistingCustomer}
                        onChange={() => setIsExistingCustomer(true)}
                    />
                    Existing Customer
                </label>
            </div>
            {isExistingCustomer && (
                <div>
                    <h3>Enter Phone Number</h3>
                    <input
                        type="tel"
                        name="phone"
                        value={customerInfo.phone || ''}
                        onChange={handleCustomerInfoChange}
                    />
                    <button onClick={handleCustomerLookup}>Find Customer</button>
                </div>
            )}
            {isExistingCustomer && customerInfo.name && (
                <div>
                    <h3>Customer Information</h3>
                    <p>Name: {customerInfo.name}</p>
                    <p>Email: {customerInfo.email}</p>
                    <p>Phone: {customerInfo.phone}</p>
                    <p>Address: {customerInfo.address}</p>
                </div>
            )}
            <div>
                <h3>Products</h3>
                <ul>
                    {products.map(product => (
                        <li key={product.id}>
                            <span>{product.name} - ${product.price.toFixed(2)}</span>
                            <input
                                type="number"
                                min="0"
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
