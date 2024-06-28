import React, { useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './GiftCardManagement.css';

const GiftCardManagement = () => {
    const [formData, setFormData] = useState({
        code: '',
        balance: 0,
        isActive: true,
        rechargeAmount: 0,
    });
    const [message, setMessage] = useState('');
    const [activeFeature, setActiveFeature] = useState(null);
    const [showConfirmButton, setShowConfirmButton] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'balance' || name === 'rechargeAmount' ? parseFloat(value) : value });
    };

    const handleAction = async (action) => {
        try {
            let response;
            switch (action) {
                case 'create':
                    if (!formData.code) {
                        alert('Gift card code cannot be empty.');
                        return;
                    }
                    response = await axios.post('http://localhost:8080/api/giftcards', formData);
                    setMessage('Gift card created successfully.');
                    break;
                case 'balance':
                    response = await axios.get(`http://localhost:8080/api/giftcards/${formData.code}`);
                    setFormData({ ...formData, balance: response.data.balance, isActive: response.data.isActive });
                    setMessage(`Gift card balance is $${response.data.balance}`);
                    break;
                case 'recharge':
                    response = await axios.put(`http://localhost:8080/api/giftcards`, { code: formData.code, balance: formData.balance + formData.rechargeAmount });
                    setFormData({ ...formData, balance: response.data.balance });
                    setMessage('Gift card recharged successfully.');
                    break;
                case 'activation':
                    response = await axios.put(`http://localhost:8080/api/giftcards`, { code: formData.code, isActive: !formData.isActive });
                    setFormData({ ...formData, isActive: response.data.isActive });
                    setMessage(`Gift card ${response.data.isActive ? 'activated' : 'deactivated'} successfully.`);
                    break;
                default:
                    setMessage('Unknown action.');
            }
            setShowConfirmButton(true);
        } catch (error) {
            console.log(`Error performing ${action}:`, error);
            if (error.response && error.response.status === 409) {
                alert(`Gift card with code ${formData.code} already exists.`);
            } else {
                alert(`Error performing ${action}. Please try again later.`);
            }
        }
    };

    const handleConfirm = () => {
        setMessage('All operations completed successfully.');
        setShowConfirmButton(false);
        setActiveFeature(null);
    };

    return (
        <div className="container mt-5">
            <header className="mb-4">
                <h1 className="text-center">Gift Card Management</h1>
            </header>
            <nav className="nav nav-pills nav-fill mb-4">
                <button className={`nav-item nav-link ${activeFeature === 'create' ? 'active' : ''}`} onClick={() => setActiveFeature('create')}><h3>Create Gift </h3></button>
                <button className={`nav-item nav-link ${activeFeature === 'balance' ? 'active' : ''}`} onClick={() => setActiveFeature('balance')}><h3>Check Balance</h3></button>
                <button className={`nav-item nav-link ${activeFeature === 'recharge' ? 'active' : ''}`} onClick={() => setActiveFeature('recharge')}><h3>Recharge Card</h3></button>
                <button className={`nav-item nav-link ${activeFeature === 'activation' ? 'active' : ''}`} onClick={() => setActiveFeature('activation')}><h3>Activate/Deactivate</h3></button>
            </nav>
            <div className="row">
                {activeFeature === 'create' && (
                    <div className="col-md-6 offset-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Create New Gift Card</h5>
                                <div className="form-group">
                                    <label htmlFor="createCode">Gift Card Code:</label>
                                    <input
                                        id="createCode"
                                        name="code"
                                        type="text"
                                        className="form-control"
                                        placeholder="Code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="createBalance">Initial Balance:</label>
                                    <input
                                        id="createBalance"
                                        name="balance"
                                        type="number"
                                        className="form-control"
                                        placeholder="Balance"
                                        value={formData.balance}
                                        onChange={handleInputChange}
                                    />
                                    <button className="btn btn-primary mt-3" onClick={() => handleAction('create')}>Create Gift Card</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeFeature === 'balance' && (
                    <div className="col-md-6 offset-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Check Gift Card Balance</h5>
                                <div className="form-group">
                                    <label htmlFor="balanceCode">Gift Card Code:</label>
                                    <input
                                        id="balanceCode"
                                        name="code"
                                        type="text"
                                        className="form-control"
                                        placeholder="Code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                    <button className="btn btn-secondary mt-3" onClick={() => handleAction('balance')}>Check Balance</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeFeature === 'recharge' && (
                    <div className="col-md-6 offset-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Recharge Gift Card</h5>
                                <div className="form-group">
                                    <label htmlFor="rechargeCode">Gift Card Code:</label>
                                    <input
                                        id="rechargeCode"
                                        name="code"
                                        type="text"
                                        className="form-control"
                                        placeholder="Code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="rechargeAmount">Recharge Amount:</label>
                                    <input
                                        id="rechargeAmount"
                                        name="rechargeAmount"
                                        type="number"
                                        className="form-control"
                                        placeholder="Recharge Amount"
                                        value={formData.rechargeAmount}
                                        onChange={handleInputChange}
                                    />
                                    <button className="btn btn-success mt-3" onClick={() => handleAction('recharge')}>Recharge Gift Card</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeFeature === 'activation' && (
                    <div className="col-md-6 offset-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Activate/Deactivate Gift Card</h5>
                                <div className="form-group">
                                    <label htmlFor="activationCode">Gift Card Code:</label>
                                    <input
                                        id="activationCode"
                                        name="code"
                                        type="text"
                                        className="form-control"
                                        placeholder="Code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                    />
                                    <button className={`btn btn-${formData.isActive ? 'warning' : 'info'} mt-3`} onClick={() => handleAction('activation')}>
                                        {formData.isActive ? 'Deactivate' : 'Activate'} Gift Card
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {showConfirmButton && (
                <div className="modal fade show" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmation</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleConfirm}></button>
                            </div>
                            <div className="modal-body">
                                <p>{message}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-info" onClick={handleConfirm}>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GiftCardManagement;
