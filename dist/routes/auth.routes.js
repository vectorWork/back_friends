"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_controller_1 = require("../controllers/auth.controller");
var router = (0, express_1.Router)();
router.post('/admin', auth_controller_1.validateAdmin);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map