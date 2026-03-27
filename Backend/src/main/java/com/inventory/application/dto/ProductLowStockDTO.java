package com.inventory.application.dto;

public class ProductLowStockDTO {
    private Long id;
    private String name;
    private String categoryName;
    private int quantity;
    private double price;

    public ProductLowStockDTO() {
    }

    public ProductLowStockDTO(Long id, String name, String categoryName, int quantity, double price) {
        this.id = id;
        this.name = name;
        this.categoryName = categoryName;
        this.quantity = quantity;
        this.price = price;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}
