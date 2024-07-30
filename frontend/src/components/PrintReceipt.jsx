// src/components/PrintReceipt.jsx
import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PropTypes from 'prop-types';
import Receipt from './Receipt';

const PrintReceipt = forwardRef(({ order, customer }, ref) => {
    const receiptRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => receiptRef.current,
    });

    useImperativeHandle(ref, () => ({
        handlePrint,
    }));

    

    return (
        <div>
            <Receipt ref={receiptRef} order={order} customer={customer} />
        </div>
    );
});

PrintReceipt.displayName = 'PrintReceipt';

PrintReceipt.propTypes = {
    order: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        orderDate: PropTypes.string.isRequired,
        orderItems: PropTypes.arrayOf(PropTypes.shape({
            product: PropTypes.shape({
                id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                price: PropTypes.number.isRequired,
            }).isRequired,
            quantity: PropTypes.number.isRequired,
        })).isRequired,
        totalAmount: PropTypes.number.isRequired,
    }).isRequired,
    customer: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
    }).isRequired,
};

export default PrintReceipt;
