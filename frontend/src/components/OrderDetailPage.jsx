import React, { useContext, useState, useEffect, useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext'; // Update the path accordingly
import './OrderDetailPage.css'; // Import the CSS file for styling
import PrintReceipt from './PrintReceipt';

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const { order, fetchOrder } = useContext(OrderContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    const printRef = useRef();

    useEffect(() => {
        fetchOrder(orderId)
            .then(() => setLoading(false))
            .catch((error) => {
                setError('Error fetching order details.');
                console.error('Error fetching order details:', error);
                setLoading(false);
            });
    }, [fetchOrder, orderId]);

    useEffect(() => {
        if (redirect) {
            navigate(`/payment/${orderId}`);
        }
    }, [redirect, navigate, orderId]);

    const handleCheckout = () => {
        setRedirect(true);
    };

    const handlePrint = () => {
        if (printRef.current) {
            printRef.current.handlePrint();
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="order-detail-container">
            <h2>Order Details</h2>
            {order && (
                <div className="order-details">
                    <div className="order-info card">
                        <p><strong>Order ID:</strong> {order.id}</p>
                        <p><strong>Customer:</strong> {order.customerName}</p>
                        <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                    <div className="order-items card">
                        <h3>Order Items</h3>
                        <div className="order-items-header">
                            <span><strong>Product</strong></span>
                            <span><strong>Unit Price</strong></span>
                            <span><strong>Quantity</strong></span>
                            <span><strong>Total Price</strong></span>
                        </div>
                        <ul>
                            {order.orderItems.map((item) => (
                                <li key={item.id} className="order-item">
                                    <span>{item.product.name}</span>
                                    <span>${item.product.price}</span>
                                    <span>{item.quantity}</span>
                                    <span>${(item.quantity * item.product.price).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="payment-methods card">
                        <h3>Payment Methods</h3>
                        <ul>
                            {Object.entries(order.paymentMethods).map(([method, amount]) => (
                                <li key={method}>
                                    <p><strong>{method}:</strong> ${amount}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {order.status === 'Pending' && (
                        <button className="checkout-button" onClick={handleCheckout}>CheckOut</button>
                    )}

                   <button className="print-button" onClick={handlePrint}>Print Receipt</button>
                   <div style={{ display: 'none' }}>
                        <PrintReceipt ref={printRef} order={order} customer={order.customerName} />
                    </div> 
                </div>
            )}
        </div>
    );
};

export default OrderDetailPage;
