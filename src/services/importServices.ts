import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const processImportData = async (data: any) => {
    const logs: string[] = [];

    for (const restaurantData of data.restaurants) {
        const restaurant = await prisma.restaurant.upsert({
            where: { name: restaurantData.name },
            update: {},
            create: { name: restaurantData.name },
        });

        for (const menuData of restaurantData.menus) {
            const menu = await prisma.menu.create({
                data: {
                    name: menuData.name,
                    restaurantId: restaurant.id,
                },
            });

            const items = menuData.menu_items || menuData.dishes || [];

            for (const itemData of items) {
                try {
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
                    logs.push(`SUCCESS: Imported '${itemData.name}' to menu '${menu.name}'.`);
                } catch (error) {
                    // @ts-ignore
                    logs.push(`FAIL: Could not import '${itemData.name}'. Error: ${error.message}`);
                }
            }
        }
    }
    return logs;
};