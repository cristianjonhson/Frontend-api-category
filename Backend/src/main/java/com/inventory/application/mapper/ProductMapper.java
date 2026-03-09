package com.inventory.application.mapper;

import com.inventory.application.dto.ProductDTO;
import com.inventory.domain.model.Category;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;

public class ProductMapper {

    public static ProductDTO toDTO(Product domain) {
        Category category = domain.getCategory();
        Supplier supplier = domain.getSupplier();
        Long categoryId = category != null ? category.getId() : null;
        String categoryName = category != null ? category.getName() : null;
        Long supplierId = supplier != null ? supplier.getId() : null;
        String supplierName = supplier != null ? supplier.getName() : null;

        return new ProductDTO(
                domain.getId(),
                domain.getName(),
                domain.getPrice(),
                domain.getQuantity(),
                categoryId,
                categoryName,
                supplierId,
                supplierName);
    }

    public static Product toDomainForCreate(String name, java.math.BigDecimal price, Integer quantity) {
        return new Product(null, name, price, quantity, null);
    }

    public static Product toDomainForCreate(String name, java.math.BigDecimal price, Integer quantity, Long supplierId) {
        Supplier supplier = supplierId != null ? new Supplier(supplierId, null, null, null) : null;
        return new Product(null, name, price, quantity, null, supplier);
    }
}
