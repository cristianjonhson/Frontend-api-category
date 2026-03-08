package com.example.infrastructure.controller;

import com.example.application.port.in.PurchaseOrderUseCase;
import com.example.config.WebSecurityConfig;
import com.example.domain.model.Product;
import com.example.domain.model.PurchaseOrder;
import com.example.domain.model.PurchaseOrderItem;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PurchaseOrderController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(WebSecurityConfig.class)
class PurchaseOrderControllerWebMvcTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PurchaseOrderUseCase purchaseOrderUseCase;

    @Test
    void getAllReturnsPurchaseOrders() throws Exception {
        when(purchaseOrderUseCase.getAll()).thenReturn(List.of(sampleOrder("PENDING", 0, null)));

        mockMvc.perform(get("/api/purchase-orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.metadata[0].code").value("SUCCESS"))
                .andExpect(jsonPath("$.purchaseOrderResponse.purchaseOrder[0].orderNumber").value("OC-1"))
                .andExpect(jsonPath("$.purchaseOrderResponse.purchaseOrder[0].items[0].pendingQuantity").value(5));
    }

    @Test
    void receiveReturnsUpdatedOrder() throws Exception {
        when(purchaseOrderUseCase.receive(eq(1L), any(PurchaseOrder.class))).thenReturn(sampleOrder("RECEIVED", 5, LocalDateTime.of(2026, 3, 16, 12, 0)));

        mockMvc.perform(post("/api/purchase-orders/1/receive")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new ReceiveRequest(List.of(new ReceiveItemRequest(10L, 5))))) )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.purchaseOrderResponse.purchaseOrder[0].status").value("RECEIVED"))
                .andExpect(jsonPath("$.purchaseOrderResponse.purchaseOrder[0].items[0].receivedQuantity").value(5));
    }

    private static PurchaseOrder sampleOrder(String status, int receivedQuantity, LocalDateTime receivedAt) {
        Product product = new Product();
        product.setId(10L);
        product.setName("Cafe");

        PurchaseOrder order = new PurchaseOrder();
        order.setId(1L);
        order.setOrderNumber("OC-1");
        order.setSupplier(new Supplier(2L, "Acme", "acme@test.com", "123"));
        order.setStatus(status);
        order.setExpectedDate(LocalDate.of(2026, 3, 20));
        order.setCreatedAt(LocalDateTime.of(2026, 3, 16, 10, 0));
        order.setReceivedAt(receivedAt);
        order.setItems(List.of(new PurchaseOrderItem(3L, product, 5, receivedQuantity)));
        return order;
    }

    static class ReceiveRequest {
        public List<ReceiveItemRequest> items;

        ReceiveRequest(List<ReceiveItemRequest> items) {
            this.items = items;
        }
    }

    static class ReceiveItemRequest {
        public Long productId;
        public Integer quantity;

        ReceiveItemRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }
    }
}