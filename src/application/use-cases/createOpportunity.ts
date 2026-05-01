import { v4 as uuidv4 } from 'uuid';
import { Opportunity } from '../../domain/entities/Opportunity';
import { IOpportunityRepository } from '../../domain/repositories/IOpportunityRepository';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

interface CreateOpportunityInput {
  clienteId: string;
  titulo: string;
  valor: number;
  fechaCierre: Date;
}

export class CreateOpportunityUseCase {
  constructor(
    private readonly opportunityRepository: IOpportunityRepository,
    private readonly clientRepository: IClientRepository
  ) {}

  async execute(input: CreateOpportunityInput): Promise<Opportunity> {
    const client = await this.clientRepository.findById(input.clienteId);
    if (!client) throw new Error('Client not found');

    if (input.valor <= 0) throw new Error('Valor must be greater than 0');
    if (new Date(input.fechaCierre) < new Date()) throw new Error('Fecha cierre must be in the future');

    return this.opportunityRepository.create({
      id: uuidv4(),
      clienteId: input.clienteId,
      titulo: input.titulo,
      valor: input.valor,
      fechaCierre: input.fechaCierre,
    });
  }
}
