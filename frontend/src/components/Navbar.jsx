import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 


const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container">
                <Link className="navbar-brand" to="/">Retail POS System</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/orders/new">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/customers">Customers</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/products">Products</Link>
                        </li>
                    
                        <li className="nav-item">
                            <Link className="nav-link" to="/sales-history">Sales History</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/giftcards">Gift Card</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/orders/new">New Order</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/expenses">Expenses</a>
                        </li>
                       
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
