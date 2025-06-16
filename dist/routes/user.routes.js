"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = __importDefault(require("../controllers/user.controller"));
var router = (0, express_1.Router)();
router.post('/', user_controller_1.default.createUser);
router.get('/', user_controller_1.default.getAllUsers);
router.get('/:id', user_controller_1.default.getUserById);
router.put('/:id', user_controller_1.default.updateUserById);
router.delete('/:id', user_controller_1.default.deleteUserById);
exports.default = router;
//# sourceMappingURL=user.routes.js.map