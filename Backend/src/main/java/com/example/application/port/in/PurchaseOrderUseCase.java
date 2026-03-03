package com.example.application.port.in;

import com.example.domain.model.PurchaseOrder;

import java.util.List;

public interface PurchaseOrderUseCase {
    List<PurchaseOrder> getAll();
    PurchaseOrder create(PurchaseOrder purchaseOrder);
    PurchaseOrder receive(Long id, PurchaseOrder receivePayload);
}
