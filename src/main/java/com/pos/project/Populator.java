package com.pos.project;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.pos.project.Entities.Customer;
import com.pos.project.Entities.Order;
import com.pos.project.Entities.OrderItem;
import com.pos.project.Entities.Product;
import com.pos.project.Repository.CustomerRepository;
import com.pos.project.Repository.OrderRepository;
import com.pos.project.Repository.ProductRepository;
import com.pos.project.Repository.OrderItemRepository;

@Component
public class Populator implements CommandLineRunner {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Override
    public void run(String... args) throws Exception {

        // Create and save products
        Product product1 = new Product(null, "Coke", "6 packed", 3.99, 6);
        productRepo.save(product1);

        Product product2 = new Product(null, "Cake", "6 packed", 3.99, 6);
        productRepo.save(product2);

        // Create and save a customer
        Customer customer1 = new Customer(null, "lin", "", "", "");
        customerRepo.save(customer1);

        // Create an order
        Date orderDate = new Date();
        String status = "pending";
        double totalAmount = 100.00;
        String paymentMethod = "cash";

        Order newOrder = new Order(1l, customer1, new ArrayList<>(), orderDate, status, totalAmount, paymentMethod);
        orderRepo.save(newOrder);

        // Create and save order items
        OrderItem orderItem1 = new OrderItem(1l, product1, 2, product1.getPrice() * 2);
        orderItemRepo.save(orderItem1);

        OrderItem orderItem2 = new OrderItem(2l, product2, 1, product2.getPrice() * 1);
        orderItemRepo.save(orderItem2);

        // Update the order with order items
        List<OrderItem> orderItems = new ArrayList<>();
        orderItems.add(orderItem1);
        orderItems.add(orderItem2);
        newOrder.setOrderItems(orderItems);
        orderRepo.save(newOrder);

        System.out.println(newOrder.getOrderItems());
    }
}
