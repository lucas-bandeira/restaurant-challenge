// src/tests/import.test.ts
import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock data to be sent to the import endpoint
const importPayload = {
    "restaurants": [
        {
            "name": "Test Cafe",
            "menus": [
                { "name": "Test Lunch", "menu_items": [{ "name": "Test Burger", "price": 10.50 }] }
            ]
        }
    ]
};

describe('POST /api/import', () => {

    // Before each test, we ensure the database is clean.
    beforeEach(async () => {
        await prisma.menuItem.deleteMany({});
        await prisma.menu.deleteMany({});
        await prisma.restaurant.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should import data and return success logs', async () => {
        const response = await request(app)
            .post('/api/import')
            .send(importPayload)
            .expect('Content-Type', /json/)
            .expect(200);

        // 1. Check the response body (the logs)
        expect(response.body.status).toBe('Import processed');
        expect(response.body.results).toBeInstanceOf(Array);
        expect(response.body.results[0]).toContain("SUCCESS: Imported 'Test Burger'");

        // 2. Verify directly in the database that data was created
        const restaurantCount = await prisma.restaurant.count();
        expect(restaurantCount).toBe(1);

        const menuItem = await prisma.menuItem.findUnique({
            where: { name: 'Test Burger' }
        });
        expect(menuItem).not.toBeNull();
        expect(menuItem?.price).toBe(10.50);
    });
});