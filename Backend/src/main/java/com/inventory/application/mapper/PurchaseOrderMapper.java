package com.inventory.application.mapper;

import com.inventory.application.dto.PurchaseOrderCreateRequest;
import com.inventory.application.dto.PurchaseOrderDTO;
import com.inventory.application.dto.PurchaseOrderItemCreateRequest;
import com.inventory.application.dto.PurchaseOrderItemDTO;
import com.inventory.application.dto.PurchaseOrderReceiveItemRequest;
import com.inventory.application.dto.PurchaseOrderReceiveRequest;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.PurchaseOrder;
import com.inventory.domain.model.PurchaseOrderItem;
import com.inventory.domain.model.Supplier;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class PurchaseOrderMapper {

    public static PurchaseOrderDTO toDTO(PurchaseOrder domain) {
        Long supplierId = domain.getSupplier() != null ? domain.getSupplier().getId() : null;
        String supplierName = domain.getSupplier() != null ? domain.getSupplier().getName() : null;

        List<PurchaseOrderItemDTO> itemDTOs = domain.getItems() == null
                ? Collections.emptyList()
                : domain.getItems().stream()
                    .map(PurchaseOrderMapper::toItemDTO)
                    .collect(Collectors.toList());

        return new PurchaseOrderDTO(
                domain.getId(),
                domain.getOrderNumber(),
                supplierId,
                supplierName,
                domain.getStatus(),
                domain.getExpectedDate(),
                domain.getCreatedAt(),
                domain.getReceivedAt(),
                itemDTOs
        );
    }

    public static PurchaseOrder toDomainForCreate(PurchaseOrderCreateRequest request) {
        Supplier supplier = new Supplier(request.getSupplierId(), null, null, null);
        List<PurchaseOrderItem> items = request.getItems() == null
                ? Collections.emptyList()
                : request.getItems().stream().map(PurchaseOrderMapper::toCreateItemDomain).collect(Collectors.toList());

        PurchaseOrder order = new PurchaseOrder();
        order.setSupplier(supplier);
        order.setExpectedDate(request.getExpectedDate());
        order.setItems(items);

        return order;
    }

    public static PurchaseOrder toDomainForReceive(PurchaseOrderReceiveRequest request) {
        List<PurchaseOrderItem> items = request.getItems() == null
                ? Collections.emptyList()
                : request.getItems().stream().map(PurchaseOrderMapper::toReceiveItemDomain).collect(Collectors.toList());

        PurchaseOrder order = new PurchaseOrder();
        order.setItems(items);
        return order;
    }

    private static PurchaseOrderItemDTO toItemDTO(PurchaseOrderItem domain) {
        Long productId = domain.getProduct() != null ? domain.getProduct().getId() : null;
        String productName = domain.getProduct() != null ? domain.getProduct().getName() : null;
        int ordered = domain.getOrderedQuantity() != null ? domain.getOrderedQuantity() : 0;
        int received = domain.getReceivedQuantity() != null ? domain.getReceivedQuantity() : 0;
        int pending = Math.max(ordered - received, 0);

        return new PurchaseOrderItemDTO(
                domain.getId(),
                productId,
                productName,
                ordered,
                received,
                pending
        );
    }

    private static PurchaseOrderItem toCreateItemDomain(PurchaseOrderItemCreateRequest request) {
        Product product = new Product();
        product.setId(request.getProductId());

        return new PurchaseOrderItem(null, product, request.getQuantity(), 0);
    }

    private static PurchaseOrderItem toReceiveItemDomain(PurchaseOrderReceiveItemRequest request) {
        Product product = new Product();
        product.setId(request.getProductId());

        return new PurchaseOrderItem(null, product, 0, request.getQuantity());
    }
}
