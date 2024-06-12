import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import axios from 'axios';

const PaymentPage = () => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [giftCardCode, setGiftCardCode] = useState('');
    const [giftCardBalance, setGiftCardBalance] = useState(0);
    const [additionalPaymentMethod, setAdditionalPaymentMethod] = useState('');
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [cashReceived, setCashReceived] = useState(''); // Initialize as an empty string
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null); // State to store order summary
    const [change, setChange] = useState(0); // State to store change amount
    const navigate = useNavigate();
    const location = useLocation();
    const { orderItems, totalPrice, customerInfo } = location.state || { orderItems: [], totalPrice: 0, customerInfo: {} };
    const { addOrder } = useContext(OrderContext);

    const handleGiftCardCheck = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/giftcards/${giftCardCode}`);
            setGiftCardBalance(response.data.balance);
        } catch (error) {
            console.error('Error checking gift card', error);
            setError('Error checking gift card balance.');
        }
    };

    const handlePayment = async () => {
        let remainingAmount = totalPrice;
        let paymentMethods = {};

        if (!paymentMethod) {
            alert('Please choose a payment method.');
            return;
        }

        if (paymentMethod === 'Gift Card') {
            if (giftCardBalance >= totalPrice) {
                remainingAmount = 0;
                paymentMethods['Gift Card'] = totalPrice;
                await axios.put('http://localhost:8080/api/giftcards', {
                    code: giftCardCode,
                    balance: giftCardBalance - totalPrice,
                    isActive: true,
                });
            } else {
                remainingAmount = totalPrice - giftCardBalance;
                paymentMethods['Gift Card'] = giftCardBalance;
                await axios.put('http://localhost:8080/api/giftcards', {
                    code: giftCardCode,
                    balance: 0,
                    isActive: true,
                });
                setRemainingAmount(remainingAmount);
                if (!additionalPaymentMethod) {
                    alert(`Insufficient gift card balance. Please choose an additional payment method to cover the remaining amount of $${remainingAmount.toFixed(2)}.`);
                    return;
                }

                if (remainingAmount > 0) {
                    paymentMethods[additionalPaymentMethod] = remainingAmount;
                }
            }
        } else if (paymentMethod === 'Cash') {
            const cashAmount = parseFloat(cashReceived);
            if (isNaN(cashAmount) || cashAmount < totalPrice) {
                alert(`Insufficient cash provided. Please provide at least $${totalPrice.toFixed(2)}.`);
                return;
            } else {
                setChange(cashAmount - totalPrice);
                paymentMethods['Cash'] = totalPrice;
            }
        } else {
            paymentMethods[paymentMethod] = totalPrice;
        }

        const order = {
            customer: customerInfo,
            orderItems,
            totalAmount: totalPrice.toFixed(2),
            paymentMethods: paymentMethods,
            status: 'Completed',
            orderDate: new Date().toISOString(),
        };

        try {
            const newOrder = await addOrder(order);
            console.log('Order successfully created:', newOrder); // Debugging line
            setOrderSummary(newOrder); // Store order summary
            setShowPopup(true); // Show the popup
            setTimeout(() => {
                setShowPopup(false);
                navigate('/orders/new'); // Redirect to new order page after 5 seconds
            }, 5000);
        } catch (error) {
            console.error('Error completing the order:', error);
            setError('Error completing the order.');
        }
    };

    const handleCashReceivedChange = (e) => {
        const value = e.target.value;
        setCashReceived(value);

        // Calculate the change if the payment method is cash
        if (paymentMethod === 'Cash') {
            const cashAmount = parseFloat(value);
            if (!isNaN(cashAmount)) {
                setChange(cashAmount - totalPrice);
            } else {
                setChange(0);
            }
        }
    };

    return (
        <div>
            <h2>Payment</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
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
                <h3>Customer Information</h3>
                <p>Name: {customerInfo.name}</p>
                <p>Email: {customerInfo.email}</p>
                <p>Phone: {customerInfo.phone}</p>
                <p>Address: {customerInfo.address}</p>
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
                        value="Gift Card"
                        checked={paymentMethod === 'Gift Card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Gift Card
                </label>
                {paymentMethod === 'Gift Card' && (
                    <div>
                        <input
                            type="text"
                            placeholder="Gift Card Code"
                            value={giftCardCode}
                            onChange={(e) => setGiftCardCode(e.target.value)}
                        />
                        <button onClick={handleGiftCardCheck}>Check Gift Card Balance</button>
                        <p>Gift Card Balance: ${giftCardBalance.toFixed(2)}</p>
                    </div>
                )}
                {remainingAmount > 0 && (
                    <div>
                        <p>Remaining Amount: ${remainingAmount.toFixed(2)}</p>
                        <label>
                            <input
                                type="radio"
                                value="Cash"
                                checked={additionalPaymentMethod === 'Cash'}
                                onChange={(e) => setAdditionalPaymentMethod(e.target.value)}
                            />
                            Cash
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Credit Card"
                                checked={additionalPaymentMethod === 'Credit Card'}
                                onChange={(e) => setAdditionalPaymentMethod(e.target.value)}
                            />
                            Credit Card
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="PayPal"
                                checked={additionalPaymentMethod === 'PayPal'}
                                onChange={(e) => setAdditionalPaymentMethod(e.target.value)}
                            />
                            PayPal
                        </label>
                    </div>
                )}
                {paymentMethod === 'Cash' && (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>$</span>
                        <input
                            type="number"
                            placeholder="Cash Received"
                            value={cashReceived}
                            onChange={handleCashReceivedChange}
                            style={{ marginLeft: '5px' }}
                        />
                        {change >= 0 && (
                            <p>Change: ${change.toFixed(2)}</p>
                        )}
                    </div>
                )}
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

            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white',
                    padding: '20px',
                    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
                    zIndex: 1000
                }}>
                    <p>Payment Successful!</p>
                    {orderSummary && (
                        <div>
                            <p>Order ID: {orderSummary.id}</p>
                            <p>Total Amount: ${orderSummary.totalAmount}</p>
                            <p>Payment Methods: {Object.entries(orderSummary.paymentMethods).map(([method, amount]) => (
                                <span key={method}>{method}: ${amount.toFixed(2)} </span>
                            ))}</p>
                            {paymentMethod === 'Cash' && <p>Change: ${change.toFixed(2)}</p>}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
