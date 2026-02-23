CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(100) NOT NULL
);

ALTER TABLE products
    ADD COLUMN supplier_id BIGINT;

ALTER TABLE products
    ADD CONSTRAINT fk_products_supplier
    FOREIGN KEY (supplier_id)
    REFERENCES suppliers (id)
    ON DELETE SET NULL;
