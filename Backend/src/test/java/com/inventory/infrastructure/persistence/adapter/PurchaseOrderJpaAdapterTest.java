package com.inventory.infrastructure.persistence.adapter;

import com.inventory.domain.model.Product;
import com.inventory.domain.model.PurchaseOrder;
import com.inventory.domain.model.PurchaseOrderItem;
import com.inventory.domain.model.Supplier;
import com.inventory.infrastructure.persistence.jpa.entity.ProductJpaEntity;
import com.inventory.infrastructure.persistence.jpa.entity.PurchaseOrderItemJpaEntity;
import com.inventory.infrastructure.persistence.jpa.entity.PurchaseOrderJpaEntity;
import com.inventory.infrastructure.persistence.jpa.entity.SupplierJpaEntity;
import com.inventory.infrastructure.persistence.jpa.repository.ProductJpaRepository;
import com.inventory.infrastructure.persistence.jpa.repository.PurchaseOrderJpaRepository;
import com.inventory.infrastructure.persistence.jpa.repository.SupplierJpaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderJpaAdapterTest {

    @Mock
    private PurchaseOrderJpaRepository purchaseOrderRepo;

    @Mock
    private SupplierJpaRepository supplierRepo;

    @Mock
    private ProductJpaRepository productRepo;

    @InjectMocks
    private PurchaseOrderJpaAdapter adapter;

    @Test
    void findByIdMapsNestedSupplierAndItems() {
        when(purchaseOrderRepo.findById(1L)).thenReturn(Optional.of(entity()));

        Optional<PurchaseOrder> result = adapter.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Acme", result.get().getSupplier().getName());
        assertEquals("Cafe", result.get().getItems().get(0).getProduct().getName());
        assertEquals(5, result.get().getItems().get(0).getOrderedQuantity());
    }

    @Test
    void findAllMapsEntities() {
        when(purchaseOrderRepo.findAll()).thenReturn(List.of(entity()));

        List<PurchaseOrder> result = adapter.findAll();

        assertEquals(1, result.size());
        assertEquals("OC-1", result.get(0).getOrderNumber());
    }

    @Test
    void saveMapsReferencesAndBackReferences() {
        SupplierJpaEntity supplierRef = new SupplierJpaEntity(2L, "Acme", "acme@test.com", "123");
        ProductJpaEntity productRef = new ProductJpaEntity();
        productRef.setId(10L);
        productRef.setName("Cafe");
        productRef.setPrice(new BigDecimal("12.50"));
        productRef.setQuantity(4);
        when(supplierRepo.getReferenceById(2L)).thenReturn(supplierRef);
        when(productRepo.getReferenceById(10L)).thenReturn(productRef);
        when(purchaseOrderRepo.save(any(PurchaseOrderJpaEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PurchaseOrder saved = adapter.save(domain());

        assertEquals(2L, saved.getSupplier().getId());
        assertEquals(1, saved.getItems().size());
        assertEquals(10L, saved.getItems().get(0).getProduct().getId());

        ArgumentCaptor<PurchaseOrderJpaEntity> captor = ArgumentCaptor.forClass(PurchaseOrderJpaEntity.class);
        verify(purchaseOrderRepo).save(captor.capture());
        PurchaseOrderJpaEntity persisted = captor.getValue();
        assertSame(persisted, persisted.getItems().get(0).getPurchaseOrder());
    }

    private static PurchaseOrder domain() {
        PurchaseOrder order = new PurchaseOrder();
        order.setId(1L);
        order.setOrderNumber("OC-1");
        order.setSupplier(new Supplier(2L, null, null, null));
        order.setStatus("PENDING");
        order.setExpectedDate(LocalDate.of(2026, 3, 20));
        order.setCreatedAt(LocalDateTime.of(2026, 3, 16, 10, 0));
        order.setItems(List.of(new PurchaseOrderItem(3L, product(), 5, 1)));
        return order;
    }

    private static PurchaseOrderJpaEntity entity() {
        SupplierJpaEntity supplier = new SupplierJpaEntity(2L, "Acme", "acme@test.com", "123");
        ProductJpaEntity product = new ProductJpaEntity();
        product.setId(10L);
        product.setName("Cafe");
        product.setPrice(new BigDecimal("12.50"));
        product.setQuantity(4);

        PurchaseOrderJpaEntity order = new PurchaseOrderJpaEntity();
        order.setId(1L);
        order.setOrderNumber("OC-1");
        order.setSupplier(supplier);
        order.setStatus("PENDING");
        order.setExpectedDate(LocalDate.of(2026, 3, 20));
        order.setCreatedAt(LocalDateTime.of(2026, 3, 16, 10, 0));

        PurchaseOrderItemJpaEntity item = new PurchaseOrderItemJpaEntity();
        item.setId(3L);
        item.setPurchaseOrder(order);
        item.setProduct(product);
        item.setOrderedQuantity(5);
        item.setReceivedQuantity(1);
        order.setItems(List.of(item));
        return order;
    }

    private static Product product() {
        Product product = new Product();
        product.setId(10L);
        return product;
    }
}