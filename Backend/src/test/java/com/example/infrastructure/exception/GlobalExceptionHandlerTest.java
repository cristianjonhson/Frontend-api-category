package com.example.infrastructure.exception;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.HandlerMethod;

import java.lang.reflect.Method;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void handleValidationReturnsBadRequestWithMessage() throws Exception {
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new TestPayload(), "payload");
        bindingResult.addError(new FieldError("payload", "name", "name is required"));

        Method method = TestController.class.getDeclaredMethod("handle", TestPayload.class);
        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(new HandlerMethod(new TestController(), method).getMethodParameters()[0], bindingResult);

        ResponseEntity<?> response = handler.handleValidation(ex);
        Map<?, ?> body = (Map<?, ?>) response.getBody();

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("VALIDATION_ERROR", body.get("code"));
        assertEquals("name is required", body.get("message"));
    }

    @Test
    void handleGenericUsesFallbackMessageWhenExceptionMessageIsNull() {
        ResponseEntity<?> response = handler.handleGeneric(new Exception());
        Map<?, ?> body = (Map<?, ?>) response.getBody();

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("INTERNAL_ERROR", body.get("code"));
        assertEquals("Error interno inesperado", body.get("message"));
    }

    @Test
    void handleConflictReturnsConflictStatus() {
        ResponseEntity<?> response = handler.handleConflict(new ConflictException("duplicado"));
        Map<?, ?> body = (Map<?, ?>) response.getBody();

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("CONFLICT", body.get("code"));
        assertEquals("duplicado", body.get("message"));
    }

    @Test
    void handleDataIntegrityReturnsGenericConflictMessage() {
        ResponseEntity<?> response = handler.handleDataIntegrity(new DataIntegrityViolationException("fk"));
        Map<?, ?> body = (Map<?, ?>) response.getBody();

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("CONFLICT", body.get("code"));
        assertEquals("No se puede completar la operacion porque existen datos relacionados", body.get("message"));
    }

    static class TestController {
        public void handle(TestPayload payload) {
        }
    }

    static class TestPayload {
        private String name;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }
    }
}