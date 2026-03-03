package com.example.application.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class PurchaseOrderCreateRequest {

    @NotNull
    private Long supplierId;

    private LocalDate expectedDate;

    @Valid
    @NotEmpty
    private List<PurchaseOrderItemCreateRequest> items;

    public PurchaseOrderCreateRequest() {}

    public PurchaseOrderCreateRequest(Long supplierId, LocalDate expectedDate, List<PurchaseOrderItemCreateRequest> items) {
        this.supplierId = supplierId;
        this.expectedDate = expectedDate;
        this.items = items;
    }

    public Long getSupplierId() { return supplierId; }
    public void setSupplierId(Long supplierId) { this.supplierId = supplierId; }

    public LocalDate getExpectedDate() { return expectedDate; }
    public void setExpectedDate(LocalDate expectedDate) { this.expectedDate = expectedDate; }

    public List<PurchaseOrderItemCreateRequest> getItems() { return items; }
    public void setItems(List<PurchaseOrderItemCreateRequest> items) { this.items = items; }
}
