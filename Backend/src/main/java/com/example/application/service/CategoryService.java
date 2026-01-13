package com.example.application.service;

import com.example.application.port.in.CategoryUseCase;
import com.example.application.port.out.CategoryPersistencePort;
import com.example.domain.model.Category;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements CategoryUseCase {

    private final CategoryPersistencePort persistence;

    public CategoryService(CategoryPersistencePort persistence) {
        this.persistence = persistence;
    }

    @Override
    public List<Category> getAll() {
        return persistence.findAll();
    }

    @Override
    public Category create(Category category) {
        // ✅ id debe ser null al crear
        category.setId(null);
        return persistence.save(category);
    }
}
