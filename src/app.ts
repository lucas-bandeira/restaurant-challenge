import express, { Express, Request, Response } from 'express';
import menuRoutes from './routes/menuRoutes';
import restaurantRoutes from './routes/restaurantRoutes';
import importRoutes from './routes/importRoutes';

const app: Express = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Use menu routes
app.use('/api/menus', menuRoutes);
// Use restaurant routes
app.use('/api/restaurants', restaurantRoutes);

app.use('/api/import', importRoutes);

export default app;