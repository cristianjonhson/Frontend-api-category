package com.example.application.service;

import com.example.application.port.in.CategoryUseCase;
import com.example.application.port.out.CategoryPersistencePort;
import com.example.domain.model.Category;
import com.example.infrastructure.exception.NotFoundException;
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

    @Override
    public Category update(Long id, Category category) {
        Category existing = persistence.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        existing.setName(category.getName());
        existing.setDescription(category.getDescription());

        return persistence.save(existing);
    }

    @Override
    public void delete(Long id) {
        persistence.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));
        persistence.delete(id);
    }
}
