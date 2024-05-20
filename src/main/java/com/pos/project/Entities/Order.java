package com.pos.project.Entities;

import java.util.*;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.Objects;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Customer customer;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();

    private Date orderDate;
    private String status;
    private double totalAmount;

    public Order() {
    }

    public Order(Long id, Customer customer, List<OrderItem> orderItems, Date orderDate, String status,
            double totalAmount) {
        this.id = id;
        this.customer = customer;
        this.orderItems = orderItems;
        this.orderDate = orderDate;
        this.status = status;
        this.totalAmount = totalAmount;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order id(Long id) {
        setId(id);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Order customer(Customer customer) {
        setCustomer(customer);
        return this;
    }

    public List<OrderItem> getOrderItems() {
        return this.orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public Order orderItems(List<OrderItem> orderItems) {
        setOrderItems(orderItems);
        return this;
    }

    public Date getOrderDate() {
        return this.orderDate;
    }

    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }

    public Order orderDate(Date orderDate) {
        setOrderDate(orderDate);
        return this;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Order status(String status) {
        setStatus(status);
        return this;
    }

    public double getTotalAmount() {
        return this.totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Order totalAmount(double totalAmount) {
        setTotalAmount(totalAmount);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Order)) {
            return false;
        }
        Order order = (Order) o;
        return Objects.equals(id, order.id) && Objects.equals(customer, order.customer)
                && Objects.equals(orderItems, order.orderItems) && Objects.equals(orderDate, order.orderDate)
                && Objects.equals(status, order.status) && totalAmount == order.totalAmount;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, customer, orderItems, orderDate, status, totalAmount);
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", customer='" + getCustomer() + "'" +
                ", orderItems='" + getOrderItems() + "'" +
                ", orderDate='" + getOrderDate() + "'" +
                ", status='" + getStatus() + "'" +
                ", totalAmount='" + getTotalAmount() + "'" +
                "}";
    }

}
