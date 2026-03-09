package com.inventory.application.port.in;

import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;

import java.util.List;

public interface SupplierUseCase {
    List<Supplier> getAll();
    Supplier create(Supplier supplier);
    Supplier update(Long id, Supplier supplier);
    void delete(Long id);
    List<Product> getProductsBySupplierId(Long supplierId);
}
