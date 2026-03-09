package com.inventory.application.dto;

import java.util.List;

public class SupplierDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private List<SupplierProductDTO> products;

    public SupplierDTO() {}

    public SupplierDTO(Long id, String name, String email, String phone, List<SupplierProductDTO> products) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.products = products;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public List<SupplierProductDTO> getProducts() { return products; }
    public void setProducts(List<SupplierProductDTO> products) { this.products = products; }
}
