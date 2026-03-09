package com.inventory.application.mapper;

import com.inventory.application.dto.CategoryDTO;
import com.inventory.domain.model.Category;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class CategoryMapperTest {

    @Test
    void toDtoMapsAllFields() {
        CategoryDTO dto = CategoryMapper.toDTO(new Category(1L, "Bebidas", "Liquidos"));

        assertEquals(1L, dto.getId());
        assertEquals("Bebidas", dto.getName());
        assertEquals("Liquidos", dto.getDescription());
    }

    @Test
    void toDomainMapsAllFields() {
        Category category = CategoryMapper.toDomain(new CategoryDTO(1L, "Bebidas", "Liquidos"));

        assertEquals(1L, category.getId());
        assertEquals("Bebidas", category.getName());
        assertEquals("Liquidos", category.getDescription());
    }

    @Test
    void toDomainForCreateAlwaysUsesNullId() {
        Category category = CategoryMapper.toDomainForCreate("Bebidas", "Liquidos");

        assertNull(category.getId());
        assertEquals("Bebidas", category.getName());
    }
}