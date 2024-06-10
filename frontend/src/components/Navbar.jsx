import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/customers">Customers</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/orders">Orders</Link></li>
                <li><Link to="/sales-history">Sales History</Link></li>
                <li><Link to="/giftcards">Gift Card</Link></li>
                <li><Link to="/orders/new">New Order</Link></li>


            </ul>
        </nav>
    );
};

export default Navbar;
