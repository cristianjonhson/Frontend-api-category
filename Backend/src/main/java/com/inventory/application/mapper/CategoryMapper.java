package com.inventory.application.mapper;

import com.inventory.application.dto.CategoryDTO;
import com.inventory.domain.model.Category;

public class CategoryMapper {

    public static CategoryDTO toDTO(Category domain) {
        return new CategoryDTO(domain.getId(), domain.getName(), domain.getDescription());
    }

    public static Category toDomain(CategoryDTO dto) {
        return new Category(dto.getId(), dto.getName(), dto.getDescription());
    }

    // ✅ Para crear: NO seteamos id (se genera en BD)
    public static Category toDomainForCreate(String name, String description) {
        return new Category(null, name, description);
    }
}
