import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { orderItems, totalPrice } = location.state || { orderItems: [], totalPrice: 0 };
    const { addOrder } = useContext(OrderContext);

    const handlePayment = async () => {
        const order = {
            orderItems,
            totalAmount: totalPrice,
            paymentMethod,
            status: 'Completed',
            orderDate: new Date().toISOString(),
        };

        try {
            await addOrder(order);
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
                        <li key={item.product.id}>
                            {item.product.name}: {item.quantity} x ${item.product.price.toFixed(2)} = ${(item.quantity * item.product.price).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Choose Payment Method</h3>
                <label>
                    <input
                        type="radio"
                        value="Cash"
                        checked={paymentMethod === 'Cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash
                </label>
                <label>
                    <input
                        type="radio"
                        value="Credit Card"
                        checked={paymentMethod === 'Credit Card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Credit Card
                </label>
                <label>
                    <input
                        type="radio"
                        value="PayPal"
                        checked={paymentMethod === 'PayPal'}
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
