package com.pos.project.Entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;

@Entity
@Table(name = "gift_card")
public class GiftCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    @Column(precision = 10, scale = 2)
    private BigDecimal balance;

    private boolean isActive;

    public GiftCard() {
    }

    public GiftCard(Long id, String code, BigDecimal balance, boolean isActive) {
        this.id = id;
        this.code = code;
        this.balance = balance;
        this.isActive = isActive;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GiftCard id(Long id) {
        setId(id);
        return this;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public GiftCard code(String code) {
        setCode(code);
        return this;
    }

    public BigDecimal getBalance() {
        return this.balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance.setScale(2, RoundingMode.HALF_UP);
    }

    public GiftCard balance(BigDecimal balance) {
        setBalance(balance);
        return this;
    }

    public boolean isIsActive() {
        return this.isActive;
    }

    public boolean getIsActive() {
        return this.isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public GiftCard isActive(boolean isActive) {
        setIsActive(isActive);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof GiftCard)) {
            return false;
        }
        GiftCard giftCard = (GiftCard) o;
        return Objects.equals(id, giftCard.id) && Objects.equals(code, giftCard.code) && balance == giftCard.balance
                && isActive == giftCard.isActive;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, code, balance, isActive);
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", code='" + getCode() + "'" +
                ", balance='" + getBalance() + "'" +
                ", isActive='" + isIsActive() + "'" +
                "}";
    }

}
