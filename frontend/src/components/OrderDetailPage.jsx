import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext'; // Update the path accordingly

const OrderDetailPage = () => {
    const { orderId } = useParams(); // Get the orderId from the URL
    const { order, fetchOrder } = useContext(OrderContext); // Get the order and fetchOrder function from the context
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch order details when the component mounts
        fetchOrder(orderId)
            .then(() => setLoading(false))
            .catch((error) => {
                setError('Error fetching order details.');
                console.error('Error fetching order details:', error);
                setLoading(false);
            });
    }, [fetchOrder, orderId]);

    // Redirect to PaymentPage when redirect state is true
    useEffect(() => {
        if (redirect) {
            navigate(`/payment/${orderId}`);
        }
    }, [redirect, navigate, orderId]);

    // Handle checkout button click
    const handleCheckout = () => {
        setRedirect(true);
    };

    // Render loading state while fetching order details
    if (loading) {
        return <div>Loading...</div>;
    }

    // Render error message if there was an error fetching order details
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Render order details once fetched
    return (
        <div>
            <h2>Order Details</h2>
            {order && (
                <div>
                    <p>Order ID: {order.id}</p>
                    <p>Total Amount: ${order.totalAmount}</p>
                    <p>Status: {order.status}</p>
                    <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
                    <h3>Order Items:</h3>
                    <ul>
                        {order.orderItems.map((item) => (
                            <li key={item.id}>
                                <p>Product: {item.product.name}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.product.price}</p>
                                {/* Render other item details as needed */}
                            </li>
                        ))}
                    </ul>
                    <h3>Payment Method:</h3>
                    <ul>
                        {Object.entries(order.paymentMethods).map(([method, amount]) => (
                            <li key={method}>
                                <p>{method}: ${amount}</p>
                            </li>
                        ))}
                    </ul>
                    {/* Render other order details as needed */}
                    {order.status === 'Pending' && (
                        <button onClick={handleCheckout}>CheckOut</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrderDetailPage;
