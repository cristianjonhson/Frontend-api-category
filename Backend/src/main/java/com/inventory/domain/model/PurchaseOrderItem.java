package com.inventory.domain.model;

public class PurchaseOrderItem {
    private Long id;
    private Product product;
    private Integer orderedQuantity;
    private Integer receivedQuantity;

    public PurchaseOrderItem() {}

    public PurchaseOrderItem(Long id, Product product, Integer orderedQuantity, Integer receivedQuantity) {
        this.id = id;
        this.product = product;
        this.orderedQuantity = orderedQuantity;
        this.receivedQuantity = receivedQuantity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Integer getOrderedQuantity() { return orderedQuantity; }
    public void setOrderedQuantity(Integer orderedQuantity) { this.orderedQuantity = orderedQuantity; }

    public Integer getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; }
}
