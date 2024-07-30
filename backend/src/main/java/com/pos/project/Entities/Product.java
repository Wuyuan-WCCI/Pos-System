package com.pos.project.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.Objects;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;

    private String description;
    private double price;
    private int quantityInStock;

    public Product() {
    }

    public Product(Long id, String name, String brand, String description, double price, int quantityInStock) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.price = price;
        this.quantityInStock = quantityInStock;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product id(Long id) {
        setId(id);
        return this;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Product name(String name) {
        setName(name);
        return this;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Product description(String description) {
        setDescription(description);
        return this;
    }

    public double getPrice() {
        return this.price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Product price(double price) {
        setPrice(price);
        return this;
    }

    public int getQuantityInStock() {
        return this.quantityInStock;
    }

    public void setQuantityInStock(int quantityInStock) {
        this.quantityInStock = quantityInStock;
    }

    public Product quantityInStock(int quantityInStock) {
        setQuantityInStock(quantityInStock);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Product)) {
            return false;
        }
        Product product = (Product) o;
        return Objects.equals(id, product.id) && Objects.equals(name, product.name)
                && Objects.equals(brand, product.brand)
                && Objects.equals(description, product.description) && price == product.price
                && quantityInStock == product.quantityInStock;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, brand, description, price, quantityInStock);
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", name='" + getName() + "'" +
                ", description='" + getDescription() + "'" +
                ", price='" + getPrice() + "'" +
                ", quantityInStock='" + getQuantityInStock() + "'" +
                "brand='" + getBrand() + "}";
    }

}
