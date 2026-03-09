package com.inventory.application.mapper;

import com.inventory.application.dto.ProductDTO;
import com.inventory.domain.model.Category;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class ProductMapperTest {

    @Test
    void toDtoMapsCategoryAndSupplierData() {
        Product product = new Product(
                1L,
                "Cafe",
                new BigDecimal("12.50"),
                8,
                new Category(2L, "Bebidas", "Liquidos"),
                new Supplier(3L, "Acme", "acme@test.com", "123")
        );

        ProductDTO dto = ProductMapper.toDTO(product);

        assertEquals(1L, dto.getId());
        assertEquals(2L, dto.getCategoryId());
        assertEquals("Bebidas", dto.getCategoryName());
        assertEquals(3L, dto.getSupplierId());
        assertEquals("Acme", dto.getSupplierName());
    }

    @Test
    void toDomainForCreateWithoutSupplierLeavesSupplierNull() {
        Product product = ProductMapper.toDomainForCreate("Cafe", new BigDecimal("12.50"), 8);

        assertNull(product.getId());
        assertNull(product.getCategory());
        assertNull(product.getSupplier());
    }

    @Test
    void toDomainForCreateWithSupplierCreatesSupplierReference() {
        Product product = ProductMapper.toDomainForCreate("Cafe", new BigDecimal("12.50"), 8, 4L);

        assertNull(product.getId());
        assertNotNull(product.getSupplier());
        assertEquals(4L, product.getSupplier().getId());
    }
}