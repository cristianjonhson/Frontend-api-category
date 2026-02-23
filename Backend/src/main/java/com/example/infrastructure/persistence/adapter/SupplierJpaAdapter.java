package com.example.infrastructure.persistence.adapter;

import com.example.application.port.out.SupplierPersistencePort;
import com.example.domain.model.Supplier;
import com.example.infrastructure.persistence.jpa.entity.SupplierJpaEntity;
import com.example.infrastructure.persistence.jpa.repository.SupplierJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class SupplierJpaAdapter implements SupplierPersistencePort {

    private final SupplierJpaRepository supplierRepo;

    public SupplierJpaAdapter(SupplierJpaRepository supplierRepo) {
        this.supplierRepo = supplierRepo;
    }

    @Override
    public List<Supplier> findAll() {
        return supplierRepo.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Supplier> findById(Long id) {
        return supplierRepo.findById(id).map(this::toDomain);
    }

    @Override
    public Supplier save(Supplier supplier) {
        SupplierJpaEntity saved = supplierRepo.save(toEntity(supplier));
        return toDomain(saved);
    }

    @Override
    public void delete(Long id) {
        supplierRepo.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return supplierRepo.existsByEmail(email);
    }

    @Override
    public boolean existsByEmailAndIdNot(String email, Long id) {
        return supplierRepo.existsByEmailAndIdNot(email, id);
    }

    private Supplier toDomain(SupplierJpaEntity entity) {
        return new Supplier(
                entity.getId(),
                entity.getName(),
                entity.getEmail(),
                entity.getPhone()
        );
    }

    private SupplierJpaEntity toEntity(Supplier supplier) {
        return new SupplierJpaEntity(
                supplier.getId(),
                supplier.getName(),
                supplier.getEmail(),
                supplier.getPhone()
        );
    }
}
