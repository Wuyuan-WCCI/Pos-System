package com.pos.project.Repository;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;

import com.pos.project.Entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

}
