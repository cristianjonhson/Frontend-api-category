CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(80) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL,
    status VARCHAR(40) NOT NULL,
    expected_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    received_at TIMESTAMP,
    CONSTRAINT fk_purchase_orders_supplier
        FOREIGN KEY (supplier_id)
        REFERENCES suppliers (id)
        ON DELETE RESTRICT
);

CREATE TABLE purchase_order_items (
    id SERIAL PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    ordered_quantity INTEGER NOT NULL,
    received_quantity INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT fk_purchase_order_items_order
        FOREIGN KEY (purchase_order_id)
        REFERENCES purchase_orders (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_purchase_order_items_product
        FOREIGN KEY (product_id)
        REFERENCES products (id)
        ON DELETE RESTRICT,
    CONSTRAINT chk_purchase_order_items_ordered_quantity CHECK (ordered_quantity > 0),
    CONSTRAINT chk_purchase_order_items_received_quantity CHECK (received_quantity >= 0),
    CONSTRAINT uq_purchase_order_items_order_product UNIQUE (purchase_order_id, product_id)
);

CREATE INDEX idx_purchase_orders_supplier_id ON purchase_orders (supplier_id);
CREATE INDEX idx_purchase_order_items_order_id ON purchase_order_items (purchase_order_id);
CREATE INDEX idx_purchase_order_items_product_id ON purchase_order_items (product_id);
