package com.example.infrastructure.controller;

import com.example.application.port.in.ProductUseCase;
import com.example.config.WebSecurityConfig;
import com.example.domain.model.Category;
import com.example.domain.model.Product;
import com.example.domain.model.Supplier;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(WebSecurityConfig.class)
class ProductControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductUseCase productUseCase;

    @Test
    void getAllReturnsProductResponse() throws Exception {
        Product product = new Product(
                1L,
                "Cafe",
                new BigDecimal("12.50"),
                8,
                new Category(2L, "Bebidas", "Liquidos"),
                new Supplier(3L, "Acme", "acme@test.com", "123")
        );
        when(productUseCase.getAll()).thenReturn(List.of(product));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metadata[0].code").value("SUCCESS"))
                .andExpect(jsonPath("$.productResponse.product[0].name").value("Cafe"))
                .andExpect(jsonPath("$.productResponse.product[0].supplierName").value("Acme"));
    }

    @Test
    void createReturnsSanitizedProductResponse() throws Exception {
        Product created = new Product(
                10L,
                "Cafe",
                new BigDecimal("12.50"),
                8,
                new Category(2L, "Bebidas", "Liquidos"),
                new Supplier(3L, "Acme", "acme@test.com", "123")
        );
        when(productUseCase.create(any(Product.class), eq(2L), eq(3L))).thenReturn(created);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ProductRequest("Cafe", "12.50", 8, 2L, 3L))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productResponse.product[0].id").doesNotExist())
                .andExpect(jsonPath("$.productResponse.product[0].categoryId").doesNotExist())
                .andExpect(jsonPath("$.productResponse.product[0].name").value("Cafe"));
    }

    static class ProductRequest {
        public String name;
        public String price;
        public Integer quantity;
        public Long categoryId;
        public Long supplierId;

        ProductRequest(String name, String price, Integer quantity, Long categoryId, Long supplierId) {
            this.name = name;
            this.price = price;
            this.quantity = quantity;
            this.categoryId = categoryId;
            this.supplierId = supplierId;
        }
    }
}