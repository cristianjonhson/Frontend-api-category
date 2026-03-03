package com.example.infrastructure.persistence.jpa.repository;

import com.example.infrastructure.persistence.jpa.entity.ProductJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductJpaRepository extends JpaRepository<ProductJpaEntity, Long> {
	List<ProductJpaEntity> findBySupplierId(Long supplierId);

	@Query("SELECT COUNT(p) > 0 FROM ProductJpaEntity p WHERE p.category.id = :categoryId")
	boolean existsByCategoryId(@Param("categoryId") Long categoryId);
}
