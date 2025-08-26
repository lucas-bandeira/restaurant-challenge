import express, { Express, Request, Response } from 'express';
import menuRoutes from './routes/menuRoutes';

const app: Express = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.send('API is running...');
});

// Use menu routes
app.use('/api/menus', menuRoutes);

export default app;