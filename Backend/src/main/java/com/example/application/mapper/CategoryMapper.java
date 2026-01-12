package com.example.application.mapper;

import com.example.application.dto.CategoryDTO;
import com.example.domain.CategoryEntity;

public class CategoryMapper {

    public static CategoryDTO toDTO(CategoryEntity entity) {
        return new CategoryDTO(entity.getId(), entity.getName(), entity.getDescription());
    }

    public static CategoryEntity toEntity(CategoryDTO dto) {
        CategoryEntity entity = new CategoryEntity();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}