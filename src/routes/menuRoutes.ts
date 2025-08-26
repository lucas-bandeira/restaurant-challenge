import { Router } from 'express';
import { getAllMenus } from '../controllers/menuController';

const router = Router();

router.get('/', getAllMenus);

export default router;