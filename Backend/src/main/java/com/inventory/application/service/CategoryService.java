package com.inventory.application.service;

import com.inventory.application.port.in.CategoryUseCase;
import com.inventory.application.port.out.CategoryPersistencePort;
import com.inventory.domain.model.Category;
import com.inventory.infrastructure.exception.ConflictException;
import com.inventory.infrastructure.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public void delete(Long id) {
        persistence.findById(id)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        if (persistence.hasProducts(id)) {
            throw new ConflictException("No se puede eliminar la categoria porque tiene productos asociados");
        }

        persistence.delete(id);
    }
}
