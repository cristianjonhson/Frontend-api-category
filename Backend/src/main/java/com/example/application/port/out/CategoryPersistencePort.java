package com.example.application.port.out;

import com.example.domain.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryPersistencePort {
    List<Category> findAll();
    Optional<Category> findById(Long id);
    Category save(Category category);
}
