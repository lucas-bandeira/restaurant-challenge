import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllMenus = async (req: Request, res: Response) => {
    try {
        const menus = await prisma.menu.findMany({
            include: {
                menuItems: true, // Include related menu items
            },
        });
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching menus.' });
    }
};