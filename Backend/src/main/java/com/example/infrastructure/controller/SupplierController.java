package com.example.infrastructure.controller;

import com.example.application.dto.ApiResponse;
import com.example.application.dto.SupplierCreateRequest;
import com.example.application.dto.SupplierDTO;
import com.example.application.dto.SupplierUpdateRequest;
import com.example.application.mapper.SupplierMapper;
import com.example.application.port.in.SupplierUseCase;
import com.example.domain.model.Supplier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierUseCase supplierUseCase;

    public SupplierController(SupplierUseCase supplierUseCase) {
        this.supplierUseCase = supplierUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SupplierDTO>> getAllSuppliers() {
        List<SupplierDTO> dtos = supplierUseCase.getAll().stream()
                .map(supplier -> SupplierMapper.toDTO(
                        supplier,
                        supplierUseCase.getProductsBySupplierId(supplier.getId())
                ))
                .collect(Collectors.toList());

        ApiResponse<SupplierDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.SupplierResponse<>(dtos)
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SupplierDTO>> createSupplier(@Valid @RequestBody SupplierCreateRequest request) {
        Supplier created = supplierUseCase.create(
                SupplierMapper.toDomainForCreate(request.getName(), request.getEmail(), request.getPhone())
        );

        SupplierDTO dto = SupplierMapper.toDTO(created, List.of());
        dto.setId(null);

        ApiResponse<SupplierDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.SupplierResponse<>(List.of(dto))
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SupplierDTO>> updateSupplier(
            @PathVariable Long id,
            @Valid @RequestBody SupplierUpdateRequest request) {
        Supplier updated = supplierUseCase.update(
                id,
                SupplierMapper.toDomainForCreate(request.getName(), request.getEmail(), request.getPhone())
        );

        SupplierDTO dto = SupplierMapper.toDTO(updated, List.of());
        dto.setId(null);

        ApiResponse<SupplierDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.SupplierResponse<>(List.of(dto))
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }
}
