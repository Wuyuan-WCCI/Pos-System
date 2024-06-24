import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { OrderContext } from '../context/OrderContext';


const PaymentPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { updateOrder } = useContext(OrderContext);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [giftCardCode, setGiftCardCode] = useState('');
    const [giftCardBalance, setGiftCardBalance] = useState(0);
    const [additionalPaymentMethod, setAdditionalPaymentMethod] = useState('');
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [cashReceived, setCashReceived] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null);
    const [change, setChange] = useState(0);
    const [loadingPayment, setLoadingPayment] = useState(false);

    const handleGiftCardCheck = async () => {
        setLoadingPayment(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/giftcards/${giftCardCode}`);
            setGiftCardBalance(response.data.balance);
        } catch (err) {
            console.error('Error checking gift card balance:', err);
        } finally {
            setLoadingPayment(false);
        }
    };

    const handlePayment = async () => {
        if (!order) return;

        let remainingAmount = order.totalAmount;
        let paymentMethods = {};

        if (!paymentMethod) {
            alert('Please choose a payment method.');
            return;
        }

        setLoadingPayment(true);
        try {
            if (paymentMethod === 'Gift Card') {
                if (giftCardBalance >= order.totalAmount) {
                    remainingAmount = 0;
                    paymentMethods['Gift Card'] = order.totalAmount;
                    await axios.put(`http://localhost:8080/api/giftcards`, {
                        code: giftCardCode,
                        balance: giftCardBalance - order.totalAmount,
                        isActive: true,
                    });
                } else {
                    remainingAmount = order.totalAmount - giftCardBalance;
                    paymentMethods['Gift Card'] = giftCardBalance;
                    await axios.put(`http://localhost:8080/api/giftcards`, {
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
                if (isNaN(cashAmount) || cashAmount < order.totalAmount) {
                    alert(`Insufficient cash provided. Please provide at least $${order.totalAmount.toFixed(2)}.`);
                    return;
                } else {
                    setChange(cashAmount - order.totalAmount);
                    paymentMethods['Cash'] = order.totalAmount;
                }
            } else {
                paymentMethods[paymentMethod] = order.totalAmount;
            }

            const orderSummaryData = {
                customer: order.customer,
                orderItems: order.orderItems,
                totalAmount: order.totalAmount.toFixed(2),
                paymentMethods: paymentMethods,
                status: 'Completed',
                orderDate: new Date().toISOString(),
            };

            await updateOrder(orderId, {
                ...orderSummaryData,
                paymentMethods: paymentMethods,
                status: 'Completed'
            });

            setOrderSummary(orderSummaryData);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate('/orders/new');
            }, 3000);
        } catch (err) {
            console.error('Error completing payment:', err);
            alert('Error completing payment. Please try again.');
        } finally {
            setLoadingPayment(false);
        }
    };

    const handleCashReceivedChange = (e) => {
        const value = e.target.value;
        setCashReceived(value);

        if (paymentMethod === 'Cash') {
            const cashAmount = parseFloat(value);
            if (!isNaN(cashAmount)) {
                setChange(cashAmount - (order ? order.totalAmount : 0));
            } else {
                setChange(0);
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!order) {
        return <div>No order found.</div>;
    }

    return (
        <div>
            <h2>Payment</h2>
            {orderSummary && (
                <div>
                    <p>Order ID: {orderId}</p>
                    <p>Total Amount: ${orderSummary.totalAmount}</p>
                    <p>Payment Methods: {Object.entries(orderSummary.paymentMethods).map(([method, amount]) => (
                        <span key={method}>{method}: ${amount.toFixed(2)} </span>
                    ))}</p>
                    {paymentMethod === 'Cash' && <p>Change: ${change.toFixed(2)}</p>}
                </div>
            )}
            <p>Total Price: ${order.totalAmount}</p>
            <div>
                <h3>Order Summary</h3>
                <ul>
                    {order.orderItems.map(item => (
                        <li key={item.product.id}>
                            {item.product.name}: {item.quantity} x ${item.product.price.toFixed(2)} = ${(item.quantity * item.product.price).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Customer Information</h3>
                <p>Name: {order.customer.name}</p>
                <p>Email: {order.customer.email}</p>
                <p>Phone: {order.customer.phone}</p>
                <p>Address: {order.customer.address}</p>
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
            <button onClick={handlePayment} disabled={loadingPayment}>
                {loadingPayment ? 'Processing...' : 'Complete Payment'}
            </button>

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
                            <p>Order ID: {orderId}</p>
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
