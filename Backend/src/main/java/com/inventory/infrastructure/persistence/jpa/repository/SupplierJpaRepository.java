package com.inventory.infrastructure.persistence.jpa.repository;

import com.inventory.infrastructure.persistence.jpa.entity.SupplierJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierJpaRepository extends JpaRepository<SupplierJpaEntity, Long> {
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
}
