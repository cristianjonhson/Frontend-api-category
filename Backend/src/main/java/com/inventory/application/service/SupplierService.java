package com.inventory.application.service;

import com.inventory.application.port.in.SupplierUseCase;
import com.inventory.application.port.out.ProductPersistencePort;
import com.inventory.application.port.out.SupplierPersistencePort;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;
import com.inventory.infrastructure.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService implements SupplierUseCase {

    private final SupplierPersistencePort supplierPersistence;
    private final ProductPersistencePort productPersistence;

    public SupplierService(SupplierPersistencePort supplierPersistence, ProductPersistencePort productPersistence) {
        this.supplierPersistence = supplierPersistence;
        this.productPersistence = productPersistence;
    }

    @Override
    public List<Supplier> getAll() {
        return supplierPersistence.findAll();
    }

    @Override
    public Supplier create(Supplier supplier) {
        if (supplierPersistence.existsByEmail(supplier.getEmail())) {
            throw new IllegalArgumentException("Supplier email already exists");
        }

        supplier.setId(null);
        return supplierPersistence.save(supplier);
    }

    @Override
    public Supplier update(Long id, Supplier supplier) {
        Supplier existing = supplierPersistence.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));

        if (supplierPersistence.existsByEmailAndIdNot(supplier.getEmail(), id)) {
            throw new IllegalArgumentException("Supplier email already exists");
        }

        existing.setName(supplier.getName());
        existing.setEmail(supplier.getEmail());
        existing.setPhone(supplier.getPhone());

        return supplierPersistence.save(existing);
    }

    @Override
    public void delete(Long id) {
        supplierPersistence.findById(id)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));

        supplierPersistence.delete(id);
    }

    @Override
    public List<Product> getProductsBySupplierId(Long supplierId) {
        return productPersistence.findBySupplierId(supplierId);
    }
}
