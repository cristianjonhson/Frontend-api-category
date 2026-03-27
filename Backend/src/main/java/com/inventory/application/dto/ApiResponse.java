package com.inventory.application.dto;

import java.util.List;

public class ApiResponse<T> {

    private List<Metadata> metadata;
    private CategoryResponse<T> categoryResponse;
    private ProductResponse<T> productResponse;
    private SupplierResponse<T> supplierResponse;
    private PurchaseOrderResponse<T> purchaseOrderResponse;
    private ReportResponse<T> reportResponse;

    public ApiResponse() {
    }

    public ApiResponse(List<Metadata> metadata, CategoryResponse<T> categoryResponse) {
        this.metadata = metadata;
        this.categoryResponse = categoryResponse;
    }

    public ApiResponse(List<Metadata> metadata, ProductResponse<T> productResponse) {
        this.metadata = metadata;
        this.productResponse = productResponse;
    }

    public ApiResponse(List<Metadata> metadata, SupplierResponse<T> supplierResponse) {
        this.metadata = metadata;
        this.supplierResponse = supplierResponse;
    }

    public ApiResponse(List<Metadata> metadata, PurchaseOrderResponse<T> purchaseOrderResponse) {
        this.metadata = metadata;
        this.purchaseOrderResponse = purchaseOrderResponse;
    }

    public ApiResponse(List<Metadata> metadata, ReportResponse<T> reportResponse) {
        this.metadata = metadata;
        this.reportResponse = reportResponse;
    }

    public List<Metadata> getMetadata() {
        return metadata;
    }

    public void setMetadata(List<Metadata> metadata) {
        this.metadata = metadata;
    }

    public CategoryResponse<T> getCategoryResponse() {
        return categoryResponse;
    }

    public void setCategoryResponse(CategoryResponse<T> categoryResponse) {
        this.categoryResponse = categoryResponse;
    }

    public ProductResponse<T> getProductResponse() {
        return productResponse;
    }

    public void setProductResponse(ProductResponse<T> productResponse) {
        this.productResponse = productResponse;
    }

    public SupplierResponse<T> getSupplierResponse() {
        return supplierResponse;
    }

    public void setSupplierResponse(SupplierResponse<T> supplierResponse) {
        this.supplierResponse = supplierResponse;
    }

    public PurchaseOrderResponse<T> getPurchaseOrderResponse() {
        return purchaseOrderResponse;
    }

    public void setPurchaseOrderResponse(PurchaseOrderResponse<T> purchaseOrderResponse) {
        this.purchaseOrderResponse = purchaseOrderResponse;
    }

    public ReportResponse<T> getReportResponse() {
        return reportResponse;
    }

    public void setReportResponse(ReportResponse<T> reportResponse) {
        this.reportResponse = reportResponse;
    }

    public static class Metadata {
        private String code;

        public Metadata() {
        }

        public Metadata(String code) {
            this.code = code;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

    public static class CategoryResponse<T> {
        private List<T> category;

        public CategoryResponse() {
        }

        public CategoryResponse(List<T> category) {
            this.category = category;
        }

        public List<T> getCategory() {
            return category;
        }

        public void setCategory(List<T> category) {
            this.category = category;
        }
    }

    public static class ProductResponse<T> {
        private List<T> product;

        public ProductResponse() {
        }

        public ProductResponse(List<T> product) {
            this.product = product;
        }

        public List<T> getProduct() {
            return product;
        }

        public void setProduct(List<T> product) {
            this.product = product;
        }
    }

    public static class SupplierResponse<T> {
        private List<T> supplier;

        public SupplierResponse() {
        }

        public SupplierResponse(List<T> supplier) {
            this.supplier = supplier;
        }

        public List<T> getSupplier() {
            return supplier;
        }

        public void setSupplier(List<T> supplier) {
            this.supplier = supplier;
        }
    }

    public static class PurchaseOrderResponse<T> {
        private List<T> purchaseOrder;

        public PurchaseOrderResponse() {
        }

        public PurchaseOrderResponse(List<T> purchaseOrder) {
            this.purchaseOrder = purchaseOrder;
        }

        public List<T> getPurchaseOrder() {
            return purchaseOrder;
        }

        public void setPurchaseOrder(List<T> purchaseOrder) {
            this.purchaseOrder = purchaseOrder;
        }
    }

    public static class ReportResponse<T> {
        private T report;

        public ReportResponse() {
        }

        public ReportResponse(T report) {
            this.report = report;
        }

        public T getReport() {
            return report;
        }

        public void setReport(T report) {
            this.report = report;
        }
    }
}
