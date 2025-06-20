"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var category_controller_1 = require("../controllers/category.controller");
var router = (0, express_1.Router)();
router.post('/categories', category_controller_1.createCategory);
router.get('/categories', category_controller_1.getAllCategories);
router.get('/categories/:id', category_controller_1.getCategoryById);
router.put('/categories/:id', category_controller_1.updateCategoryById);
router.delete('/categories/:id', category_controller_1.deleteCategoryById);
exports.default = router;
//# sourceMappingURL=category.routes.js.map