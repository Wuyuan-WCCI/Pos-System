import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { OrderContext } from '../context/OrderContext';
import './PaymentPage.css'; // Import custom styles

const PaymentPage = () => {
    const { orderId } = useParams(); // Get the orderId from the URL params
    const [error, setError] = useState(''); // State to hold any error message
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [giftCardCode, setGiftCardCode] = useState('');
    const [giftCardBalance, setGiftCardBalance] = useState(0);
    const [additionalPaymentMethod, setAdditionalPaymentMethod] = useState('');
    const [remainingAmount, setRemainingAmount] = useState(0);
    const [cashReceived, setCashReceived] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [orderSummary, setOrderSummary] = useState(null);
    const [change, setChange] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const { order, fetchOrder, updateOrder } = useContext(OrderContext); // Get the fetchOrder and updateOrder functions from context
    const orderItems = order?.orderItems || [];
    const totalPrice = order?.totalAmount || 0;
    const customerInfo = location?.state?.customerInfo || null ;

    useEffect(() => {
        // Fetch order details when the component mounts
        const fetchOrderDetails = async () => {
            try {
                await fetchOrder(orderId);
                setLoading(false);
            } catch (error) {
                setError('Error fetching order details.');
                console.error('Error fetching order details:', error);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [fetchOrder, orderId]);

    const handleGiftCardCheck = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8080/api/giftcards/${giftCardCode}`);
            setGiftCardBalance(response.data.balance);
        } catch (error) {
            console.error('Error checking gift card balance:', error);
            setError('Error checking gift card balance.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        let remainingAmount = totalPrice;
        let paymentMethods = {};

        if (!paymentMethod) {
            alert('Please choose a payment method.');
            return;
        }

        try {
            if (paymentMethod === 'Gift Card') {
                if (giftCardBalance >= totalPrice) {
                    remainingAmount = 0;
                    paymentMethods['Gift Card'] = totalPrice;
                    await axios.put(`http://localhost:8080/api/giftcards`, {
                        code: giftCardCode,
                        balance: giftCardBalance - totalPrice,
                        isActive: true,
                    });
                } else {
                    remainingAmount = totalPrice - giftCardBalance;
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

            const orderSummaryData = {
                customer: customerInfo,
                orderItems,
                totalAmount: totalPrice.toFixed(2),
                paymentMethods: paymentMethods,
                status: 'Completed',
                orderDate: new Date().toISOString(),
            };

            await updateOrder(orderId, {
                ...orderSummaryData,
                paymentMethods: paymentMethods,
                status: 'Completed'
            });

            // Update product quantities in stock
            // Assuming each order item has a product.id and quantity, update the stock
            for (const item of orderItems) {
                const productId = item.product.id;
                const newQuantityInStock = item.product.quantityInStock - item.quantity;
                await axios.put(`http://localhost:8080/api/products/${productId}`, {
                    quantityInStock: newQuantityInStock
                });
            }

            setOrderSummary(orderSummaryData);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                navigate('/orders/new');
            }, 3000);
        } catch (error) {
            console.error('Error completing payment:', error);
            alert('Error completing payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCashReceivedChange = (e) => {
        const value = e.target.value;
        setCashReceived(value);

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
        <div className="payment-container">
            <h2 className="payment-title">Payment</h2>
            {error && <p className="error-message">{error}</p>}
            {orderSummary && (
                <div className="payment-success">
                    <p>Payment Successful!</p>
                    <div>
                        <p>Order ID: {orderId}</p>
                        <p>Total Amount: ${orderSummary.totalAmount}</p>
                        <p>Payment Methods: {Object.entries(orderSummary.paymentMethods).map(([method, amount]) => (
                            <span key={method}>{method}: ${amount.toFixed(2)} </span>
                        ))}</p>
                        {paymentMethod === 'Cash' && <p>Change: ${change.toFixed(2)}</p>}
                    </div>
                </div>
            )}
            <div className="total-price">
                <h3>Total Price</h3>
                <p>${totalPrice.toFixed(2)}</p>
            </div>
            <div className="order-summary">
                <h3>Order Summary</h3>
                <ul>
                    {orderItems.map(item => (
                        <li key={item.product.id}>
                            {item.product.name}: {item.quantity} x ${item.product.price.toFixed(2)} = ${(item.quantity * item.product.price).toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="payment-methods">
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
                    <div className="cash-received">
                        <h3>Cash Received</h3>
                        <input
                            type="number"
                            placeholder="Cash Received"
                            value={cashReceived}
                            onChange={handleCashReceivedChange}
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
            <div className="complete-payment">
                <button onClick={handlePayment} disabled={loading}>
                    {loading ? 'Processing...' : 'Complete Payment'}
                </button>
            </div>

            {showPopup && (
                <div className="payment-success">
                    <p>Payment Successful!</p>
                    <div>
                        <p>Order ID: {orderId}</p>
                        <p>Total Amount: ${orderSummary.totalAmount}</p>
                        <p>Payment Methods: {Object.entries(orderSummary.paymentMethods).map(([method, amount]) => (
                            <span key={method}>{method}: ${amount.toFixed(2)} </span>
                        ))}</p>
                        {paymentMethod === 'Cash' && <p>Change: ${change.toFixed(2)}</p>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentPage;
