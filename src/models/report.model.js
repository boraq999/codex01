const { query } = require("../config/db");

const getDashboardSummary = async () => {
  const [counts] = await query(`
    SELECT
      (SELECT COUNT(1) FROM products WHERE status = 'active') AS active_products,
      (SELECT COUNT(1) FROM suppliers WHERE status = 'active') AS active_suppliers,
      (SELECT COUNT(1) FROM customers WHERE status = 'active') AS active_customers,
      (SELECT COUNT(1) FROM employees WHERE status = 'active') AS active_employees
  `);

  const [sales] = await query(`
    SELECT COALESCE(SUM(total_amount), 0) AS total_sales
    FROM sales
    WHERE status = 'completed'
  `);

  const [purchases] = await query(`
    SELECT COALESCE(SUM(total_amount), 0) AS total_purchases
    FROM purchases
    WHERE status = 'completed'
  `);

  const lowStockProducts = await query(`
    SELECT id, name, sku, stock_quantity, min_stock_level
    FROM products
    WHERE status = 'active' AND stock_quantity <= min_stock_level
    ORDER BY stock_quantity ASC
    LIMIT 20
  `);

  return {
    ...counts,
    total_sales: sales.total_sales,
    total_purchases: purchases.total_purchases,
    profit_estimate: Number(sales.total_sales) - Number(purchases.total_purchases),
    low_stock_products: lowStockProducts,
  };
};

const getSalesReport = async ({ from, to }) => {
  const params = { from, to };
  return query(
    `
      SELECT s.id, s.sale_no, s.sale_date, s.total_amount, s.payment_status, c.full_name AS customer_name
      FROM sales s
      LEFT JOIN customers c ON c.id = s.customer_id
      WHERE s.status = 'completed' AND DATE(s.sale_date) BETWEEN DATE(:from) AND DATE(:to)
      ORDER BY s.sale_date DESC
    `,
    params
  );
};

const getPurchasesReport = async ({ from, to }) => {
  const params = { from, to };
  return query(
    `
      SELECT p.id, p.purchase_no, p.purchase_date, p.total_amount, s.name AS supplier_name
      FROM purchases p
      LEFT JOIN suppliers s ON s.id = p.supplier_id
      WHERE p.status = 'completed' AND DATE(p.purchase_date) BETWEEN DATE(:from) AND DATE(:to)
      ORDER BY p.purchase_date DESC
    `,
    params
  );
};

module.exports = {
  getDashboardSummary,
  getSalesReport,
  getPurchasesReport,
};

