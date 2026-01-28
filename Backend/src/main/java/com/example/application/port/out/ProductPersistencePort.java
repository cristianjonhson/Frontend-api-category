package com.example.application.port.out;

import com.example.domain.model.Product;

import java.util.List;

public interface ProductPersistencePort {
    List<Product> findAll();
    Product save(Product product);
}
