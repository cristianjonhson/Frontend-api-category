package com.inventory.infrastructure.controller;

import com.inventory.application.dto.ReportDTO;
import com.inventory.application.service.ReportService;
import com.inventory.application.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    /**
     * Obtiene un reporte básico con estadísticas generales del inventario
     *
     * @return ReportDTO envuelto en ApiResponse
     */
    @GetMapping("/basic")
    public ResponseEntity<ApiResponse<ReportDTO>> getBasicReport() {
        ReportDTO report = reportService.generateBasicReport();
        ApiResponse<ReportDTO> response = new ApiResponse<>(
                List.of(new ApiResponse.Metadata("SUCCESS")),
                new ApiResponse.ReportResponse<>(report));
        return ResponseEntity.ok(response);
    }
}
