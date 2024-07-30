package com.pos.project.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pos.project.Entities.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

}
