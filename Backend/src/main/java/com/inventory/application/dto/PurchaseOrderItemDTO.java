package com.inventory.application.dto;

public class PurchaseOrderItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private Integer orderedQuantity;
    private Integer receivedQuantity;
    private Integer pendingQuantity;

    public PurchaseOrderItemDTO() {}

    public PurchaseOrderItemDTO(
            Long id,
            Long productId,
            String productName,
            Integer orderedQuantity,
            Integer receivedQuantity,
            Integer pendingQuantity
    ) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.orderedQuantity = orderedQuantity;
        this.receivedQuantity = receivedQuantity;
        this.pendingQuantity = pendingQuantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Integer getOrderedQuantity() { return orderedQuantity; }
    public void setOrderedQuantity(Integer orderedQuantity) { this.orderedQuantity = orderedQuantity; }

    public Integer getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; }

    public Integer getPendingQuantity() { return pendingQuantity; }
    public void setPendingQuantity(Integer pendingQuantity) { this.pendingQuantity = pendingQuantity; }
}
