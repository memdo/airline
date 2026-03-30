/*
  Warnings:

  - You are about to drop the column `passengerName` on the `tickets` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tickets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ticketNumber" TEXT NOT NULL,
    "flightId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "isCheckedIn" BOOLEAN NOT NULL DEFAULT false,
    "purchasedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tickets_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "flights" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tickets" ("flightId", "id", "isCheckedIn", "purchasedAt", "seatNumber", "ticketNumber") SELECT "flightId", "id", "isCheckedIn", "purchasedAt", "seatNumber", "ticketNumber" FROM "tickets";
DROP TABLE "tickets";
ALTER TABLE "new_tickets" RENAME TO "tickets";
CREATE UNIQUE INDEX "tickets_ticketNumber_key" ON "tickets"("ticketNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
