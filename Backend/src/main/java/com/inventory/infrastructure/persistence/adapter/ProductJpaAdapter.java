package com.inventory.infrastructure.persistence.adapter;

import com.inventory.application.port.out.ProductPersistencePort;
import com.inventory.domain.model.Category;
import com.inventory.domain.model.Product;
import com.inventory.domain.model.Supplier;
import com.inventory.infrastructure.persistence.jpa.entity.CategoryJpaEntity;
import com.inventory.infrastructure.persistence.jpa.entity.ProductJpaEntity;
import com.inventory.infrastructure.persistence.jpa.entity.SupplierJpaEntity;
import com.inventory.infrastructure.persistence.jpa.repository.CategoryJpaRepository;
import com.inventory.infrastructure.persistence.jpa.repository.ProductJpaRepository;
import com.inventory.infrastructure.persistence.jpa.repository.SupplierJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ProductJpaAdapter implements ProductPersistencePort {

    private final ProductJpaRepository productRepo;
    private final CategoryJpaRepository categoryRepo;
    private final SupplierJpaRepository supplierRepo;

    public ProductJpaAdapter(
            ProductJpaRepository productRepo,
            CategoryJpaRepository categoryRepo,
            SupplierJpaRepository supplierRepo
    ) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.supplierRepo = supplierRepo;
    }

    @Override
    public List<Product> findAll() {
        return productRepo.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Product> findBySupplierId(Long supplierId) {
        return productRepo.findBySupplierId(supplierId).stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Product> findById(Long id) {
        return productRepo.findById(id).map(this::toDomain);
    }

    @Override
    public Product save(Product product) {
        ProductJpaEntity saved = productRepo.save(toEntity(product));
        return toDomain(saved);
    }

    @Override
    public void delete(Long id) {
        productRepo.deleteById(id);
    }

    private Product toDomain(ProductJpaEntity e) {
        CategoryJpaEntity categoryEntity = e.getCategory();
        Category category = new Category(
                categoryEntity.getId(),
                categoryEntity.getName(),
                categoryEntity.getDescription()
        );

        Supplier supplier = null;
        SupplierJpaEntity supplierEntity = e.getSupplier();
        if (supplierEntity != null) {
            supplier = new Supplier(
                supplierEntity.getId(),
                supplierEntity.getName(),
                supplierEntity.getEmail(),
                supplierEntity.getPhone()
            );
        }

        return new Product(
                e.getId(),
                e.getName(),
                e.getPrice(),
                e.getQuantity(),
            category,
            supplier
        );
    }

    private ProductJpaEntity toEntity(Product d) {
        CategoryJpaEntity categoryEntity;
        SupplierJpaEntity supplierEntity = null;

        if (d.getCategory() != null && d.getCategory().getId() != null) {
            categoryEntity = categoryRepo.getReferenceById(d.getCategory().getId());
        } else if (d.getId() != null) {
            ProductJpaEntity existing = productRepo.findById(d.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado para actualizar"));
            categoryEntity = existing.getCategory();
            supplierEntity = existing.getSupplier();
        } else {
            throw new IllegalArgumentException("Categoria es requerida");
        }

        if (d.getSupplier() != null && d.getSupplier().getId() != null) {
            supplierEntity = supplierRepo.getReferenceById(d.getSupplier().getId());
        }

        return new ProductJpaEntity(
                d.getId(),
                d.getName(),
                d.getPrice(),
                d.getQuantity(),
            categoryEntity,
            supplierEntity
        );
    }
}
