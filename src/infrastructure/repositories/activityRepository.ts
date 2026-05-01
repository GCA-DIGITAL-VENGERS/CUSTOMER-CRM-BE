import { Activity } from '../../domain/entities/Activity';
import { CreateActivityData, IActivityRepository } from '../../domain/repositories/IActivityRepository';
import prisma from '../database/prismaClient';

export class PrismaActivityRepository implements IActivityRepository {
  async create(data: CreateActivityData): Promise<Activity> {
    const record = await prisma.activity.create({ data });
    return this.toEntity(record);
  }

  async getByClientId(clienteId: string): Promise<Activity[]> {
    const records = await prisma.activity.findMany({
      where: { clienteId },
      orderBy: { fecha: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<Activity | null> {
    const record = await prisma.activity.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  private toEntity(record: {
    id: string;
    clienteId: string;
    tipo: string;
    descripcion: string;
    fecha: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Activity {
    return new Activity({
      id: record.id,
      clienteId: record.clienteId,
      tipo: record.tipo,
      descripcion: record.descripcion,
      fecha: record.fecha,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
