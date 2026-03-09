package com.inventory.application.port.in;

import com.inventory.domain.model.PurchaseOrder;

import java.util.List;

public interface PurchaseOrderUseCase {
    List<PurchaseOrder> getAll();
    PurchaseOrder create(PurchaseOrder purchaseOrder);
    PurchaseOrder receive(Long id, PurchaseOrder receivePayload);
}
