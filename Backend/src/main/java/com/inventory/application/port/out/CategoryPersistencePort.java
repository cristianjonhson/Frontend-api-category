package com.inventory.application.port.out;

import com.inventory.domain.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryPersistencePort {
    List<Category> findAll();
    Optional<Category> findById(Long id);
    Category save(Category category);
    boolean hasProducts(Long categoryId);
    void delete(Long id);
}
