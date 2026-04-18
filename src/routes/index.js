const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const categoryRoutes = require("./category.routes");
const supplierRoutes = require("./supplier.routes");
const employeeRoutes = require("./employee.routes");
const customerRoutes = require("./customer.routes");
const productRoutes = require("./product.routes");
const purchaseRoutes = require("./purchase.routes");
const saleRoutes = require("./sale.routes");
const inventoryRoutes = require("./inventory.routes");
const activityLogRoutes = require("./activityLog.routes");
const saleReturnRoutes = require("./saleReturn.routes");
const reportRoutes = require("./report.routes");
const authRoutes = require("./auth.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use(authMiddleware);
router.use("/categories", categoryRoutes);
router.use("/suppliers", supplierRoutes);
router.use("/employees", employeeRoutes);
router.use("/customers", customerRoutes);
router.use("/products", productRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/sales", saleRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/activity-logs", activityLogRoutes);
router.use("/returns", saleReturnRoutes);
router.use("/reports", reportRoutes);

module.exports = router;
