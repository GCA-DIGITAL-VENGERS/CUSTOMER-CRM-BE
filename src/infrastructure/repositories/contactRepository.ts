import { Contact } from '../../domain/entities/Contact';
import { CreateContactData, IContactRepository } from '../../domain/repositories/IContactRepository';
import prisma from '../database/prismaClient';

export class PrismaContactRepository implements IContactRepository {
  async create(data: CreateContactData): Promise<Contact> {
    const record = await prisma.contact.create({ data });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Contact | null> {
    const record = await prisma.contact.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async getByClientId(clienteId: string): Promise<Contact[]> {
    const records = await prisma.contact.findMany({
      where: { clienteId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findByEmail(clienteId: string, email: string): Promise<Contact | null> {
    const record = await prisma.contact.findUnique({
      where: { clienteId_email: { clienteId, email } },
    });
    return record ? this.toEntity(record) : null;
  }

  private toEntity(record: {
    id: string;
    clienteId: string;
    nombre: string;
    cargo: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): Contact {
    return new Contact({
      id: record.id,
      clienteId: record.clienteId,
      nombre: record.nombre,
      cargo: record.cargo,
      email: record.email,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
