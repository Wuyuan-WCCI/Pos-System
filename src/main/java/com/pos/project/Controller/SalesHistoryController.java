package com.pos.project.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.pos.project.Repository.OrderRepository;
import com.pos.project.Entities.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

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
    public Page<Order> getSalesByDay(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("pageSize") int pageSize,
            @RequestParam("page") int page) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.plusDays(1).atStartOfDay();
        return orderRepository.findAllByOrderDateBetween(startOfDay, endOfDay,
                PageRequest.of(page - 1, pageSize, Sort.by("orderDate").descending()));
    }

    @GetMapping("/week")
    public Page<Order> getSalesByWeek(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("pageSize") int pageSize,
            @RequestParam("page") int page) {
        LocalDate startOfWeek = date.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        LocalDateTime startOfWeekDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endOfWeekDateTime = endOfWeek.plusDays(1).atStartOfDay();
        return orderRepository.findAllByOrderDateBetween(startOfWeekDateTime, endOfWeekDateTime,
                PageRequest.of(page - 1, pageSize, Sort.by("orderDate").descending()));
    }

    @GetMapping("/month")
    public Page<Order> getSalesByMonth(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("pageSize") int pageSize,
            @RequestParam("page") int page) {
        YearMonth yearMonth = YearMonth.from(date);
        LocalDate firstDay = yearMonth.atDay(1);
        LocalDate lastDay = yearMonth.atEndOfMonth();
        LocalDateTime firstDayDateTime = firstDay.atStartOfDay();
        LocalDateTime lastDayDateTime = lastDay.plusDays(1).atStartOfDay();
        return orderRepository.findAllByOrderDateBetween(firstDayDateTime, lastDayDateTime,
                PageRequest.of(page - 1, pageSize, Sort.by("orderDate").descending()));
    }

    @GetMapping("/year")
    public Page<Order> getSalesByYear(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("pageSize") int pageSize,
            @RequestParam("page") int page) {
        LocalDate startOfYear = date.withDayOfYear(1);
        LocalDate endOfYear = date.withDayOfYear(date.lengthOfYear());
        LocalDateTime startOfYearDateTime = startOfYear.atStartOfDay();
        LocalDateTime endOfYearDateTime = endOfYear.plusDays(1).atStartOfDay();
        return orderRepository.findAllByOrderDateBetween(startOfYearDateTime, endOfYearDateTime,
                PageRequest.of(page - 1, pageSize, Sort.by("orderDate").descending()));
    }
}
