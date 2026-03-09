package com.inventory.application.service;

import com.inventory.application.port.in.PurchaseOrderUseCase;
import com.inventory.application.port.out.ProductPersistencePort;
import com.inventory.application.port.out.PurchaseOrderPersistencePort;
import com.inventory.application.port.out.SupplierPersistencePort;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.PurchaseOrder;
import com.inventory.domain.model.PurchaseOrderItem;
import com.inventory.domain.model.Supplier;
import com.inventory.infrastructure.exception.ConflictException;
import com.inventory.infrastructure.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PurchaseOrderService implements PurchaseOrderUseCase {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_PARTIAL = "PARTIALLY_RECEIVED";
    private static final String STATUS_RECEIVED = "RECEIVED";

    private final PurchaseOrderPersistencePort purchaseOrderPersistence;
    private final SupplierPersistencePort supplierPersistence;
    private final ProductPersistencePort productPersistence;

    public PurchaseOrderService(
            PurchaseOrderPersistencePort purchaseOrderPersistence,
            SupplierPersistencePort supplierPersistence,
            ProductPersistencePort productPersistence
    ) {
        this.purchaseOrderPersistence = purchaseOrderPersistence;
        this.supplierPersistence = supplierPersistence;
        this.productPersistence = productPersistence;
    }

    @Override
    public List<PurchaseOrder> getAll() {
        return purchaseOrderPersistence.findAll();
    }

    @Override
    @Transactional
    public PurchaseOrder create(PurchaseOrder purchaseOrder) {
        Long supplierId = purchaseOrder.getSupplier() != null ? purchaseOrder.getSupplier().getId() : null;
        if (supplierId == null) {
            throw new IllegalArgumentException("Supplier is required");
        }

        Supplier supplier = supplierPersistence.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));

        List<PurchaseOrderItem> requestItems = purchaseOrder.getItems();
        if (requestItems == null || requestItems.isEmpty()) {
            throw new IllegalArgumentException("At least one purchase order item is required");
        }

        Map<Long, PurchaseOrderItem> mergedByProduct = new LinkedHashMap<>();
        for (PurchaseOrderItem requestItem : requestItems) {
            Long productId = requestItem.getProduct() != null ? requestItem.getProduct().getId() : null;
            Integer orderedQuantity = requestItem.getOrderedQuantity();

            if (productId == null) {
                throw new IllegalArgumentException("Product id is required in all items");
            }
            if (orderedQuantity == null || orderedQuantity <= 0) {
                throw new IllegalArgumentException("Ordered quantity must be greater than zero");
            }

            Product product = productPersistence.findById(productId)
                    .orElseThrow(() -> new NotFoundException("Product not found"));

            if (product.getSupplier() != null
                    && product.getSupplier().getId() != null
                    && !supplierId.equals(product.getSupplier().getId())) {
                throw new ConflictException("El producto " + product.getName() + " no pertenece al proveedor seleccionado");
            }

            PurchaseOrderItem existing = mergedByProduct.get(productId);
            if (existing == null) {
                mergedByProduct.put(productId, new PurchaseOrderItem(null, product, orderedQuantity, 0));
            } else {
                existing.setOrderedQuantity(existing.getOrderedQuantity() + orderedQuantity);
            }
        }

        PurchaseOrder orderToSave = new PurchaseOrder();
        orderToSave.setOrderNumber(generateOrderNumber());
        orderToSave.setSupplier(supplier);
        orderToSave.setStatus(STATUS_PENDING);
        orderToSave.setExpectedDate(purchaseOrder.getExpectedDate());
        orderToSave.setCreatedAt(LocalDateTime.now());
        orderToSave.setReceivedAt(null);
        orderToSave.setItems(mergedByProduct.values().stream().collect(Collectors.toList()));

        return purchaseOrderPersistence.save(orderToSave);
    }

    @Override
    @Transactional
    public PurchaseOrder receive(Long id, PurchaseOrder receivePayload) {
        PurchaseOrder existingOrder = purchaseOrderPersistence.findById(id)
                .orElseThrow(() -> new NotFoundException("Purchase order not found"));

        if (STATUS_RECEIVED.equals(existingOrder.getStatus())) {
            throw new ConflictException("La orden ya fue recibida completamente");
        }

        List<PurchaseOrderItem> receiveItems = receivePayload.getItems();
        if (receiveItems == null || receiveItems.isEmpty()) {
            throw new IllegalArgumentException("At least one received item is required");
        }

        Map<Long, PurchaseOrderItem> orderItemsByProductId = existingOrder.getItems().stream()
                .filter(item -> item.getProduct() != null && item.getProduct().getId() != null)
                .collect(Collectors.toMap(item -> item.getProduct().getId(), item -> item));

        for (PurchaseOrderItem receiveItem : receiveItems) {
            Long productId = receiveItem.getProduct() != null ? receiveItem.getProduct().getId() : null;
            Integer receivedQuantity = receiveItem.getReceivedQuantity();

            if (productId == null) {
                throw new IllegalArgumentException("Product id is required in receive items");
            }
            if (receivedQuantity == null || receivedQuantity <= 0) {
                throw new IllegalArgumentException("Received quantity must be greater than zero");
            }

            PurchaseOrderItem existingItem = orderItemsByProductId.get(productId);
            if (existingItem == null) {
                throw new ConflictException("El producto con id " + productId + " no pertenece a la orden de compra");
            }

            int currentReceived = existingItem.getReceivedQuantity() != null ? existingItem.getReceivedQuantity() : 0;
            int ordered = existingItem.getOrderedQuantity() != null ? existingItem.getOrderedQuantity() : 0;
            int pending = ordered - currentReceived;

            if (receivedQuantity > pending) {
                throw new ConflictException(
                        "La cantidad recibida para el producto " + existingItem.getProduct().getName()
                                + " supera la cantidad pendiente"
                );
            }

            existingItem.setReceivedQuantity(currentReceived + receivedQuantity);

                Product productToUpdate = productPersistence.findById(productId)
                    .orElseThrow(() -> new NotFoundException("Product not found"));
                int currentStock = productToUpdate.getQuantity() != null ? productToUpdate.getQuantity() : 0;
                productToUpdate.setQuantity(currentStock + receivedQuantity);
                productPersistence.save(productToUpdate);
        }

        boolean allReceived = existingOrder.getItems().stream().allMatch(item -> {
            int ordered = item.getOrderedQuantity() != null ? item.getOrderedQuantity() : 0;
            int received = item.getReceivedQuantity() != null ? item.getReceivedQuantity() : 0;
            return received >= ordered;
        });

        existingOrder.setStatus(allReceived ? STATUS_RECEIVED : STATUS_PARTIAL);
        if (allReceived) {
            existingOrder.setReceivedAt(LocalDateTime.now());
        }

        return purchaseOrderPersistence.save(existingOrder);
    }

    private String generateOrderNumber() {
        return "OC-" + System.currentTimeMillis();
    }
}
