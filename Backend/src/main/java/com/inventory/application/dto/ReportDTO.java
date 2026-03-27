package com.inventory.application.dto;

import java.util.List;

public class ReportDTO {
    private int totalProducts;
    private int totalCategories;
    private int totalSuppliers;
    private int totalPurchaseOrders;
    private double totalStock;
    private List<ProductLowStockDTO> lowStockProducts;
    private List<SupplierProductCountDTO> supplierProductCount;

    public ReportDTO() {
    }

    public ReportDTO(int totalProducts, int totalCategories, int totalSuppliers, int totalPurchaseOrders,
            double totalStock, List<ProductLowStockDTO> lowStockProducts,
            List<SupplierProductCountDTO> supplierProductCount) {
        this.totalProducts = totalProducts;
        this.totalCategories = totalCategories;
        this.totalSuppliers = totalSuppliers;
        this.totalPurchaseOrders = totalPurchaseOrders;
        this.totalStock = totalStock;
        this.lowStockProducts = lowStockProducts;
        this.supplierProductCount = supplierProductCount;
    }

    public int getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(int totalProducts) {
        this.totalProducts = totalProducts;
    }

    public int getTotalCategories() {
        return totalCategories;
    }

    public void setTotalCategories(int totalCategories) {
        this.totalCategories = totalCategories;
    }

    public int getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(int totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public int getTotalPurchaseOrders() {
        return totalPurchaseOrders;
    }

    public void setTotalPurchaseOrders(int totalPurchaseOrders) {
        this.totalPurchaseOrders = totalPurchaseOrders;
    }

    public double getTotalStock() {
        return totalStock;
    }

    public void setTotalStock(double totalStock) {
        this.totalStock = totalStock;
    }

    public List<ProductLowStockDTO> getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(List<ProductLowStockDTO> lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public List<SupplierProductCountDTO> getSupplierProductCount() {
        return supplierProductCount;
    }

    public void setSupplierProductCount(List<SupplierProductCountDTO> supplierProductCount) {
        this.supplierProductCount = supplierProductCount;
    }
}
