package com.inventory.infrastructure.persistence.adapter;

import com.inventory.application.port.out.PurchaseOrderPersistencePort;
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
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class PurchaseOrderJpaAdapter implements PurchaseOrderPersistencePort {

    private final PurchaseOrderJpaRepository purchaseOrderRepo;
    private final SupplierJpaRepository supplierRepo;
    private final ProductJpaRepository productRepo;

    public PurchaseOrderJpaAdapter(
            PurchaseOrderJpaRepository purchaseOrderRepo,
            SupplierJpaRepository supplierRepo,
            ProductJpaRepository productRepo
    ) {
        this.purchaseOrderRepo = purchaseOrderRepo;
        this.supplierRepo = supplierRepo;
        this.productRepo = productRepo;
    }

    @Override
    public List<PurchaseOrder> findAll() {
        return purchaseOrderRepo.findAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<PurchaseOrder> findById(Long id) {
        return purchaseOrderRepo.findById(id).map(this::toDomain);
    }

    @Override
    public PurchaseOrder save(PurchaseOrder purchaseOrder) {
        PurchaseOrderJpaEntity saved = purchaseOrderRepo.save(toEntity(purchaseOrder));
        return toDomain(saved);
    }

    private PurchaseOrder toDomain(PurchaseOrderJpaEntity entity) {
        Supplier supplier = new Supplier(
                entity.getSupplier().getId(),
                entity.getSupplier().getName(),
                entity.getSupplier().getEmail(),
                entity.getSupplier().getPhone()
        );

        List<PurchaseOrderItem> items = entity.getItems().stream().map(itemEntity -> {
            ProductJpaEntity productEntity = itemEntity.getProduct();
            Product product = new Product(
                    productEntity.getId(),
                    productEntity.getName(),
                    productEntity.getPrice(),
                    productEntity.getQuantity(),
                    null,
                    null
            );

            return new PurchaseOrderItem(
                    itemEntity.getId(),
                    product,
                    itemEntity.getOrderedQuantity(),
                    itemEntity.getReceivedQuantity()
            );
        }).collect(Collectors.toList());

        return new PurchaseOrder(
                entity.getId(),
                entity.getOrderNumber(),
                supplier,
                entity.getStatus(),
                entity.getExpectedDate(),
                entity.getCreatedAt(),
                entity.getReceivedAt(),
                items
        );
    }

    private PurchaseOrderJpaEntity toEntity(PurchaseOrder domain) {
        PurchaseOrderJpaEntity entity = new PurchaseOrderJpaEntity();
        entity.setId(domain.getId());
        entity.setOrderNumber(domain.getOrderNumber());
        entity.setStatus(domain.getStatus());
        entity.setExpectedDate(domain.getExpectedDate());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setReceivedAt(domain.getReceivedAt());

        Long supplierId = domain.getSupplier() != null ? domain.getSupplier().getId() : null;
        if (supplierId != null) {
            SupplierJpaEntity supplierEntity = supplierRepo.getReferenceById(supplierId);
            entity.setSupplier(supplierEntity);
        }

        List<PurchaseOrderItemJpaEntity> itemEntities = new ArrayList<>();
        if (domain.getItems() != null) {
            for (PurchaseOrderItem item : domain.getItems()) {
                PurchaseOrderItemJpaEntity itemEntity = new PurchaseOrderItemJpaEntity();
                itemEntity.setId(item.getId());
                itemEntity.setPurchaseOrder(entity);
                itemEntity.setOrderedQuantity(item.getOrderedQuantity());
                itemEntity.setReceivedQuantity(item.getReceivedQuantity());

                Long productId = item.getProduct() != null ? item.getProduct().getId() : null;
                if (productId != null) {
                    ProductJpaEntity productEntity = productRepo.getReferenceById(productId);
                    itemEntity.setProduct(productEntity);
                }

                itemEntities.add(itemEntity);
            }
        }

        entity.setItems(itemEntities);
        return entity;
    }
}
