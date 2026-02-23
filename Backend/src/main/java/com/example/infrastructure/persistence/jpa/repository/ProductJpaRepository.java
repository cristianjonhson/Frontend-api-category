package com.example.infrastructure.persistence.jpa.repository;

import com.example.infrastructure.persistence.jpa.entity.ProductJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductJpaRepository extends JpaRepository<ProductJpaEntity, Long> {
	List<ProductJpaEntity> findBySupplierId(Long supplierId);
}
