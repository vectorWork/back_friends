import express from 'express';
import { connectDB } from './helper/mongoose.helper'; // Remove .js
import routes from './routes/index';
import 'dotenv/config';
import './helper/env.helper';
import { createAdmin } from './helper/admin.helper';
import { populateDatabaseFromJSON } from './helper/populateDatabase';

const app = express();

app.use(express.json());

connectDB(); // Establish database connection

// Use the main router for version 1 routes
app.use('/v1', routes);
createAdmin(); //crea usuario admin por defecto
populateDatabaseFromJSON()
const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
