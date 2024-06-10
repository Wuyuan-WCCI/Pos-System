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
    const navigate = useNavigate();
    const location = useLocation();
    const { orderItems, totalPrice } = location.state || { orderItems: [], totalPrice: 0 };
    const { addOrder } = useContext(OrderContext);

    const handleGiftCardCheck = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/giftcards/${giftCardCode}`);
            setGiftCardBalance(response.data.balance);
        } catch (error) {
            console.error('Error checking gift card', error);
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
        }
        

        if (paymentMethod === 'Cash' || paymentMethod === 'PayPal' || paymentMethod === 'Credit Card') {
            paymentMethods[paymentMethod] = totalPrice;
        }


        const order = {
            orderItems,
            totalAmount: totalPrice.toFixed(2),
            paymentMethods: paymentMethods,
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
