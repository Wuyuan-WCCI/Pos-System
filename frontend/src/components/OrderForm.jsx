import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import axios from 'axios';
import './OrderForm.css'; // Import custom styles

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
            const quantityToAdd = existingItem ? existingItem.quantity + 1 : 1;
            if (quantityToAdd <= product.quantityInStock) {
                if (existingItem) {
                    handleQuantityChange(productId, existingItem.quantity + 1);
                } else {
                    const newOrderItems = [...orderItems, { product, quantity: 1 }];
                    setOrderItems(newOrderItems);
                    calculateTotalPrice(newOrderItems);
                }
            } else {
                alert(`Cannot add more of ${product.name} to order. Only ${product.quantityInStock} left in stock.`);
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

    const handleCheckout = async () => {
        const order = {
            customer: customerInfo,
            customerName: customerInfo.name,
            orderItems,
            totalAmount: totalPrice.toFixed(2),
            status: 'Pending',
            orderDate: new Date().toISOString(),
        };
        try {
            const response = await axios.post('http://localhost:8080/api/orders', order);
            const newOrder = response.data;
            navigate(`/payment/${newOrder.id}`, { state: { customerInfo } });
        } catch (error) {
            console.error('Error creating order', error);
            alert('Error creating order. Please try again.');
        }
    };

    const handleCustomerInfoChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo({ ...customerInfo, [name]: value });
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Create Order</h2>
            <div className="customer-section my-4 p-3 rounded shadow-sm">
                <h3>Customer Type</h3>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        className="form-check-input"
                        name="customerType"
                        value="new"
                        checked={!isExistingCustomer}
                        onChange={() => setIsExistingCustomer(false)}
                    />
                    <label className="form-check-label">New Customer</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        className="form-check-input"
                        name="customerType"
                        value="existing"
                        checked={isExistingCustomer}
                        onChange={() => setIsExistingCustomer(true)}
                    />
                    <label className="form-check-label">Existing Customer</label>
                </div>
            </div>

            {isExistingCustomer && (
                <div className="customer-lookup my-4 p-3 rounded shadow-sm">
                    <h3>Enter Phone Number</h3>
                    <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={customerInfo.phone || ''}
                        onChange={handleCustomerInfoChange}
                    />
                    <button className="btn btn-primary mt-2" onClick={handleCustomerLookup}>Find Customer</button>
                </div>
            )}

            {!isExistingCustomer && (
                <div className="customer-info my-4 p-3 rounded shadow-sm">
                    <h3>Customer Information</h3>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Name</label>
                            <input type="text" className="form-control" name="name" value={customerInfo.name} onChange={handleCustomerInfoChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" name="email" value={customerInfo.email} onChange={handleCustomerInfoChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Phone</label>
                            <input type="tel" className="form-control" name="phone" value={customerInfo.phone} onChange={handleCustomerInfoChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Address</label>
                            <input type="text" className="form-control" name="address" value={customerInfo.address} onChange={handleCustomerInfoChange} />
                        </div>
                    </div>
                </div>
            )}

            {isExistingCustomer && customerInfo.name && (
                <div className="existing-customer-info my-4 p-3 rounded shadow-sm">
                    <h3>Customer Information</h3>
                    <p><strong>Name:</strong> {customerInfo.name}</p>
                    <p><strong>Email:</strong> {customerInfo.email}</p>
                    <p><strong>Phone:</strong> {customerInfo.phone}</p>
                    <p><strong>Address:</strong> {customerInfo.address}</p>
                </div>
            )}

            <div className="products-section my-4 p-3 rounded shadow-sm">
                <h3>Products</h3>
                <div className="row">
                    {products.map(product => (
                        <div key={product.id} className="col-md-6 col-lg-4 mb-3">
                            <div className="card product-card d-flex">
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">${product.price.toFixed(2)}</h6>
                                    <p className="card-text">In stock: {product.quantityInStock}</p>
                                </div>
                                <div className="card-body">
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            className="form-control"
                                            min="0"
                                            value={orderItems.find(item => item.product.id === product.id)?.quantity || ''}
                                            onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value, 10) || 0)}
                                        />
                                        <button className="btn btn-primary" onClick={() => handleAddToOrder(product.id)}>Add</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="order-summary my-4 p-3 rounded shadow-sm">
                <h3>Order Summary</h3>
                <ul className="list-group mb-3">
                    {orderItems.map(item => (
                        <li key={item.product.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {item.product.name}
                            <span className="badge bg-primary rounded-pill">{item.quantity}</span>
                        </li>
                    ))}
                </ul>
                <p className="total-price"><strong>Total Price: ${totalPrice.toFixed(2)}</strong></p>
                <button className="btn btn-success w-100" onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    );
};

export default OrderForm;
