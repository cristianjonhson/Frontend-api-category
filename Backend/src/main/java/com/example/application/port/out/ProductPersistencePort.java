package com.example.application.port.out;

import com.example.domain.model.Product;

import java.util.List;
import java.util.Optional;

public interface ProductPersistencePort {
    List<Product> findAll();
    List<Product> findBySupplierId(Long supplierId);
    Optional<Product> findById(Long id);
    Product save(Product product);
    void delete(Long id);
}
