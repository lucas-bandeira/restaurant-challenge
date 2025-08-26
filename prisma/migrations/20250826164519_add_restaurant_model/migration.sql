/*
  Warnings:

  - You are about to drop the column `menuId` on the `MenuItem` table. All the data in the column will be lost.
  - Added the required column `restaurantId` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuToMenuItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MenuToMenuItem_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MenuToMenuItem_B_fkey" FOREIGN KEY ("B") REFERENCES "MenuItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Menu" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    CONSTRAINT "Menu_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Menu" ("id", "name") SELECT "id", "name" FROM "Menu";
DROP TABLE "Menu";
ALTER TABLE "new_Menu" RENAME TO "Menu";
CREATE TABLE "new_MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL
);
INSERT INTO "new_MenuItem" ("id", "name", "price") SELECT "id", "name", "price" FROM "MenuItem";
DROP TABLE "MenuItem";
ALTER TABLE "new_MenuItem" RENAME TO "MenuItem";
CREATE UNIQUE INDEX "MenuItem_name_key" ON "MenuItem"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_name_key" ON "Restaurant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuToMenuItem_AB_unique" ON "_MenuToMenuItem"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuToMenuItem_B_index" ON "_MenuToMenuItem"("B");
