CREATE TABLE gift_card (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN NOT NULL
);

CREATE TABLE order_payment_methods (
    order_id BIGINT NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    amount DOUBLE NOT NULL,
    PRIMARY KEY (order_id, payment_method),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

