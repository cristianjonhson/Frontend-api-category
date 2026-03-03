package com.example.application.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

public class PurchaseOrderReceiveRequest {

    @Valid
    @NotEmpty
    private List<PurchaseOrderReceiveItemRequest> items;

    public PurchaseOrderReceiveRequest() {}

    public PurchaseOrderReceiveRequest(List<PurchaseOrderReceiveItemRequest> items) {
        this.items = items;
    }

    public List<PurchaseOrderReceiveItemRequest> getItems() { return items; }
    public void setItems(List<PurchaseOrderReceiveItemRequest> items) { this.items = items; }
}
