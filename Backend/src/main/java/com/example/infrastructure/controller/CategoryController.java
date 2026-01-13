package com.example.infrastructure.controller;

import com.example.application.dto.CategoryDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final List<CategoryDTO> categories = new ArrayList<>();

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories() {
        List<CategoryDTO> categories = this.categories;
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("code", "SUCCESS");

        Map<String, Object> categoryResponse = new HashMap<>();
        categoryResponse.put("category", categories);

        Map<String, Object> response = new HashMap<>();
        response.put("metadata", List.of(metadata));
        response.put("categoryResponse", categoryResponse);

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO category) {
        category.setId((long) (categories.size() + 1));
        categories.add(category);
        return ResponseEntity.ok(category);
    }
}