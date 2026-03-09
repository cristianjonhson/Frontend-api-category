package com.inventory.application.service;

import com.inventory.application.port.in.ProductUseCase;
import com.inventory.application.port.out.CategoryPersistencePort;
import com.inventory.application.port.out.ProductPersistencePort;
import com.inventory.application.port.out.SupplierPersistencePort;
import com.inventory.domain.model.Category;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;
import com.inventory.infrastructure.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService implements ProductUseCase {

    private final ProductPersistencePort productPersistence;
    private final CategoryPersistencePort categoryPersistence;
    private final SupplierPersistencePort supplierPersistence;

    public ProductService(
            ProductPersistencePort productPersistence,
            CategoryPersistencePort categoryPersistence,
            SupplierPersistencePort supplierPersistence
    ) {
        this.productPersistence = productPersistence;
        this.categoryPersistence = categoryPersistence;
        this.supplierPersistence = supplierPersistence;
    }

    @Override
    public List<Product> getAll() {
        return productPersistence.findAll();
    }

    @Override
    public Product create(Product product, Long categoryId, Long supplierId) {
        Category category = categoryPersistence.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        Supplier supplier = null;
        if (supplierId != null) {
            supplier = supplierPersistence.findById(supplierId)
                    .orElseThrow(() -> new NotFoundException("Supplier not found"));
        }

        product.setId(null);
        product.setCategory(category);
        product.setSupplier(supplier);

        return productPersistence.save(product);
    }

    @Override
    public Product update(Long id, Product product, Long categoryId, Long supplierId) {
        Product existing = productPersistence.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        Category category = categoryPersistence.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found"));

        Supplier supplier = null;
        if (supplierId != null) {
            supplier = supplierPersistence.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found"));
        }

        existing.setName(product.getName());
        existing.setPrice(product.getPrice());
        existing.setQuantity(product.getQuantity());
        existing.setCategory(category);
        existing.setSupplier(supplier);

        return productPersistence.save(existing);
    }

    @Override
    public void delete(Long id) {
        productPersistence.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        productPersistence.delete(id);
    }
}
