import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedData = {
    "restaurants": [
        {
            "name": "Poppo's Cafe",
            "menus": [
                { "name": "lunch", "menu_items": [{ "name": "Burger", "price": 9.00 }, { "name": "Small Salad", "price": 5.00 }] },
                { "name": "dinner", "menu_items": [{ "name": "Burger", "price": 15.00 }, { "name": "Large Salad", "price": 8.00 }] }
            ]
        },
        {
            "name": "Casa del Poppo",
            "menus": [
                { "name": "lunch", "dishes": [{ "name": "Chicken Wings", "price": 9.00 }, { "name": "Burger", "price": 9.00 }, { "name": "Chicken Wings", "price": 9.00 }] },
                { "name": "dinner", "dishes": [{ "name": "Mega \"Burger\"", "price": 22.00 }, { "name": "Lobster Mac & Cheese", "price": 31.00 }] }
            ]
        }
    ]
};

async function main() {
    console.log('Start seeding ...');

    for (const restaurantData of seedData.restaurants) {
        const restaurant = await prisma.restaurant.upsert({
            where: { name: restaurantData.name },
            update: {},
            create: { name: restaurantData.name },
        });
        console.log(`Created or found restaurant: ${restaurant.name}`);

        for (const menuData of restaurantData.menus) {
            const menu = await prisma.menu.create({
                data: {
                    name: menuData.name,
                    restaurantId: restaurant.id,
                },
            });
            console.log(`- Created menu: ${menu.name}`);

            const items = (menuData as any).menu_items || (menuData as any).dishes || [];

            for (const itemData of items) {
                const menuItem = await prisma.menuItem.upsert({
                    where: { name: itemData.name },
                    update: { price: itemData.price },
                    create: { name: itemData.name, price: itemData.price },
                });

                await prisma.menu.update({
                    where: { id: menu.id },
                    data: {
                        menuItems: {
                            connect: { id: menuItem.id },
                        },
                    },
                });
                console.log(`-- Added item '${menuItem.name}' to menu '${menu.name}'`);
            }
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });