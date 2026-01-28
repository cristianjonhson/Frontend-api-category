package com.example.application.service;

import com.example.application.port.in.ProductUseCase;
import com.example.application.port.out.CategoryPersistencePort;
import com.example.application.port.out.ProductPersistencePort;
import com.example.domain.model.Category;
import com.example.domain.model.Product;
import com.example.infrastructure.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService implements ProductUseCase {

    private final ProductPersistencePort productPersistence;
    private final CategoryPersistencePort categoryPersistence;

    public ProductService(ProductPersistencePort productPersistence, CategoryPersistencePort categoryPersistence) {
        this.productPersistence = productPersistence;
        this.categoryPersistence = categoryPersistence;
    }

    @Override
    public List<Product> getAll() {
        return productPersistence.findAll();
    }

    @Override
    public Product create(Product product, Long categoryId) {
        Category category = categoryPersistence.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        product.setId(null);
        product.setCategory(category);

        return productPersistence.save(product);
    }
}
