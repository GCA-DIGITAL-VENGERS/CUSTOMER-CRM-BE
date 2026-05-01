import { Client } from '../../domain/entities/Client';
import { IClientRepository, UpdateClientData } from '../../domain/repositories/IClientRepository';

export class UpdateClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(id: string, input: UpdateClientData): Promise<Client> {
    const client = await this.clientRepository.findById(id);
    if (!client) throw new Error('Client not found');

    if (input.email && input.email !== client.email) {
      const existing = await this.clientRepository.findByEmail(input.email);
      if (existing) throw new Error('Email already registered');
    }

    return this.clientRepository.update(id, input);
  }
}
