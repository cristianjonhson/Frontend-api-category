package com.example.application.mapper;

import com.example.application.dto.SupplierDTO;
import com.example.domain.model.Category;
import com.example.domain.model.Product;
import com.example.domain.model.Supplier;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SupplierMapperTest {

    @Test
    void toDtoMapsProductsAndCategoryNames() {
        Supplier supplier = new Supplier(1L, "Acme", "acme@test.com", "123");
        Product product = new Product(10L, "Cafe", new BigDecimal("3.50"), 5, new Category(2L, "Bebidas", "Liquidos"));

        SupplierDTO dto = SupplierMapper.toDTO(supplier, List.of(product));

        assertEquals(1L, dto.getId());
        assertEquals(1, dto.getProducts().size());
        assertEquals("Cafe", dto.getProducts().get(0).getName());
        assertEquals("Bebidas", dto.getProducts().get(0).getCategoryName());
    }

    @Test
    void toDomainForCreateCreatesSupplierWithoutId() {
        Supplier supplier = SupplierMapper.toDomainForCreate("Acme", "acme@test.com", "123");

        assertNull(supplier.getId());
        assertEquals("Acme", supplier.getName());
        assertEquals("acme@test.com", supplier.getEmail());
    }
}