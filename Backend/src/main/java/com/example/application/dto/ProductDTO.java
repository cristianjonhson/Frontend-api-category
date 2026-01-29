package com.example.application.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.math.BigDecimal;

public class ProductDTO {
    @JsonIgnore
    private Long id;
    private String name;
    private BigDecimal price;
    private Integer quantity;
    @JsonIgnore
    private Long categoryId;
    private String categoryName;

    public ProductDTO() {}

    public ProductDTO(Long id, String name, BigDecimal price, Integer quantity, Long categoryId, String categoryName) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}
