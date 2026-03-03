package com.example.application.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PurchaseOrderDTO {
    private Long id;
    private String orderNumber;
    private Long supplierId;
    private String supplierName;
    private String status;
    private LocalDate expectedDate;
    private LocalDateTime createdAt;
    private LocalDateTime receivedAt;
    private List<PurchaseOrderItemDTO> items;

    public PurchaseOrderDTO() {}

    public PurchaseOrderDTO(
            Long id,
            String orderNumber,
            Long supplierId,
            String supplierName,
            String status,
            LocalDate expectedDate,
            LocalDateTime createdAt,
            LocalDateTime receivedAt,
            List<PurchaseOrderItemDTO> items
    ) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
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

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public String getSupplierName() { return supplierName; }
    public void setSupplierName(String supplierName) { this.supplierName = supplierName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDate getExpectedDate() { return expectedDate; }
    public void setExpectedDate(LocalDate expectedDate) { this.expectedDate = expectedDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReceivedAt() { return receivedAt; }
    public void setReceivedAt(LocalDateTime receivedAt) { this.receivedAt = receivedAt; }

    public List<PurchaseOrderItemDTO> getItems() { return items; }
    public void setItems(List<PurchaseOrderItemDTO> items) { this.items = items; }
}
