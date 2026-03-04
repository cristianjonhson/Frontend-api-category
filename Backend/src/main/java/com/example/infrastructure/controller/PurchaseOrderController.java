package com.example.infrastructure.controller;

import com.example.application.dto.ApiResponse;
import com.example.application.dto.PurchaseOrderCreateRequest;
import com.example.application.dto.PurchaseOrderDTO;
import com.example.application.dto.PurchaseOrderReceiveRequest;
import com.example.application.mapper.PurchaseOrderMapper;
import com.example.application.port.in.PurchaseOrderUseCase;
import com.example.domain.model.PurchaseOrder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderUseCase purchaseOrderUseCase;

    public PurchaseOrderController(PurchaseOrderUseCase purchaseOrderUseCase) {
        this.purchaseOrderUseCase = purchaseOrderUseCase;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PurchaseOrderDTO>> getAll() {
        List<PurchaseOrderDTO> dtos = purchaseOrderUseCase.getAll().stream()
                .map(PurchaseOrderMapper::toDTO)
                .collect(Collectors.toList());

        ApiResponse<PurchaseOrderDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.PurchaseOrderResponse<>(dtos)
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PurchaseOrderDTO>> create(
            @Valid @RequestBody PurchaseOrderCreateRequest request
    ) {
        PurchaseOrder created = purchaseOrderUseCase.create(PurchaseOrderMapper.toDomainForCreate(request));
        PurchaseOrderDTO dto = PurchaseOrderMapper.toDTO(created);

        ApiResponse<PurchaseOrderDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.PurchaseOrderResponse<>(List.of(dto))
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/receive")
    public ResponseEntity<ApiResponse<PurchaseOrderDTO>> receive(
            @PathVariable Long id,
            @Valid @RequestBody PurchaseOrderReceiveRequest request
    ) {
        PurchaseOrder updated = purchaseOrderUseCase.receive(id, PurchaseOrderMapper.toDomainForReceive(request));
        PurchaseOrderDTO dto = PurchaseOrderMapper.toDTO(updated);

        ApiResponse<PurchaseOrderDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.PurchaseOrderResponse<>(List.of(dto))
        );

        return ResponseEntity.ok(response);
    }
}
