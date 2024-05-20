package com.pos.project;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.pos.project.Entities.Customer;
import com.pos.project.Entities.Product;
import com.pos.project.Repository.CustomerRepository;
import com.pos.project.Repository.OrderRepository;
import com.pos.project.Repository.ProductRepository;

@Component
public class Populator implements CommandLineRunner {
    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private ProductRepository productRepo;

    public void run(String... args) throws Exception {

        Product product1 = new Product(1l, "Coke", "6 packed", 3.99, 6);
        productRepo.save(product1);

        Product product2 = new Product(2l, "Cake", "6 packed", 3.99, 6);
        productRepo.save(product2);

        Customer customer1 = new Customer(5l, "lin", "", "", "");
        customerRepo.save(customer1);

    }
}
