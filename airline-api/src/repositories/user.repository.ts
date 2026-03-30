import prisma from '../config/prisma';
import { User } from '@prisma/client';

export class UserRepository {
  async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
    });
  }

  async create(data: { username: string; passwordHash: string; role: string }) {
    return prisma.user.create({
      data
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id }
    });
  }
}
