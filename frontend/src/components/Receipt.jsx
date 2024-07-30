import React, { forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Receipt = forwardRef((props, ref) => {
    const { order, customer } = props;
    const storeInfo = {
        name: "MetLucky Salon",
        address: "3359 Friendship St FL 1\n Philadelphia PA, 19149",
        phone: "(347)-759-3359"
    };

    useEffect(() => {
        console.log('Receipt order items:', order?.orderItems); // Using optional chaining to safely access orderItems
    }, [order]);

    return (
        <div ref={ref} className="receipt">
            <br />
            <br />
            <h2>{storeInfo.name}</h2>
            <p>{storeInfo.address}</p>
            <p>{storeInfo.phone}</p>
            <hr />
            <h3>Order Summary</h3>
            <p>Order ID: {order?.id}</p> {/* Using optional chaining to safely access properties */}
            <p>Order Date: {new Date(order?.orderDate).toLocaleString()}</p>
            <h4>Customer Information</h4>
            <p>Name: {order.customerName}</p> {/* Using optional chaining to safely access properties */}
            <p>Phone: {customer?.phone}</p>
            
            <hr />
            <h4>Order Items</h4>
            <ul>
                {order?.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.map(item => (
                        <li key={item.product.id}>
                            {item.product.name} - {item.quantity} x ${item.product.price.toFixed(2)}
                        </li>
                    ))
                ) : (
                    <p>No items in this order.</p>
                )}
            </ul>
            <h4>Total Amount: ${order?.totalAmount.toFixed(2)}</h4> {/* Using optional chaining to safely access totalAmount */}
        </div>
    );
});

Receipt.displayName = 'Receipt';

Receipt.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        orderDate: PropTypes.string.isRequired,
        customerName: PropTypes.string.isRequired,
        orderItems: PropTypes.arrayOf(PropTypes.shape({
            product: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
            }).isRequired,
            quantity: PropTypes.number.isRequired,
        })),
        totalAmount: PropTypes.number.isRequired,
    }).isRequired,
    customer: PropTypes.shape({
        
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
    }).isRequired,
};

export default Receipt;
