import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await prisma.restaurant.findMany({
            include: {
                menus: true, // Include related menus
            },
        });
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching restaurants.' });
    }
};