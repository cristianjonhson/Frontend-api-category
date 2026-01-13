package com.example.application.port.out;

import com.example.domain.model.Category;

import java.util.List;

public interface CategoryPersistencePort {
    List<Category> findAll();
    Category save(Category category);
}
