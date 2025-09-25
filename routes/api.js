const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const profileController = require("../controllers/profileController");
const catalogController = require("../controllers/catalogController");
const orderController = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");

// === Rute Publik
router.get("/profile", profileController.getProfile);

// Katalog
router.get("/catalog", catalogController.getAllCatalogs);
router.get("/catalog/:id", catalogController.getCatalogById);

// Order
router.post("/orders", orderController.createOrder);

// === Rute Admin
router.post("/admin/login", adminController.loginAdmin);
router.post("/admin/register", adminController.registerAdmin);

// Profil WO
router.post("/profile", protect, profileController.createProfile);
router.put("/profile/:id", protect, profileController.updateProfile);
router.delete("/profile/:id", protect, profileController.deleteProfile);

// Katalog
router.post("/catalog", protect, catalogController.createCatalog);
router.put("/catalog/:id", protect, catalogController.updateCatalog);
router.delete("/catalog/:id", protect, catalogController.deleteCatalog);

// Order
router.get("/orders", protect, orderController.getAllOrders);
router.put("/orders/status/:id", protect, orderController.updateOrderStatus);

module.exports = router;
