package com.example.application.dto;

import java.util.List;

public class ApiResponse<T> {

    private List<Metadata> metadata;
    private CategoryResponse<T> categoryResponse;

    public ApiResponse() {}

    public ApiResponse(List<Metadata> metadata, CategoryResponse<T> categoryResponse) {
        this.metadata = metadata;
        this.categoryResponse = categoryResponse;
    }

    public List<Metadata> getMetadata() { return metadata; }
    public void setMetadata(List<Metadata> metadata) { this.metadata = metadata; }

    public CategoryResponse<T> getCategoryResponse() { return categoryResponse; }
    public void setCategoryResponse(CategoryResponse<T> categoryResponse) { this.categoryResponse = categoryResponse; }

    public static class Metadata {
        private String code;

        public Metadata() {}
        public Metadata(String code) { this.code = code; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }

    public static class CategoryResponse<T> {
        private List<T> category;

        public CategoryResponse() {}
        public CategoryResponse(List<T> category) { this.category = category; }

        public List<T> getCategory() { return category; }
        public void setCategory(List<T> category) { this.category = category; }
    }
}
