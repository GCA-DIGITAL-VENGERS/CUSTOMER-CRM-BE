import { Client } from '../../domain/entities/Client';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

export class DeactivateClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(id: string): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new Error('Client not found');

    if (!client.isActive()) throw new Error('Client is already inactive');

    return this.clientRepository.deactivate(id);
  }
}
