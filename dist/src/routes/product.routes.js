"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var product_controller_1 = require("../controllers/product.controller");
var router = (0, express_1.Router)();
router.post('/products', product_controller_1.createProduct);
router.get('/products', product_controller_1.getAllProducts);
router.get('/products/:id', product_controller_1.getProductById);
router.put('/products/:id', product_controller_1.updateProductById);
router.delete('/products/:id', product_controller_1.deleteProductById);
exports.default = router;
//# sourceMappingURL=product.routes.js.map