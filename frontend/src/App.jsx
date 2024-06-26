// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import { CustomerProvider } from './context/CustomerContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import PaymentPage from './components/PaymentPage';
import OrderItemsPage from './components/OrderItemsPage';
import SalesHistoryPage from './components/SalesHistoryPage';
import GiftCardManagement from './components/GiftCardManagement';
import CustomerDetails from './components/CustomerDetails';
import OrderDetailPage from './components/OrderDetailPage';

import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import './style.css';

Modal.setAppElement('#root');

const App = () => {
    return (
        <Router>
            <div className="background">
                <CustomerProvider>
                    <ProductProvider>
                        <OrderProvider>
                            <Navbar />
                            <div className="container-content">
                                <Routes>
                                    <Route path="/customers" element={<CustomerList />} />
                                    <Route path="/customers/new" element={<CustomerForm />} />
                                    <Route path="/products" element={<ProductList />} />
                                    <Route path="/products/new" element={<ProductForm />} />
                                    <Route path="/orders" element={<OrderList />} />
                                    <Route path="/orders/new" element={<OrderForm />} />
                                    <Route path="/payment/:orderId" element={<PaymentPage />} />
                                    <Route path='/orders/:orderId' element={<OrderDetailPage />} />
                                    <Route path='/orders/:orderId/items' element={<OrderItemsPage />} />
                                    <Route path="/sales-history" element={<SalesHistoryPage />} />
                                    <Route path="/giftcards" element={<GiftCardManagement />} />
                                    <Route path="/customers/:customerId" element={<CustomerDetails />} />
                                    <Route path="/expenses" element={<ExpenseList />} />
                                    <Route path="/expenses/new" element={<ExpenseForm />} />
                                    <Route path="/expenses/:id" element={<ExpenseForm />} />
                                </Routes>
                            </div>
                            <Footer />
                        </OrderProvider>
                    </ProductProvider>
                </CustomerProvider>
            </div>
        </Router>
    );
};

export default App;
