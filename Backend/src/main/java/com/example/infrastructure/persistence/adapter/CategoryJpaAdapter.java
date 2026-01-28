package com.example.infrastructure.persistence.adapter;

import com.example.application.port.out.CategoryPersistencePort;
import com.example.domain.model.Category;
import com.example.infrastructure.persistence.jpa.entity.CategoryJpaEntity;
import com.example.infrastructure.persistence.jpa.repository.CategoryJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class CategoryJpaAdapter implements CategoryPersistencePort {

    private final CategoryJpaRepository repo;

    public CategoryJpaAdapter(CategoryJpaRepository repo) {
        this.repo = repo;
    }

   @Override
    public List<Category> findAll() {
        return repo.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Category> findById(Long id) {
        return repo.findById(id).map(this::toDomain);
    }

    @Override
    public Category save(Category category) {
        CategoryJpaEntity saved = repo.save(toEntity(category));
        return toDomain(saved);
    }

    private Category toDomain(CategoryJpaEntity e) {
        return new Category(e.getId(), e.getName(), e.getDescription());
    }

    private CategoryJpaEntity toEntity(Category d) {
        // ✅ al crear id debe ser null; si llega id, igual lo respetamos para update
        return new CategoryJpaEntity(d.getId(), d.getName(), d.getDescription());
    }
}
