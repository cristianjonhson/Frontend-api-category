package com.inventory.domain.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class PurchaseOrder {
    private Long id;
    private String orderNumber;
    private Supplier supplier;
    private String status;
    private LocalDate expectedDate;
    private LocalDateTime createdAt;
    private LocalDateTime receivedAt;
    private List<PurchaseOrderItem> items = new ArrayList<>();

    public PurchaseOrder() {}

    public PurchaseOrder(
            Long id,
            String orderNumber,
            Supplier supplier,
            String status,
            LocalDate expectedDate,
            LocalDateTime createdAt,
            LocalDateTime receivedAt,
            List<PurchaseOrderItem> items
    ) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.supplier = supplier;
        this.status = status;
        this.expectedDate = expectedDate;
        this.createdAt = createdAt;
        this.receivedAt = receivedAt;
        this.items = items;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Supplier getSupplier() { return supplier; }
    public void setSupplier(Supplier supplier) { this.supplier = supplier; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getExpectedDate() { return expectedDate; }
    public void setExpectedDate(LocalDate expectedDate) { this.expectedDate = expectedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }

    public List<PurchaseOrderItem> getItems() { return items; }
    public void setItems(List<PurchaseOrderItem> items) { this.items = items; }
}
