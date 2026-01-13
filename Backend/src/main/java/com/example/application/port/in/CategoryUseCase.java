package com.example.application.port.in;

import com.example.domain.model.Category;

import java.util.List;

public interface CategoryUseCase {
    List<Category> getAll();
    Category create(Category category);
}
