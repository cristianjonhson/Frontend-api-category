package com.inventory.application.port.in;

import com.inventory.domain.model.Product;

import java.util.List;

public interface ProductUseCase {
    List<Product> getAll();
    Product create(Product product, Long categoryId, Long supplierId);
    Product update(Long id, Product product, Long categoryId, Long supplierId);
    void delete(Long id);
}
