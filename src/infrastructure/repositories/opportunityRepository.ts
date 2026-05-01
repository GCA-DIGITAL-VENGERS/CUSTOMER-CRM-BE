import { Opportunity } from '../../domain/entities/Opportunity';
import { CreateOpportunityData, IOpportunityRepository } from '../../domain/repositories/IOpportunityRepository';
import prisma from '../database/prismaClient';

export class PrismaOpportunityRepository implements IOpportunityRepository {
  async create(data: CreateOpportunityData): Promise<Opportunity> {
    const record = await prisma.opportunity.create({ data });
    return this.toEntity(record);
  }

  async findById(id: string): Promise<Opportunity | null> {
    const record = await prisma.opportunity.findUnique({ where: { id } });
    return record ? this.toEntity(record) : null;
  }

  async getByClientId(clienteId: string): Promise<Opportunity[]> {
    const records = await prisma.opportunity.findMany({
      where: { clienteId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toEntity(r));
  }

  async updateStage(id: string, etapa: string): Promise<Opportunity> {
    const record = await prisma.opportunity.update({
      where: { id },
      data: { etapa },
    });
    return this.toEntity(record);
  }

  private toEntity(record: {
    id: string;
    clienteId: string;
    titulo: string;
    valor: number;
    etapa: string;
    fechaCierre: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Opportunity {
    return new Opportunity({
      id: record.id,
      clienteId: record.clienteId,
      titulo: record.titulo,
      valor: record.valor,
      etapa: record.etapa,
      fechaCierre: record.fechaCierre,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
