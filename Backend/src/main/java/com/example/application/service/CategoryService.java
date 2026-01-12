package com.example.application.service;

import com.example.domain.CategoryEntity;
import com.example.infrastructure.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryEntity> getAllCategories() {
        return categoryRepository.findAll();
    }

    public CategoryEntity createCategory(CategoryEntity category) {
        return categoryRepository.save(category);
    }
}