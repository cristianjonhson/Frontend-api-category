package com.example.infrastructure.persistence.adapter;

import com.example.application.port.out.ProductPersistencePort;
import com.example.domain.model.Category;
import com.example.domain.model.Product;
import com.example.infrastructure.persistence.jpa.entity.CategoryJpaEntity;
import com.example.infrastructure.persistence.jpa.entity.ProductJpaEntity;
import com.example.infrastructure.persistence.jpa.repository.CategoryJpaRepository;
import com.example.infrastructure.persistence.jpa.repository.ProductJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductJpaAdapter implements ProductPersistencePort {

    private final ProductJpaRepository productRepo;
    private final CategoryJpaRepository categoryRepo;

    public ProductJpaAdapter(ProductJpaRepository productRepo, CategoryJpaRepository categoryRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
    }

    @Override
    public List<Product> findAll() {
        return productRepo.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Product save(Product product) {
        ProductJpaEntity saved = productRepo.save(toEntity(product));
        return toDomain(saved);
    }

    private Product toDomain(ProductJpaEntity e) {
        CategoryJpaEntity categoryEntity = e.getCategory();
        Category category = new Category(
                categoryEntity.getId(),
                categoryEntity.getName(),
                categoryEntity.getDescription()
        );

        return new Product(
                e.getId(),
                e.getName(),
                e.getPrice(),
                e.getQuantity(),
                category
        );
    }

    private ProductJpaEntity toEntity(Product d) {
        Category category = d.getCategory();
        CategoryJpaEntity categoryEntity = categoryRepo.getReferenceById(category.getId());

        return new ProductJpaEntity(
                d.getId(),
                d.getName(),
                d.getPrice(),
                d.getQuantity(),
                categoryEntity
        );
    }
}
