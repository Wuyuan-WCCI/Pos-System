import React, { useContext, useEffect } from 'react';
import { OrderContext } from '../context/OrderContext';

const OrderList = () => {
    const { orders, fetchOrders } = useContext(OrderContext);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div>
            <h2>Order List</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        {order.customer?.name} - {order.orderDate} - {order.status} - ${order.totalAmount} -{order.paymentMethod}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderList;
