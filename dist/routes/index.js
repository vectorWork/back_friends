"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_routes_1 = __importDefault(require("./user.routes"));
var router = (0, express_1.Router)();
router.use('/users', user_routes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map