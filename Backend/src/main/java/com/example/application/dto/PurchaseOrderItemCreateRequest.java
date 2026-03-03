package com.example.application.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

public class PurchaseOrderItemCreateRequest {

    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    private Integer quantity;

    public PurchaseOrderItemCreateRequest() {}

    public PurchaseOrderItemCreateRequest(Long productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
