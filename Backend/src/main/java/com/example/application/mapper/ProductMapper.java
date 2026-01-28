package com.example.application.mapper;

import com.example.application.dto.ProductDTO;
import com.example.domain.model.Category;
import com.example.domain.model.Product;

public class ProductMapper {

    public static ProductDTO toDTO(Product domain) {
        Category category = domain.getCategory();
        Long categoryId = category != null ? category.getId() : null;
        String categoryName = category != null ? category.getName() : null;

        return new ProductDTO(
                domain.getId(),
                domain.getName(),
                domain.getPrice(),
                domain.getQuantity(),
                categoryId,
                categoryName
        );
    }

    public static Product toDomainForCreate(String name, java.math.BigDecimal price, Integer quantity) {
        return new Product(null, name, price, quantity, null);
    }
}
