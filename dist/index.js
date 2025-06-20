import express from 'express';
import { connectDB } from './helper/mongoose.helper.js';
import routes from './routes/index.js';
var app = express();
app.use(express.json());
connectDB(); // Establish database connection
// Use the main router for version 1 routes
app.use('/v1', routes);
var port = parseInt(process.env.PORT || '3000');
app.listen(port, function () {
    console.log("listening on port ".concat(port));
});
//# sourceMappingURL=index.js.map