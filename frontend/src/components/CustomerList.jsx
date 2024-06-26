import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CustomerContext } from '../context/CustomerContext';
import Modal from 'react-modal';
import ReactPaginate from 'react-paginate';
import CustomerForm from './CustomerForm';
import './modalStyles.css';

const CustomerList = () => {
    const { customers, fetchCustomers } = useContext(CustomerContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('asc');
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const customersPerPage = 5;

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };

    const handleFilterTextChange = (e) => {
        setFilterText(e.target.value);
    };

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    const sortedCustomers = [...customers].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.name.localeCompare(b.name);
        } else {
            return b.name.localeCompare(a.name);
        }
    });

    const filteredCustomers = sortedCustomers.filter(customer =>
        customer.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const offset = currentPage * customersPerPage;
    const currentCustomers = filteredCustomers.slice(offset, offset + customersPerPage);
    const pageCount = Math.ceil(filteredCustomers.length / customersPerPage);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="walmart-header">Customer List</h2>
                <div className="d-flex">
                    <input
                        type="text"
                        className="form-control mr-2"
                        placeholder="Filter by name"
                        value={filterText}
                        onChange={handleFilterTextChange}
                    />
                    <select className="form-control" value={sortOrder} onChange={handleSortOrderChange}>
                        <option value="asc">Sort by Name (A-Z)</option>
                        <option value="desc">Sort by Name (Z-A)</option>
                    </select>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Add New Customer"
                className="react-modal-content"
                overlayClassName="react-modal-overlay"
            >
                <CustomerForm closeModal={closeModal} />
            </Modal>
            {currentCustomers.length > 0 ? (
                <div className="card-container mb-4">
                    {currentCustomers.map(customer => (
                        <div key={customer.id} className="card">
                            <Link to={`/customers/${customer.id}`} className="card-link">
                                <h5 className="card-title">{customer.name}</h5>
                            </Link>
                            <p className="card-text"><strong>Email:</strong> {customer.email}</p>
                            <p className="card-text"><strong>Phone:</strong> {customer.phone}</p>
                            <p className="card-text"><strong>Address:</strong> {customer.address}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="alert alert-warning" role="alert">
                    No customers found
                </div>
            )}
            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-primary" onClick={openModal}>
                    Add New Customer
                </button>
            </div>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakLinkClassName={'page-link'}
            />
        </div>
    );
};

export default CustomerList;
