package com.inventory.application.service;

import com.inventory.application.port.out.ProductPersistencePort;
import com.inventory.application.port.out.SupplierPersistencePort;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;
import com.inventory.infrastructure.exception.NotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SupplierServiceTest {

    @Mock
    private SupplierPersistencePort supplierPersistence;

    @Mock
    private ProductPersistencePort productPersistence;

    @InjectMocks
    private SupplierService service;

    @Test
    void createRejectsDuplicatedEmail() {
        when(supplierPersistence.existsByEmail("mail@test.com")).thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> service.create(new Supplier(3L, "Proveedor", "mail@test.com", "123")));
        verify(supplierPersistence, never()).save(any());
    }

    @Test
    void createClearsIdBeforeSaving() {
        Supplier supplier = new Supplier(5L, "Proveedor", "mail@test.com", "123");
        when(supplierPersistence.existsByEmail("mail@test.com")).thenReturn(false);
        when(supplierPersistence.save(any(Supplier.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Supplier created = service.create(supplier);

        assertNull(created.getId());
    }

    @Test
    void updateThrowsWhenSupplierDoesNotExist() {
        when(supplierPersistence.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.update(1L, new Supplier(null, "Proveedor", "mail@test.com", "123")));
    }

    @Test
    void updateRejectsEmailUsedByAnotherSupplier() {
        when(supplierPersistence.findById(1L)).thenReturn(Optional.of(new Supplier(1L, "Old", "old@test.com", "111")));
        when(supplierPersistence.existsByEmailAndIdNot("mail@test.com", 1L)).thenReturn(true);

        assertThrows(IllegalArgumentException.class,
                () -> service.update(1L, new Supplier(null, "Proveedor", "mail@test.com", "123")));
        verify(supplierPersistence, never()).save(any());
    }

    @Test
    void updateCopiesFieldsAndSavesExistingSupplier() {
        Supplier existing = new Supplier(1L, "Old", "old@test.com", "111");
        when(supplierPersistence.findById(1L)).thenReturn(Optional.of(existing));
        when(supplierPersistence.existsByEmailAndIdNot("mail@test.com", 1L)).thenReturn(false);
        when(supplierPersistence.save(existing)).thenReturn(existing);

        Supplier updated = service.update(1L, new Supplier(null, "Proveedor", "mail@test.com", "123"));

        assertEquals("Proveedor", updated.getName());
        assertEquals("mail@test.com", updated.getEmail());
        assertEquals("123", updated.getPhone());
    }

    @Test
    void deleteRemovesExistingSupplier() {
        when(supplierPersistence.findById(9L)).thenReturn(Optional.of(new Supplier()));

        service.delete(9L);

        verify(supplierPersistence).delete(9L);
    }

    @Test
    void getProductsBySupplierIdDelegatesToPersistence() {
        List<Product> products = List.of(new Product());
        when(productPersistence.findBySupplierId(7L)).thenReturn(products);

        List<Product> result = service.getProductsBySupplierId(7L);

        assertEquals(products, result);
    }
}