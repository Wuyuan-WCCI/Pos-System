package com.pos.project.Controller;

import org.aspectj.weaver.ast.Or;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import com.pos.project.Repository.OrderRepository;
import com.pos.project.Entities.Order;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/sales-history")
@CrossOrigin(origins = "http://localhost:5173")
public class SalesHistoryController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/day")
    public List<Order> getSalesByDay(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return orderRepository.findAllByOrderDateBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
    }

    @GetMapping("/week")
    public List<Order> getSalesByWeek(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate startOfWeek = date.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        return orderRepository.findAllByOrderDateBetween(startOfWeek.atStartOfDay(),
                endOfWeek.plusDays(1).atStartOfDay());
    }

    @GetMapping("/month")
    public List<Order> getSalesByMonth(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        YearMonth yearMonth = YearMonth.from(date);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();
        return orderRepository.findAllByOrderDateBetween(firstDay.atStartOfDay(), lastDay.plusDays(1).atStartOfDay());
    }

    @GetMapping("/year")
    public List<Order> getSalesByYear(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate firstDay = date.withDayOfYear(1);
        LocalDate lastDay = date.withDayOfYear(date.lengthOfYear());
        return orderRepository.findAllByOrderDateBetween(firstDay.atStartOfDay(), lastDay.plusDays(1).atStartOfDay());
    }

}
