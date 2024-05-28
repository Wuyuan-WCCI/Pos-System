import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
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
import { OrderItemProvider } from './context/OrderItemContext';
import OrderItemsPage from './components/OrderItemsPage';


const App = () => {
    return (
        <Router>
            <CustomerProvider>
                <ProductProvider>
                    <OrderProvider>
                        <Navbar />
                        <Routes>
                            <Route path="/customers" element={<CustomerList />} />
                            <Route path="/customers/new" element={<CustomerForm />} />
                            <Route path="/products" element={<ProductList />} />
                            <Route path="/products/new" element={<ProductForm />} />
                            <Route path="/orders" element={<OrderList />} />
                            <Route path="/orders/new" element={<OrderForm />} />
                            <Route path="/payment" element={<PaymentPage />} />
                            <Route path='/orders/:orderId/items' element = {<OrderItemsPage/>}/>
                        </Routes>
                    </OrderProvider>
                </ProductProvider>
            </CustomerProvider>
        </Router>
    );
};

export default App;
