package com.inventory.application.service;

import com.inventory.application.port.out.CategoryPersistencePort;
import com.inventory.application.port.out.ProductPersistencePort;
import com.inventory.application.port.out.SupplierPersistencePort;
import com.inventory.domain.model.Category;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;
import com.inventory.infrastructure.exception.NotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductPersistencePort productPersistence;

    @Mock
    private CategoryPersistencePort categoryPersistence;

    @Mock
    private SupplierPersistencePort supplierPersistence;

    @InjectMocks
    private ProductService service;

    @Test
    void createAssignsCategoryAndOptionalSupplier() {
        Product product = new Product(77L, "Cafe", new BigDecimal("9.99"), 5, null);
        Category category = new Category(1L, "Bebidas", "Liquidos");
        Supplier supplier = new Supplier(2L, "Acme", "acme@test.com", "123");
        when(categoryPersistence.findById(1L)).thenReturn(Optional.of(category));
        when(supplierPersistence.findById(2L)).thenReturn(Optional.of(supplier));
        when(productPersistence.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Product created = service.create(product, 1L, 2L);

        assertNull(created.getId());
        assertSame(category, created.getCategory());
        assertSame(supplier, created.getSupplier());
    }

    @Test
    void createThrowsWhenCategoryDoesNotExist() {
        when(categoryPersistence.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.create(new Product(), 1L, null));
        verify(productPersistence, never()).save(any());
    }

    @Test
    void createThrowsWhenSupplierDoesNotExist() {
        when(categoryPersistence.findById(1L)).thenReturn(Optional.of(new Category(1L, "Bebidas", "Liquidos")));
        when(supplierPersistence.findById(2L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.create(new Product(), 1L, 2L));
        verify(productPersistence, never()).save(any());
    }

    @Test
    void updateReusesExistingProductAndRefreshesRelations() {
        Product existing = new Product(5L, "Viejo", new BigDecimal("1.00"), 1, new Category(8L, "Old", "Old"));
        Product incoming = new Product(null, "Nuevo", new BigDecimal("10.50"), 8, null);
        Category category = new Category(1L, "Bebidas", "Liquidos");
        Supplier supplier = new Supplier(2L, "Acme", "acme@test.com", "123");
        when(productPersistence.findById(5L)).thenReturn(Optional.of(existing));
        when(categoryPersistence.findById(1L)).thenReturn(Optional.of(category));
        when(supplierPersistence.findById(2L)).thenReturn(Optional.of(supplier));
        when(productPersistence.save(existing)).thenReturn(existing);

        Product updated = service.update(5L, incoming, 1L, 2L);

        assertEquals("Nuevo", updated.getName());
        assertEquals(new BigDecimal("10.50"), updated.getPrice());
        assertEquals(8, updated.getQuantity());
        assertSame(category, updated.getCategory());
        assertSame(supplier, updated.getSupplier());
    }

    @Test
    void deleteThrowsWhenProductDoesNotExist() {
        when(productPersistence.findById(3L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.delete(3L));
        verify(productPersistence, never()).delete(anyLong());
    }

    @Test
    void deleteRemovesExistingProduct() {
        when(productPersistence.findById(3L)).thenReturn(Optional.of(new Product()));

        service.delete(3L);

        verify(productPersistence).delete(3L);
    }
}