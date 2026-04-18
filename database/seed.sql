USE beauty_accessories_system;

INSERT INTO categories (name, description) VALUES
('Makeup', 'Cosmetic products'),
('Accessories', 'Fashion accessories'),
('Skincare', 'Skin care collection');

INSERT INTO suppliers (name, phone, email, address, notes) VALUES
('Noor Cosmetics Supply', '0912345678', 'sales@noor.test', 'Tripoli', 'Main supplier'),
('Elegant Accessories Hub', '0921112233', 'hello@elegant.test', 'Benghazi', 'Accessories supplier');

INSERT INTO employees (full_name, phone, job_title, salary, hire_date) VALUES
('Admin User', '0900000000', 'System Administrator', 3500, '2026-01-01'),
('Manager User', '0900000001', 'Store Manager', 3000, '2026-01-05'),
('Cashier User', '0900000002', 'Cashier', 1800, '2026-01-10');

INSERT INTO users (employee_id, username, password_hash, role, status) VALUES
(1, 'admin', '$2b$10$gqEqQkp9TCVEjXgix66Sp.grCKm4BknaeYmcl7NobPR1u774IpJvC', 'admin', 'active'),
(2, 'manager', '$2b$10$gqEqQkp9TCVEjXgix66Sp.grCKm4BknaeYmcl7NobPR1u774IpJvC', 'manager', 'active'),
(3, 'cashier', '$2b$10$gqEqQkp9TCVEjXgix66Sp.grCKm4BknaeYmcl7NobPR1u774IpJvC', 'cashier', 'active');

INSERT INTO customers (full_name, phone, email, address) VALUES
('Walk In Customer', '0901002000', 'walkin@example.com', 'Tripoli');

INSERT INTO products (category_id, name, sku, barcode, description, cost_price, sale_price, stock_quantity, min_stock_level)
VALUES
(1, 'Matte Lipstick Ruby', 'COS-0001', '1111111111', 'Classic matte lipstick', 18.00, 30.00, 100, 10),
(2, 'Gold Hair Clip', 'ACC-0001', '2222222222', 'Premium accessory clip', 4.50, 10.00, 75, 15);
