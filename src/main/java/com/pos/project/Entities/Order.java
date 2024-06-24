package com.pos.project.Entities;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import java.util.stream.Collectors;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonBackReference
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    private String status;
    private double totalAmount;

    @ElementCollection
    @CollectionTable(name = "order_payment_methods", joinColumns = @JoinColumn(name = "order_id"))
    @MapKeyColumn(name = "payment_method")
    @Column(name = "amount")
    private Map<String, BigDecimal> paymentMethods = new HashMap<>();

    public Order() {
    }

    public Order(Long id, Customer customer, List<OrderItem> orderItems, LocalDateTime orderDate, String status,
            double totalAmount, Map<String, BigDecimal> paymentMethods) {
        this.id = id;
        this.customer = customer;
        this.orderItems = orderItems;
        this.orderDate = orderDate;
        this.status = status;
        this.totalAmount = totalAmount;
        this.paymentMethods = paymentMethods;
    }

    // Helper methods to manage the bi-directional relationship
    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

    public void removeOrderItem(OrderItem orderItem) {
        orderItems.remove(orderItem);
        orderItem.setOrder(null);
    }

    // Getters and setters...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
        for (OrderItem orderItem : orderItems) {
            orderItem.setOrder(this);
        }
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Map<String, BigDecimal> getPaymentMethods() {
        return paymentMethods;
    }

    public void setPaymentMethods(Map<String, BigDecimal> paymentMethods) {
        this.paymentMethods = paymentMethods;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Order order = (Order) o;
        return Double.compare(order.totalAmount, totalAmount) == 0 && Objects.equals(id, order.id)
                && Objects.equals(customer, order.customer) && Objects.equals(orderItems, order.orderItems)
                && Objects.equals(orderDate, order.orderDate) && Objects.equals(status, order.status)
                && Objects.equals(paymentMethods, order.paymentMethods);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customer, orderItems, orderDate, status, totalAmount, paymentMethods);
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", customer=" + customer.getName() +
                ", orderItems=" + orderItems.stream()
                        .map(OrderItem::basicToString)
                        .collect(Collectors.toList())
                +
                ", orderDate=" + orderDate +
                ", status='" + status + '\'' +
                ", totalAmount=" + totalAmount +
                ", paymentMethod='" + paymentMethods + '\'' +
                '}';
    }

}
