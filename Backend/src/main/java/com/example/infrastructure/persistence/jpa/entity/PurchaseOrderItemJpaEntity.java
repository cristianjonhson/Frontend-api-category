package com.example.infrastructure.persistence.jpa.entity;

import javax.persistence.*;

@Entity
@Table(name = "purchase_order_items")
public class PurchaseOrderItemJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrderJpaEntity purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private ProductJpaEntity product;

    @Column(name = "ordered_quantity", nullable = false)
    private Integer orderedQuantity;

    @Column(name = "received_quantity", nullable = false)
    private Integer receivedQuantity;

    public PurchaseOrderItemJpaEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PurchaseOrderJpaEntity getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(PurchaseOrderJpaEntity purchaseOrder) { this.purchaseOrder = purchaseOrder; }

    public ProductJpaEntity getProduct() { return product; }
    public void setProduct(ProductJpaEntity product) { this.product = product; }

    public Integer getOrderedQuantity() { return orderedQuantity; }
    public void setOrderedQuantity(Integer orderedQuantity) { this.orderedQuantity = orderedQuantity; }

    public Integer getReceivedQuantity() { return receivedQuantity; }
    public void setReceivedQuantity(Integer receivedQuantity) { this.receivedQuantity = receivedQuantity; }
}
