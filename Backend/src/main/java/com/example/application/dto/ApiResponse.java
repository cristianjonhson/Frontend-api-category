package com.example.application.dto;

import java.util.List;

public class ApiResponse<T> {

    private List<Metadata> metadata;
    private CategoryResponse<T> categoryResponse;
    private ProductResponse<T> productResponse;

    public ApiResponse() {}

    public ApiResponse(List<Metadata> metadata, CategoryResponse<T> categoryResponse) {
        this.metadata = metadata;
        this.categoryResponse = categoryResponse;
    }

    public ApiResponse(List<Metadata> metadata, ProductResponse<T> productResponse) {
        this.metadata = metadata;
        this.productResponse = productResponse;
    }

    public List<Metadata> getMetadata() { return metadata; }
    public void setMetadata(List<Metadata> metadata) { this.metadata = metadata; }

    public CategoryResponse<T> getCategoryResponse() { return categoryResponse; }
    public void setCategoryResponse(CategoryResponse<T> categoryResponse) { this.categoryResponse = categoryResponse; }

    public ProductResponse<T> getProductResponse() { return productResponse; }
    public void setProductResponse(ProductResponse<T> productResponse) { this.productResponse = productResponse; }

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

    public static class ProductResponse<T> {
        private List<T> product;

        public ProductResponse() {}
        public ProductResponse(List<T> product) { this.product = product; }

        public List<T> getProduct() { return product; }
        public void setProduct(List<T> product) { this.product = product; }
    }
}
