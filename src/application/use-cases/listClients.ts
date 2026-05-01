import { Client } from '../../domain/entities/Client';
import { IClientRepository, ListClientFilters } from '../../domain/repositories/IClientRepository';

export class ListClientsUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(filters?: ListClientFilters): Promise<Client[]> {
    return this.clientRepository.list(filters);
  }
}
