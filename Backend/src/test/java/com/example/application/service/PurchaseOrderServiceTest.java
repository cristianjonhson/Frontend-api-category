package com.example.application.service;

import com.example.application.port.out.ProductPersistencePort;
import com.example.application.port.out.PurchaseOrderPersistencePort;
import com.example.application.port.out.SupplierPersistencePort;
import com.example.domain.model.Product;
import com.example.domain.model.PurchaseOrder;
import com.example.domain.model.PurchaseOrderItem;
import com.example.domain.model.Supplier;
import com.example.infrastructure.exception.ConflictException;
import com.example.infrastructure.exception.NotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderServiceTest {

    @Mock
    private PurchaseOrderPersistencePort purchaseOrderPersistence;

    @Mock
    private SupplierPersistencePort supplierPersistence;

    @Mock
    private ProductPersistencePort productPersistence;

    @InjectMocks
    private PurchaseOrderService service;

    @Test
    void createRequiresSupplier() {
        PurchaseOrder order = new PurchaseOrder();

        assertThrows(IllegalArgumentException.class, () -> service.create(order));
        verify(purchaseOrderPersistence, never()).save(any());
    }

    @Test
    void createRequiresAtLeastOneItem() {
        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(new Supplier(1L, null, null, null));
        when(supplierPersistence.findById(1L)).thenReturn(Optional.of(new Supplier(1L, "Acme", "mail@test.com", "123")));

        assertThrows(IllegalArgumentException.class, () -> service.create(order));
        verify(purchaseOrderPersistence, never()).save(any());
    }

    @Test
    void createMergesDuplicateProductsAndSavesPendingOrder() {
        Supplier supplier = new Supplier(1L, "Acme", "mail@test.com", "123");
        Product product = new Product();
        product.setId(10L);
        product.setName("Cafe");
        product.setSupplier(supplier);
        PurchaseOrder request = new PurchaseOrder();
        request.setSupplier(new Supplier(1L, null, null, null));
        request.setItems(List.of(
                new PurchaseOrderItem(null, productWithId(10L), 2, 0),
                new PurchaseOrderItem(null, productWithId(10L), 3, 0)
        ));

        when(supplierPersistence.findById(1L)).thenReturn(Optional.of(supplier));
        when(productPersistence.findById(10L)).thenReturn(Optional.of(product));
        when(purchaseOrderPersistence.save(any(PurchaseOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PurchaseOrder created = service.create(request);

        assertEquals("PENDING", created.getStatus());
        assertNotNull(created.getOrderNumber());
        assertTrue(created.getOrderNumber().startsWith("OC-"));
        assertNotNull(created.getCreatedAt());
        assertEquals(1, created.getItems().size());
        assertEquals(5, created.getItems().get(0).getOrderedQuantity());
        assertEquals(0, created.getItems().get(0).getReceivedQuantity());
    }

    @Test
    void createRejectsProductFromAnotherSupplier() {
        Supplier selectedSupplier = new Supplier(1L, "Acme", "mail@test.com", "123");
        Supplier productSupplier = new Supplier(2L, "Other", "other@test.com", "111");
        Product product = new Product();
        product.setId(10L);
        product.setName("Cafe");
        product.setSupplier(productSupplier);
        PurchaseOrder request = new PurchaseOrder();
        request.setSupplier(new Supplier(1L, null, null, null));
        request.setItems(List.of(new PurchaseOrderItem(null, productWithId(10L), 1, 0)));

        when(supplierPersistence.findById(1L)).thenReturn(Optional.of(selectedSupplier));
        when(productPersistence.findById(10L)).thenReturn(Optional.of(product));

        assertThrows(ConflictException.class, () -> service.create(request));
        verify(purchaseOrderPersistence, never()).save(any());
    }

    @Test
    void receiveRequiresItems() {
        PurchaseOrder existingOrder = new PurchaseOrder();
        existingOrder.setStatus("PENDING");
        when(purchaseOrderPersistence.findById(1L)).thenReturn(Optional.of(existingOrder));

        PurchaseOrder payload = new PurchaseOrder();

        assertThrows(IllegalArgumentException.class, () -> service.receive(1L, payload));
    }

    @Test
    void receiveRejectsAlreadyCompletedOrder() {
        PurchaseOrder existingOrder = new PurchaseOrder();
        existingOrder.setStatus("RECEIVED");
        when(purchaseOrderPersistence.findById(1L)).thenReturn(Optional.of(existingOrder));

        PurchaseOrder payload = new PurchaseOrder();
        payload.setItems(List.of(new PurchaseOrderItem(null, productWithId(10L), 0, 1)));

        assertThrows(ConflictException.class, () -> service.receive(1L, payload));
    }

    @Test
    void receiveRejectsWhenReceivedQuantityExceedsPending() {
        PurchaseOrder existingOrder = new PurchaseOrder();
        existingOrder.setStatus("PENDING");
        existingOrder.setItems(List.of(new PurchaseOrderItem(null, namedProduct(10L, "Cafe", 4), 5, 3)));
        when(purchaseOrderPersistence.findById(1L)).thenReturn(Optional.of(existingOrder));

        PurchaseOrder payload = new PurchaseOrder();
        payload.setItems(List.of(new PurchaseOrderItem(null, productWithId(10L), 0, 3)));

        assertThrows(ConflictException.class, () -> service.receive(1L, payload));
        verify(productPersistence, never()).save(any());
    }

    @Test
    void receiveUpdatesStockAndMarksOrderAsPartial() {
        PurchaseOrder existingOrder = new PurchaseOrder();
        existingOrder.setStatus("PENDING");
        existingOrder.setItems(List.of(new PurchaseOrderItem(null, namedProduct(10L, "Cafe", 4), 5, 1)));
        when(purchaseOrderPersistence.findById(1L)).thenReturn(Optional.of(existingOrder));
        when(productPersistence.findById(10L)).thenReturn(Optional.of(namedProduct(10L, "Cafe", 4)));
        when(productPersistence.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(purchaseOrderPersistence.save(existingOrder)).thenReturn(existingOrder);

        PurchaseOrder payload = new PurchaseOrder();
        payload.setItems(List.of(new PurchaseOrderItem(null, productWithId(10L), 0, 2)));

        PurchaseOrder updated = service.receive(1L, payload);

        assertEquals("PARTIALLY_RECEIVED", updated.getStatus());
        assertNull(updated.getReceivedAt());
        assertEquals(3, updated.getItems().get(0).getReceivedQuantity());

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productPersistence).save(productCaptor.capture());
        assertEquals(6, productCaptor.getValue().getQuantity());
    }

    @Test
    void receiveMarksOrderAsReceivedWhenAllItemsAreCompleted() {
        PurchaseOrder existingOrder = new PurchaseOrder();
        existingOrder.setStatus("PENDING");
        existingOrder.setItems(List.of(new PurchaseOrderItem(null, namedProduct(10L, "Cafe", 4), 5, 4)));
        when(purchaseOrderPersistence.findById(1L)).thenReturn(Optional.of(existingOrder));
        when(productPersistence.findById(10L)).thenReturn(Optional.of(namedProduct(10L, "Cafe", 4)));
        when(productPersistence.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(purchaseOrderPersistence.save(existingOrder)).thenReturn(existingOrder);

        PurchaseOrder payload = new PurchaseOrder();
        payload.setItems(List.of(new PurchaseOrderItem(null, productWithId(10L), 0, 1)));

        PurchaseOrder updated = service.receive(1L, payload);

        assertEquals("RECEIVED", updated.getStatus());
        assertNotNull(updated.getReceivedAt());
        assertEquals(5, updated.getItems().get(0).getReceivedQuantity());
    }

    @Test
    void receiveThrowsWhenProductToUpdateDoesNotExist() {
        PurchaseOrder existingOrder = new PurchaseOrder();
        existingOrder.setStatus("PENDING");
        existingOrder.setItems(List.of(new PurchaseOrderItem(null, namedProduct(10L, "Cafe", 4), 5, 1)));
        when(purchaseOrderPersistence.findById(1L)).thenReturn(Optional.of(existingOrder));
        when(productPersistence.findById(10L)).thenReturn(Optional.empty());

        PurchaseOrder payload = new PurchaseOrder();
        payload.setItems(List.of(new PurchaseOrderItem(null, productWithId(10L), 0, 1)));

        assertThrows(NotFoundException.class, () -> service.receive(1L, payload));
    }

    private static Product productWithId(Long id) {
        Product product = new Product();
        product.setId(id);
        return product;
    }

    private static Product namedProduct(Long id, String name, int quantity) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        product.setQuantity(quantity);
        return product;
    }
}