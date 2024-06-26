package com.pos.project.Entities;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.Objects;

@Entity
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private Double amount;
    private LocalDate date;

    public Expense() {
    }

    public Expense(Long id, String description, Double amount, LocalDate date) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.date = date;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Expense id(Long id) {
        setId(id);
        return this;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Expense description(String description) {
        setDescription(description);
        return this;
    }

    public Double getAmount() {
        return this.amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Expense amount(Double amount) {
        setAmount(amount);
        return this;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Expense date(LocalDate date) {
        setDate(date);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Expense)) {
            return false;
        }
        Expense expense = (Expense) o;
        return Objects.equals(id, expense.id) && Objects.equals(description, expense.description)
                && Objects.equals(amount, expense.amount) && Objects.equals(date, expense.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, description, amount, date);
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", description='" + getDescription() + "'" +
                ", amount='" + getAmount() + "'" +
                ", date='" + getDate() + "'" +
                "}";
    }
}