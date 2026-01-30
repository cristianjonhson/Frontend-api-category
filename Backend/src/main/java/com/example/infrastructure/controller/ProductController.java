package com.example.infrastructure.controller;

import com.example.application.dto.ApiResponse;
import com.example.application.dto.ProductCreateRequest;
import com.example.application.dto.ProductDTO;
import com.example.application.dto.ProductUpdateRequest;
import com.example.application.mapper.ProductMapper;
import com.example.application.port.in.ProductUseCase;
import com.example.domain.model.Product;
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
                ProductMapper.toDomainForCreate(request.getName(), request.getPrice(), request.getQuantity()),
                request.getCategoryId()
        );

        ApiResponse<ProductDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.ProductResponse<>(List.of(ProductMapper.toDTO(created)))
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDTO>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductUpdateRequest request) {
        Product updated = productUseCase.update(id,
                ProductMapper.toDomainForCreate(request.getName(), request.getPrice(), request.getQuantity()),
                request.getCategoryId()
        );

        ApiResponse<ProductDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.ProductResponse<>(List.of(ProductMapper.toDTO(updated)))
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productUseCase.delete(id);
        return ResponseEntity.noContent().build();
    }
}
