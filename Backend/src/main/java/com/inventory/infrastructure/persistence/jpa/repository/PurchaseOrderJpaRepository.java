package com.inventory.infrastructure.persistence.jpa.repository;

import com.inventory.infrastructure.persistence.jpa.entity.PurchaseOrderJpaEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PurchaseOrderJpaRepository extends JpaRepository<PurchaseOrderJpaEntity, Long> {

    @Override
    @EntityGraph(attributePaths = {"supplier", "items", "items.product"})
    List<PurchaseOrderJpaEntity> findAll();

    @Override
    @EntityGraph(attributePaths = {"supplier", "items", "items.product"})
    Optional<PurchaseOrderJpaEntity> findById(Long id);
}
