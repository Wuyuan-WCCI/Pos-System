package com.pos.project.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pos.project.Entities.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}