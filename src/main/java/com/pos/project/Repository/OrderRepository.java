package com.pos.project.Repository;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.pos.project.Entities.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    Page<Order> findAllByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

}
