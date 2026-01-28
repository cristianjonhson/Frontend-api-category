package com.example.application.port.in;

import com.example.domain.model.Product;

import java.util.List;

public interface ProductUseCase {
    List<Product> getAll();
    Product create(Product product, Long categoryId);
}
