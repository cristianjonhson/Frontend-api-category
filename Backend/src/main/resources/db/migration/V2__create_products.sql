-- Crear tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    quantity INTEGER NOT NULL,
    category_id BIGINT NOT NULL,
    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories (id)
);
