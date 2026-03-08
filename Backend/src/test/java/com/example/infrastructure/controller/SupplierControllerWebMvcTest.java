package com.example.infrastructure.controller;

import com.example.application.port.in.SupplierUseCase;
import com.example.config.WebSecurityConfig;
import com.example.domain.model.Category;
import com.example.domain.model.Product;
import com.example.domain.model.Supplier;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SupplierController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(WebSecurityConfig.class)
class SupplierControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private SupplierUseCase supplierUseCase;

    @Test
    void getAllReturnsSuppliersWithProducts() throws Exception {
        Supplier supplier = new Supplier(1L, "Acme", "acme@test.com", "123");
        Product product = new Product(10L, "Cafe", new BigDecimal("3.50"), 5, new Category(2L, "Bebidas", "Liquidos"));
        when(supplierUseCase.getAll()).thenReturn(List.of(supplier));
        when(supplierUseCase.getProductsBySupplierId(1L)).thenReturn(List.of(product));

        mockMvc.perform(get("/api/suppliers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metadata[0].code").value("SUCCESS"))
                .andExpect(jsonPath("$.supplierResponse.supplier[0].name").value("Acme"))
                .andExpect(jsonPath("$.supplierResponse.supplier[0].products[0].categoryName").value("Bebidas"));
    }

    @Test
    void createReturnsSupplierWithoutId() throws Exception {
        when(supplierUseCase.create(any(Supplier.class))).thenReturn(new Supplier(1L, "Acme", "acme@test.com", "123"));

        mockMvc.perform(post("/api/suppliers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SupplierRequest("Acme", "acme@test.com", "123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.supplierResponse.supplier[0].id").doesNotExist())
                .andExpect(jsonPath("$.supplierResponse.supplier[0].email").value("acme@test.com"));
    }

    static class SupplierRequest {
        public String name;
        public String email;
        public String phone;

        SupplierRequest(String name, String email, String phone) {
            this.name = name;
            this.email = email;
            this.phone = phone;
        }
    }
}