package com.example.infrastructure.controller;

import com.example.application.dto.ApiResponse;
import com.example.application.dto.CategoryCreateRequest;
import com.example.application.dto.CategoryDTO;
import com.example.application.mapper.CategoryMapper;
import com.example.application.port.in.CategoryUseCase;
import com.example.domain.model.Category;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryUseCase categoryUseCase;

    public CategoryController(CategoryUseCase categoryUseCase) {
        this.categoryUseCase = categoryUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> dtos = categoryUseCase.getAll().stream()
                .map(CategoryMapper::toDTO)
                .collect(Collectors.toList());

        ApiResponse<CategoryDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.CategoryResponse<>(dtos)
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryCreateRequest request) {
        Category created = categoryUseCase.create(
                CategoryMapper.toDomainForCreate(request.getName(), request.getDescription())
        );

        ApiResponse<CategoryDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.CategoryResponse<>(List.of(CategoryMapper.toDTO(created)))
        );

        return ResponseEntity.ok(response);
    }
}
