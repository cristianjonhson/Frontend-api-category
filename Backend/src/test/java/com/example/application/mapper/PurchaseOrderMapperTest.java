package com.example.application.mapper;

import com.example.application.dto.PurchaseOrderCreateRequest;
import com.example.application.dto.PurchaseOrderItemCreateRequest;
import com.example.application.dto.PurchaseOrderItemDTO;
import com.example.application.dto.PurchaseOrderReceiveItemRequest;
import com.example.application.dto.PurchaseOrderReceiveRequest;
import com.example.domain.model.Product;
import com.example.domain.model.PurchaseOrder;
import com.example.domain.model.PurchaseOrderItem;
import com.example.domain.model.Supplier;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class PurchaseOrderMapperTest {

    @Test
    void toDtoMapsSupplierAndPendingQuantities() {
        PurchaseOrder order = new PurchaseOrder(
                1L,
                "OC-1",
                new Supplier(2L, "Acme", "acme@test.com", "123"),
                "PARTIALLY_RECEIVED",
                LocalDate.of(2026, 3, 20),
                LocalDateTime.of(2026, 3, 16, 10, 0),
                null,
                List.of(new PurchaseOrderItem(3L, namedProduct(4L, "Cafe"), 10, 4))
        );

        PurchaseOrderItemDTO item = PurchaseOrderMapper.toDTO(order).getItems().get(0);

        assertEquals(2L, PurchaseOrderMapper.toDTO(order).getSupplierId());
        assertEquals("Acme", PurchaseOrderMapper.toDTO(order).getSupplierName());
        assertEquals(6, item.getPendingQuantity());
        assertEquals("Cafe", item.getProductName());
    }

    @Test
    void toDtoUsesEmptyItemsWhenDomainItemsAreNull() {
        PurchaseOrder order = new PurchaseOrder();
        order.setItems(null);

        assertTrue(PurchaseOrderMapper.toDTO(order).getItems().isEmpty());
    }

    @Test
    void toDomainForCreateMapsSupplierAndOrderedItems() {
        PurchaseOrderCreateRequest request = new PurchaseOrderCreateRequest(
                5L,
                LocalDate.of(2026, 3, 20),
                List.of(new PurchaseOrderItemCreateRequest(9L, 3))
        );

        PurchaseOrder order = PurchaseOrderMapper.toDomainForCreate(request);

        assertEquals(5L, order.getSupplier().getId());
        assertEquals(1, order.getItems().size());
        assertEquals(9L, order.getItems().get(0).getProduct().getId());
        assertEquals(3, order.getItems().get(0).getOrderedQuantity());
        assertEquals(0, order.getItems().get(0).getReceivedQuantity());
    }

    @Test
    void toDomainForReceiveMapsReceivedQuantities() {
        PurchaseOrderReceiveRequest request = new PurchaseOrderReceiveRequest(
                List.of(new PurchaseOrderReceiveItemRequest(9L, 2))
        );

        PurchaseOrder order = PurchaseOrderMapper.toDomainForReceive(request);

        assertEquals(1, order.getItems().size());
        assertEquals(9L, order.getItems().get(0).getProduct().getId());
        assertEquals(0, order.getItems().get(0).getOrderedQuantity());
        assertEquals(2, order.getItems().get(0).getReceivedQuantity());
    }

    private static Product namedProduct(Long id, String name) {
        Product product = new Product();
        product.setId(id);
        product.setName(name);
        return product;
    }
}