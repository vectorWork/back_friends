"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_helper_1 = require("./helper/mongoose.helper");
var index_1 = __importDefault(require("./routes/index"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
(0, mongoose_helper_1.connectDB)(); // Establish database connection
// Use the main router for all routes
app.use('/v1', index_1.default);
var port = parseInt(process.env.PORT || '3000');
app.listen(port, function () {
    console.log("listening on port ".concat(port));
});
//# sourceMappingURL=index.js.map