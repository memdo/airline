import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Admin Kullanıcısı Oluştur
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      passwordHash: passwordHash,
      role: 'admin',
    },
  });

  // 2. Örnek Uçuş Oluştur
  const dateFrom = new Date('2026-03-28T10:00:00Z');
  const dateTo = new Date('2026-03-28T12:00:00Z');

  const flight = await prisma.flight.upsert({
    where: { flightNumber_dateFrom: { flightNumber: '12345', dateFrom } },
    update: {},
    create: {
      flightNumber: '12345',
      dateFrom,
      dateTo,
      airportFrom: 'ADB',
      airportTo: 'IST',
      durationMinutes: 120,
      capacity: 150,
      availableSeats: 150,
    },
  });

  console.log('Seed data created: Admin user and Flight 12345');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
