package com.example.infrastructure.controller;

import com.example.application.dto.CategoryDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final List<CategoryDTO> categories = new ArrayList<>();

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        return ResponseEntity.ok(categories);
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO category) {
        category.setId((long) (categories.size() + 1));
        categories.add(category);
        return ResponseEntity.ok(category);
    }
}