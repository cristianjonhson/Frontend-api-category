package com.inventory.infrastructure.persistence.adapter;

import com.inventory.domain.model.Supplier;
import com.inventory.infrastructure.persistence.jpa.entity.SupplierJpaEntity;
import com.inventory.infrastructure.persistence.jpa.repository.SupplierJpaRepository;
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
class SupplierJpaAdapterTest {

    @Mock
    private SupplierJpaRepository supplierRepo;

    @InjectMocks
    private SupplierJpaAdapter adapter;

    @Test
    void findAllMapsEntitiesToDomain() {
        when(supplierRepo.findAll()).thenReturn(List.of(new SupplierJpaEntity(1L, "Acme", "acme@test.com", "123")));

        List<Supplier> result = adapter.findAll();

        assertEquals(1, result.size());
        assertEquals("Acme", result.get(0).getName());
    }

    @Test
    void findByIdMapsEntityToDomain() {
        when(supplierRepo.findById(1L)).thenReturn(Optional.of(new SupplierJpaEntity(1L, "Acme", "acme@test.com", "123")));

        Optional<Supplier> result = adapter.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("acme@test.com", result.get().getEmail());
    }

    @Test
    void saveMapsDomainToEntityAndBack() {
        when(supplierRepo.save(any(SupplierJpaEntity.class))).thenReturn(new SupplierJpaEntity(2L, "Acme", "acme@test.com", "123"));

        Supplier saved = adapter.save(new Supplier(null, "Acme", "acme@test.com", "123"));

        assertEquals(2L, saved.getId());
        assertEquals("123", saved.getPhone());
    }

    @Test
    void existsMethodsDelegateToRepository() {
        when(supplierRepo.existsByEmail("acme@test.com")).thenReturn(true);
        when(supplierRepo.existsByEmailAndIdNot("acme@test.com", 1L)).thenReturn(false);

        assertTrue(adapter.existsByEmail("acme@test.com"));
        assertFalse(adapter.existsByEmailAndIdNot("acme@test.com", 1L));
    }
}