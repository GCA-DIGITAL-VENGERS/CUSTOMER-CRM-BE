import { User } from '../../domain/entities/User';
import { CreateUserData, IUserRepository } from '../../domain/repositories/IUserRepository';
import prisma from '../database/prismaClient';

export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { email } });
    return record ? this.toEntity(record) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const record = await prisma.user.findUnique({ where: { username } });
    return record ? this.toEntity(record) : null;
  }

  async create(data: CreateUserData): Promise<User> {
    const record = await prisma.user.create({ data });
    return this.toEntity(record);
  }

  private toEntity(record: {
    id: string;
    username: string;
    email: string;
    password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User({
      id: record.id,
      username: record.username,
      email: record.email,
      password: record.password,
      isActive: record.isActive,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
