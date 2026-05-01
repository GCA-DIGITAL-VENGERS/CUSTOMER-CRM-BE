import { Client } from '../../domain/entities/Client';
import { CreateClientData, IClientRepository, ListClientFilters, UpdateClientData } from '../../domain/repositories/IClientRepository';
import prisma from '../database/prismaClient';

export class PrismaClientRepository implements IClientRepository {
  async create(data: CreateClientData): Promise<Client> {
    const record = await prisma.client.create({ data });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Client | null> {
    const record = await prisma.client.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async findByEmail(email: string): Promise<Client | null> {
    const record = await prisma.client.findUnique({ where: { email } });
    return record ? this.toEntity(record) : null;
  }

  async list(filters?: ListClientFilters): Promise<Client[]> {
    const where: any = {};

    if (filters?.estado) {
      where.estado = filters.estado;
    }

    if (filters?.empresa) {
      where.empresa = {
        contains: filters.empresa,
        mode: 'insensitive',
      };
    }

    const records = await prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => this.toEntity(record));
  }

  async update(id: string, data: UpdateClientData): Promise<Client> {
    const record = await prisma.client.update({
      where: { id },
      data,
    });
    return this.toEntity(record);
  }

  async deactivate(id: string): Promise<Client> {
    const record = await prisma.client.update({
      where: { id },
      data: { estado: 'INACTIVO' },
    });
    return this.toEntity(record);
  }

  private toEntity(record: {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    empresa: string;
    estado: string;
    createdAt: Date;
    updatedAt: Date;
  }): Client {
    return new Client({
      id: record.id,
      nombre: record.nombre,
      email: record.email,
      telefono: record.telefono,
      empresa: record.empresa,
      estado: record.estado,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
