package com.inventory.application.mapper;

import com.inventory.application.dto.SupplierDTO;
import com.inventory.application.dto.SupplierProductDTO;
import com.inventory.domain.model.Category;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;

import java.util.List;
import java.util.stream.Collectors;

public class SupplierMapper {

    public static SupplierDTO toDTO(Supplier supplier, List<Product> products) {
        return new SupplierDTO(
                supplier.getId(),
                supplier.getName(),
                supplier.getEmail(),
                supplier.getPhone(),
                toProductDTOs(products)
        );
    }

    public static Supplier toDomainForCreate(String name, String email, String phone) {
        return new Supplier(null, name, email, phone);
    }

    private static List<SupplierProductDTO> toProductDTOs(List<Product> products) {
        return products.stream()
                .map(product -> {
                    Category category = product.getCategory();
                    String categoryName = category != null ? category.getName() : null;
                    return new SupplierProductDTO(product.getId(), product.getName(), categoryName);
                })
                .collect(Collectors.toList());
    }
}
