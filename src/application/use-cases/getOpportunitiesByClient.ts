import { Opportunity } from '../../domain/entities/Opportunity';
import { IOpportunityRepository } from '../../domain/repositories/IOpportunityRepository';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

export class GetOpportunitiesByClientUseCase {
  constructor(
    private readonly opportunityRepository: IOpportunityRepository,
    private readonly clientRepository: IClientRepository
  ) {}

  async execute(clienteId: string): Promise<Opportunity[]> {
    const client = await this.clientRepository.findById(clienteId);
    if (!client) throw new Error('Client not found');

    return this.opportunityRepository.getByClientId(clienteId);
  }
}
