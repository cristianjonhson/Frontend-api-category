package com.example.application.mapper;

import com.example.application.dto.SupplierDTO;
import com.example.application.dto.SupplierProductDTO;
import com.example.domain.model.Category;
import com.example.domain.model.Product;
import com.example.domain.model.Supplier;

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
