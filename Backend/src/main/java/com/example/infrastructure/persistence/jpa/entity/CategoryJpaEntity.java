package com.example.infrastructure.persistence.jpa.entity;

import javax.persistence.*;

@Entity
@Table(name = "categories")
public class CategoryJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false) // ✅ explícito por tu SQL
    private String name;

    @Column(nullable = false)
    private String description;

    public CategoryJpaEntity() {}

    public CategoryJpaEntity(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
