// src/tests/restaurants.test.ts
import request from 'supertest';
import app from '../app'; // Import your express app
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
    await prisma.menuItem.deleteMany({});
    await prisma.menu.deleteMany({});
    await prisma.restaurant.deleteMany({});

    const restaurant1 = await prisma.restaurant.create({
        data: { name: "Poppo's Cafe" }
    });
    const restaurant2 = await prisma.restaurant.create({
        data: { name: "Casa del Poppo" }
    });

    await prisma.menu.create({
        data: { name: 'Lunch', restaurantId: restaurant1.id }
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});


describe('GET /api/restaurants', () => {

    it('should return a list of all restaurants', async () => {
        const response = await request(app)
            .get('/api/restaurants')
            .expect('Content-Type', /json/)
            .expect(200);

        // Assertions to verify the response
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBe(2);
        expect(response.body[0].name).toBe("Poppo's Cafe");
        expect(response.body[0].menus).toBeInstanceOf(Array);
        expect(response.body[0].menus.length).toBe(1);
        expect(response.body[1].name).toBe("Casa del Poppo");
    });

});