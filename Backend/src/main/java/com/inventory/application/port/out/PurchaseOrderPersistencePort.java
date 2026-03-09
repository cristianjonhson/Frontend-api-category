package com.inventory.application.port.out;

import com.inventory.domain.model.PurchaseOrder;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderPersistencePort {
    List<PurchaseOrder> findAll();
    Optional<PurchaseOrder> findById(Long id);
    PurchaseOrder save(PurchaseOrder purchaseOrder);
}
