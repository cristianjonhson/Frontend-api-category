package com.example.application.port.out;

import com.example.domain.model.Supplier;

import java.util.List;
import java.util.Optional;

public interface SupplierPersistencePort {
    List<Supplier> findAll();
    Optional<Supplier> findById(Long id);
    Supplier save(Supplier supplier);
    void delete(Long id);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
}
