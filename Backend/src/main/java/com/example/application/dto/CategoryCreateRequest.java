package com.example.application.dto;

import javax.validation.constraints.NotBlank;


public class CategoryCreateRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    public CategoryCreateRequest() {}

    public CategoryCreateRequest(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
