package com.pos.project.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pos.project.Entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

}
