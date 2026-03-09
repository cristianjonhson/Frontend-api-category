package com.inventory.infrastructure.controller;

import com.inventory.application.dto.ApiResponse;
import com.inventory.application.dto.ProductCreateRequest;
import com.inventory.application.dto.ProductDTO;
import com.inventory.application.dto.ProductUpdateRequest;
import com.inventory.application.mapper.ProductMapper;
import com.inventory.application.port.in.ProductUseCase;
import com.inventory.domain.model.Product;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductUseCase productUseCase;

    public ProductController(ProductUseCase productUseCase) {
        this.productUseCase = productUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProductDTO>> getAllProducts() {
        List<ProductDTO> dtos = productUseCase.getAll().stream()
                .map(ProductMapper::toDTO)
                .collect(Collectors.toList());

        ApiResponse<ProductDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.ProductResponse<>(dtos)
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductDTO>> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        Product created = productUseCase.create(
                ProductMapper.toDomainForCreate(
                        request.getName(),
                        request.getPrice(),
                        request.getQuantity(),
                        request.getSupplierId()
                ),
                request.getCategoryId(),
                request.getSupplierId()
        );

        ProductDTO dto = ProductMapper.toDTO(created);
        dto.setId(null); // No retornar el id en la respuesta de creación
        dto.setCategoryId(null); // No retornar el categoryId en la respuesta

        ApiResponse<ProductDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.ProductResponse<>(List.of(dto))
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        Product updated = productUseCase.update(id,
                ProductMapper.toDomainForCreate(
                        request.getName(),
                        request.getPrice(),
                        request.getQuantity(),
                        request.getSupplierId()
                ),
                request.getCategoryId(),
                request.getSupplierId()
        );

        ProductDTO dto = ProductMapper.toDTO(updated);
        dto.setId(null); // No retornar el id en la respuesta de actualización
        dto.setCategoryId(null); // No retornar el categoryId en la respuesta

        ApiResponse<ProductDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.ProductResponse<>(List.of(dto))
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }
}
