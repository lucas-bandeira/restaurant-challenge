// src/routes/restaurantRoutes.ts
import { Router } from 'express';
import { getAllRestaurants } from '../controllers/restaurantController';

const router = Router();

router.get('/', getAllRestaurants);

export default router;