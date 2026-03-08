package com.example.infrastructure.persistence.adapter;

import com.example.domain.model.Category;
import com.example.infrastructure.persistence.jpa.entity.CategoryJpaEntity;
import com.example.infrastructure.persistence.jpa.repository.CategoryJpaRepository;
import com.example.infrastructure.persistence.jpa.repository.ProductJpaRepository;
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
class CategoryJpaAdapterTest {

    @Mock
    private CategoryJpaRepository repo;

    @Mock
    private ProductJpaRepository productRepo;

    @InjectMocks
    private CategoryJpaAdapter adapter;

    @Test
    void findAllMapsEntitiesToDomain() {
        when(repo.findAll()).thenReturn(List.of(new CategoryJpaEntity(1L, "Bebidas", "Liquidos")));

        List<Category> result = adapter.findAll();

        assertEquals(1, result.size());
        assertEquals("Bebidas", result.get(0).getName());
    }

    @Test
    void findByIdMapsEntityToDomain() {
        when(repo.findById(1L)).thenReturn(Optional.of(new CategoryJpaEntity(1L, "Bebidas", "Liquidos")));

        Optional<Category> result = adapter.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Liquidos", result.get().getDescription());
    }

    @Test
    void saveMapsDomainToEntityAndBack() {
        when(repo.save(any(CategoryJpaEntity.class))).thenReturn(new CategoryJpaEntity(3L, "Bebidas", "Liquidos"));

        Category saved = adapter.save(new Category(null, "Bebidas", "Liquidos"));

        assertEquals(3L, saved.getId());
        assertEquals("Bebidas", saved.getName());
    }

    @Test
    void hasProductsDelegatesToProductRepository() {
        when(productRepo.existsByCategoryId(5L)).thenReturn(true);

        assertTrue(adapter.hasProducts(5L));
    }
}