import React, { useContext, useEffect, useState } from 'react';
import { OrderContext } from '../context/OrderContext';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const OrderList = () => {
    const { orders, fetchOrders } = useContext(OrderContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const ordersPerPage = 15;

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const filteredOrders = orders.filter(order =>
        order.id && order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const offset = currentPage * ordersPerPage;
    const currentOrders = filteredOrders.slice(offset, offset + ordersPerPage);
    const pageCount = Math.ceil(filteredOrders.length / ordersPerPage);

    return (
        <div className="container mt-5">
        <p> <h2 >Orders</h2></p>
            <div className="card">
                <h5 className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <span>Order List</span>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search by Order Id"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="btn btn-light">Search</button>
                    </div>
                </h5>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Order Id</th>
                                <th>Customer</th>
                                <th>Order Date</th>
                                <th>Order Status</th>
                                <th>Order Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.map(order => (
                                <tr key={order.id}>
                                    <td><Link to={`/orders/${order.id}/items`}>{order.id}</Link></td>
                                    <td>{order.customerName}</td>
                                    <td>{order.orderDate}</td>
                                    <td>{order.status}</td>
                                    <td>${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <ReactPaginate
                        previousLabel={'Previous'}
                        nextLabel={'Next'}
                        breakLabel={'...'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination justify-content-center'}
                        activeClassName={'active'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'page-item'}
                        previousLinkClassName={'page-link'}
                        nextClassName={'page-item'}
                        nextLinkClassName={'page-link'}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderList;
