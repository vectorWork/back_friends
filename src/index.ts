import express from 'express';
import { connectDB } from './helper/mongoose.helper';
import routes from './routes/index';

const app = express();

app.use(express.json());

connectDB(); // Establish database connection

// Use the main router for all routes
app.use('/v1', routes);

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
