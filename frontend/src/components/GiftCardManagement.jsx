import React, { useState } from "react";
import axios from 'axios';
import './GiftCardManagement.css'; // Import the CSS file for styling

const GiftCardManagement = () => {
    const [code, setCode] = useState('');
    const [balance, setBalance] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [message, setMessage] = useState('');
    const [activeFeature, setActiveFeature] = useState(null);
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [rechargeAmount, setRechargeAmount] = useState(0);


    const createGiftCard = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/giftcards', { code, balance, isActive });
            console.log('Gift card created', response.data);
            setMessage('Gift card created successfully.');
            setShowConfirmButton(true);
        } catch (error) {
            console.log('Error creating gift card:', error);
            setMessage('Error creating gift card.');
        }
    };

    const checkGiftCardBalance = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/giftcards/${code}`);
            setBalance(response.data.balance);
            setIsActive(response.data.isActive);
            setMessage(`Gift card balance is $${response.data.balance}`);
            setShowConfirmButton(true);
        } catch (error) {
            console.log('Error checking gift card balance:', error);
            setMessage('Error checking gift card balance.');
        }
    };

    const rechargeGiftCard = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/giftcards`, { code, balance: balance + rechargeAmount });
            setBalance(response.data.balance);
            setMessage('Gift card recharged successfully.');
            setShowConfirmButton(true);
        } catch (error) {
            console.log('Error recharging gift card:', error);
            setMessage('Error recharging gift card.');
        }
    };
    

    const toggleGiftCardActivation = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/giftcards`, { code, isActive: !isActive });
            setIsActive(response.data.isActive);
            setMessage(`Gift card ${response.data.isActive ? 'activated' : 'deactivated'} successfully.`);
            setShowConfirmButton(true);
        } catch (error) {
            console.log('Error toggling gift card activation:', error);
            setMessage('Error toggling gift card activation.');
        }
    };

    const handleConfirm = () => {
        setMessage('All operations completed successfully.');
        setShowConfirmButton(false);
        setActiveFeature(null); // Reset active feature
    };

    return (
        <div className="gift-card-management">
            <h2>Gift Card Management</h2>

            <button onClick={() => setActiveFeature(activeFeature === 'create' ? null : 'create')} disabled={activeFeature && activeFeature !== 'create'}>
                {activeFeature === 'create' ? 'Gift Card Code' : 'New Gift Card'}
            </button>
            {activeFeature === 'create' && (
                <div className="form-group">
                    <label htmlFor="code">Gift Card Code:</label>
                    <input
                        id="code"
                        type="text"
                        placeholder="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <label htmlFor="balance">Initial Balance:</label>
                    <input
                        id="balance"
                        type='number'
                        placeholder="Balance"
                        value={balance}
                        onChange={(e) => setBalance(parseFloat(e.target.value))}
                    />
                    <button onClick={createGiftCard}>Create Gift Card</button>
                </div>
            )}

            <button onClick={() => setActiveFeature(activeFeature === 'balance' ? null : 'balance')} disabled={activeFeature && activeFeature !== 'balance'}>
                {activeFeature === 'balance' ? 'Enter Gift Card Code' : 'Check Gift Card Balance'}
            </button>
            {activeFeature === 'balance' && (
                <div className="form-group">
                    <label htmlFor="code">Gift Card Code:</label>
                    <input
                        id="code"
                        type="text"
                        placeholder="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={checkGiftCardBalance}>Check Balance</button>
                </div>
            )}

            <button onClick={() => setActiveFeature(activeFeature === 'recharge' ? null : 'recharge')} disabled={activeFeature && activeFeature !== 'recharge'}>
                {activeFeature === 'recharge' ? 'Hide Recharge Form' : 'Show Recharge Form'}
            </button>
            {activeFeature === 'recharge' && (
                <div className="form-group">
                    <label htmlFor="rechargeCode">Gift Card Code:</label>
                    <input
                        id="rechargeCode"
                        type="text"
                        placeholder="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <label htmlFor="rechargeAmount">Recharge Amount:</label>
    <input
        id="rechargeAmount"
        type='number'
        placeholder="Recharge Amount"
        value={rechargeAmount}
        onChange={(e) => setRechargeAmount(parseFloat(e.target.value))}
    />
    <button onClick={rechargeGiftCard}>Recharge Gift Card</button>
                </div>
            )}

            <button onClick={() => setActiveFeature(activeFeature === 'activation' ? null : 'activation')} disabled={activeFeature && activeFeature !== 'activation'}>
                {activeFeature === 'activation' ? 'Hide Activation/Deactivation Form' : 'Show Activation/Deactivation Form'}
            </button>
            {activeFeature === 'activation' && (
                <div className="form-group">
                    <label htmlFor="activationCode">Gift Card Code:</label>
                    <input
                        id="activationCode"
                        type="text"
                        placeholder="Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button onClick={toggleGiftCardActivation}>
                        {isActive ? 'Deactivate' : 'Activate'} Gift Card
                    </button>
                </div>
            )}

            {showConfirmButton && (
                <button className="confirm-button" onClick={handleConfirm}>Confirm</button>
            )}

            <p>{message}</p>
        </div>
    );
};

export default GiftCardManagement;
