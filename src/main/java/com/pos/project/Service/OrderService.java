package com.pos.project.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pos.project.Entities.Customer;
import com.pos.project.Entities.Order;
import com.pos.project.Repository.OrderRepository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Order createOrder(Order order) {
        // Validate and process order items and other details...

        // Example of setting payment methods
        Map<String, BigDecimal> paymentMethods = new HashMap<>();
        paymentMethods.put("Gift Card", new BigDecimal("100.00"));
        paymentMethods.put("Cash", new BigDecimal("120.95"));
        order.setPaymentMethods(paymentMethods);
        Customer customer = order.getCustomer();
        if (customer != null) {
            customer.addOrder(order);
        }

        return orderRepository.save(order);
    }

}
