package com.example.infrastructure.persistence.adapter;

import com.example.domain.model.Category;
import com.example.domain.model.Product;
import com.example.domain.model.Supplier;
import com.example.infrastructure.persistence.jpa.entity.CategoryJpaEntity;
import com.example.infrastructure.persistence.jpa.entity.ProductJpaEntity;
import com.example.infrastructure.persistence.jpa.entity.SupplierJpaEntity;
import com.example.infrastructure.persistence.jpa.repository.CategoryJpaRepository;
import com.example.infrastructure.persistence.jpa.repository.ProductJpaRepository;
import com.example.infrastructure.persistence.jpa.repository.SupplierJpaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductJpaAdapterTest {

    @Mock
    private ProductJpaRepository productRepo;

    @Mock
    private CategoryJpaRepository categoryRepo;

    @Mock
    private SupplierJpaRepository supplierRepo;

    @InjectMocks
    private ProductJpaAdapter adapter;

    @Test
    void findAllMapsCategoryAndSupplier() {
        when(productRepo.findAll()).thenReturn(List.of(entity(1L, 2L, "Bebidas", 3L, "Acme")));

        List<Product> result = adapter.findAll();

        assertEquals(1, result.size());
        assertEquals("Bebidas", result.get(0).getCategory().getName());
        assertEquals("Acme", result.get(0).getSupplier().getName());
    }

    @Test
    void findBySupplierIdMapsResults() {
        when(productRepo.findBySupplierId(3L)).thenReturn(List.of(entity(1L, 2L, "Bebidas", 3L, "Acme")));

        List<Product> result = adapter.findBySupplierId(3L);

        assertEquals(1, result.size());
        assertEquals(3L, result.get(0).getSupplier().getId());
    }

    @Test
    void saveUsesCategoryAndSupplierReferences() {
        CategoryJpaEntity categoryRef = new CategoryJpaEntity(2L, "Bebidas", "Liquidos");
        SupplierJpaEntity supplierRef = new SupplierJpaEntity(3L, "Acme", "acme@test.com", "123");
        when(categoryRepo.getReferenceById(2L)).thenReturn(categoryRef);
        when(supplierRepo.getReferenceById(3L)).thenReturn(supplierRef);
        when(productRepo.save(any(ProductJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product product = new Product(1L, "Cafe", new BigDecimal("12.50"), 8,
                new Category(2L, "Bebidas", "Liquidos"),
                new Supplier(3L, "Acme", "acme@test.com", "123"));

        Product saved = adapter.save(product);

        assertEquals(2L, saved.getCategory().getId());
        assertEquals(3L, saved.getSupplier().getId());
    }

    @Test
    void saveReusesExistingCategoryAndSupplierForPartialUpdate() {
        CategoryJpaEntity existingCategory = new CategoryJpaEntity(2L, "Bebidas", "Liquidos");
        SupplierJpaEntity existingSupplier = new SupplierJpaEntity(3L, "Acme", "acme@test.com", "123");
        ProductJpaEntity existingEntity = new ProductJpaEntity(1L, "Cafe", new BigDecimal("12.50"), 8, existingCategory, existingSupplier);
        when(productRepo.findById(1L)).thenReturn(Optional.of(existingEntity));
        when(productRepo.save(any(ProductJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product partial = new Product();
        partial.setId(1L);
        partial.setName("Cafe");
        partial.setPrice(new BigDecimal("12.50"));
        partial.setQuantity(10);

        Product saved = adapter.save(partial);

        assertEquals(2L, saved.getCategory().getId());
        assertEquals(3L, saved.getSupplier().getId());
        assertEquals(10, saved.getQuantity());
    }

    @Test
    void saveThrowsWhenCategoryIsMissingForCreate() {
        Product product = new Product();
        product.setName("Cafe");
        product.setPrice(new BigDecimal("12.50"));
        product.setQuantity(3);

        assertThrows(IllegalArgumentException.class, () -> adapter.save(product));
        verify(productRepo, never()).save(any());
    }

    @Test
    void deleteDelegatesToRepository() {
        adapter.delete(4L);

        verify(productRepo).deleteById(4L);
    }

    private static ProductJpaEntity entity(Long id, Long categoryId, String categoryName, Long supplierId, String supplierName) {
        CategoryJpaEntity category = new CategoryJpaEntity(categoryId, categoryName, "Liquidos");
        SupplierJpaEntity supplier = new SupplierJpaEntity(supplierId, supplierName, "acme@test.com", "123");
        return new ProductJpaEntity(id, "Cafe", new BigDecimal("12.50"), 8, category, supplier);
    }
}