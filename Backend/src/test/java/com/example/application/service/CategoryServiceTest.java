package com.example.application.service;

import com.example.application.port.out.CategoryPersistencePort;
import com.example.domain.model.Category;
import com.example.infrastructure.exception.ConflictException;
import com.example.infrastructure.exception.NotFoundException;
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
class CategoryServiceTest {

    @Mock
    private CategoryPersistencePort persistence;

    @InjectMocks
    private CategoryService service;

    @Test
    void getAllReturnsCategories() {
        List<Category> expected = List.of(new Category(1L, "Bebidas", "Liquidos"));
        when(persistence.findAll()).thenReturn(expected);

        List<Category> result = service.getAll();

        assertEquals(expected, result);
    }

    @Test
    void createClearsIdBeforeSaving() {
        Category category = new Category(99L, "Bebidas", "Liquidos");
        when(persistence.save(any(Category.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Category created = service.create(category);

        assertNull(created.getId());
        verify(persistence).save(category);
    }

    @Test
    void updateThrowsWhenCategoryDoesNotExist() {
        when(persistence.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.update(1L, new Category(null, "Nueva", "Desc")));
        verify(persistence, never()).save(any());
    }

    @Test
    void updateCopiesIncomingFieldsAndSavesExistingEntity() {
        Category existing = new Category(1L, "Vieja", "Anterior");
        when(persistence.findById(1L)).thenReturn(Optional.of(existing));
        when(persistence.save(existing)).thenReturn(existing);

        Category updated = service.update(1L, new Category(null, "Nueva", "Actualizada"));

        assertEquals("Nueva", updated.getName());
        assertEquals("Actualizada", updated.getDescription());
        verify(persistence).save(existing);
    }

    @Test
    void deleteThrowsConflictWhenCategoryHasProducts() {
        when(persistence.findById(1L)).thenReturn(Optional.of(new Category(1L, "Bebidas", "Liquidos")));
        when(persistence.hasProducts(1L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> service.delete(1L));
        verify(persistence, never()).delete(anyLong());
    }

    @Test
    void deleteRemovesCategoryWhenThereAreNoProducts() {
        when(persistence.findById(1L)).thenReturn(Optional.of(new Category(1L, "Bebidas", "Liquidos")));
        when(persistence.hasProducts(1L)).thenReturn(false);

        service.delete(1L);

        verify(persistence).delete(1L);
    }
}