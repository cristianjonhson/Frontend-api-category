package com.inventory.application.service;

import com.inventory.application.dto.ProductLowStockDTO;
import com.inventory.application.dto.ReportDTO;
import com.inventory.application.dto.SupplierProductCountDTO;
import com.inventory.application.port.in.CategoryUseCase;
import com.inventory.application.port.in.ProductUseCase;
import com.inventory.application.port.in.PurchaseOrderUseCase;
import com.inventory.application.port.in.SupplierUseCase;
import com.inventory.domain.model.Category;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.PurchaseOrder;
import com.inventory.domain.model.Supplier;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private final ProductUseCase productUseCase;
    private final CategoryUseCase categoryUseCase;
    private final SupplierUseCase supplierUseCase;
    private final PurchaseOrderUseCase purchaseOrderUseCase;

    public ReportService(ProductUseCase productUseCase,
            CategoryUseCase categoryUseCase,
            SupplierUseCase supplierUseCase,
            PurchaseOrderUseCase purchaseOrderUseCase) {
        this.productUseCase = productUseCase;
        this.categoryUseCase = categoryUseCase;
        this.supplierUseCase = supplierUseCase;
        this.purchaseOrderUseCase = purchaseOrderUseCase;
    }

    /**
     * Genera un reporte básico con estadísticas generales del inventario
     *
     * @return ReportDTO con datos agregados
     */
    public ReportDTO generateBasicReport() {
        List<Product> products = productUseCase.getAll();
        List<Category> categories = categoryUseCase.getAll();
        List<Supplier> suppliers = supplierUseCase.getAll();
        List<PurchaseOrder> purchaseOrders = purchaseOrderUseCase.getAll();

        int totalProducts = products.size();
        int totalCategories = categories.size();
        int totalSuppliers = suppliers.size();
        int totalPurchaseOrders = purchaseOrders.size();
        double totalStock = calculateTotalStock(products);
        List<ProductLowStockDTO> lowStockProducts = getLowStockProducts(products, 5);
        List<SupplierProductCountDTO> supplierProductCount = getSupplierProductCount(products, 5);

        return new ReportDTO(
                totalProducts,
                totalCategories,
                totalSuppliers,
                totalPurchaseOrders,
                totalStock,
                lowStockProducts,
                supplierProductCount);
    }

    /**
     * Calcula el stock total de todos los productos
     */
    private double calculateTotalStock(List<Product> products) {
        return products.stream()
                .mapToDouble(p -> p.getQuantity().doubleValue())
                .sum();
    }

    /**
     * Obtiene los productos con menor stock
     */
    private List<ProductLowStockDTO> getLowStockProducts(List<Product> products, int limit) {
        return products.stream()
                .sorted(Comparator.comparing(Product::getQuantity))
                .limit(limit)
                .map(p -> new ProductLowStockDTO(
                        p.getId(),
                        p.getName(),
                        p.getCategory() != null ? p.getCategory().getName() : "Sin categoría",
                        p.getQuantity().intValue(),
                        p.getPrice().doubleValue()))
                .collect(Collectors.toList());
    }

    /**
     * Obtiene los proveedores con más productos asignados
     */
    private List<SupplierProductCountDTO> getSupplierProductCount(List<Product> products, int limit) {
        Map<Supplier, Integer> supplierProductMap = new HashMap<>();

        for (Product product : products) {
            if (product.getSupplier() != null) {
                supplierProductMap.put(
                        product.getSupplier(),
                        supplierProductMap.getOrDefault(product.getSupplier(), 0) + 1);
            }
        }

        return supplierProductMap.entrySet().stream()
                .sorted((e1, e2) -> e2.getValue().compareTo(e1.getValue()))
                .limit(limit)
                .map(e -> new SupplierProductCountDTO(
                        e.getKey().getId(),
                        e.getKey().getName(),
                        e.getValue()))
                .collect(Collectors.toList());
    }
}
