import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { orderItems, totalPrice } = location.state || { orderItems: [], totalPrice: 0 };
    const { addOrder } = useContext(OrderContext);

    console.log(location.state);
    console.log(orderItems);

    const handlePayment = async () => {
        const order = {
            orderItems,
            totalAmount: totalPrice.toFixed(2),
            paymentMethod,
            status: 'Completed', // or any other status you want to set
            orderDate: new Date(),
            // Add other fields as needed
        };
        console.log(order);
        try {
            await addOrder(order);
            // Redirect to new order page after payment
            navigate('/orders/new');
            
        } catch (error) {
            console.error('Error completing the order:', error);
            // Handle error appropriately
        }
    };

    return (
        <div>
            <h2>Payment</h2>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <div>
                <h3>Order Summary</h3>
                <ul>
                    {orderItems.map(item => (
                        <li key={item.productId}>
                            {item.productName}: {item.quantity} x ${item.productPrice.toFixed(2)} = ${(item.quantity * item.productPrice).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Choose Payment Method</h3>
                <label>
                    <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash
                </label>
                <label>
                    <input
                        type="radio"
                        value="creditCard"
                        checked={paymentMethod === 'creditCard'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Credit Card
                </label>
                <label>
                    <input
                        type="radio"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    PayPal
                </label>
            </div>
            <button onClick={handlePayment}>Complete Payment</button>
        </div>
    );
};

export default PaymentPage;
