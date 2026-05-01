import { Contact } from '../../domain/entities/Contact';
import { IContactRepository } from '../../domain/repositories/IContactRepository';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

export class GetContactsByClientUseCase {
  constructor(
    private readonly contactRepository: IContactRepository,
    private readonly clientRepository: IClientRepository
  ) {}

  async execute(clienteId: string): Promise<Contact[]> {
    const client = await this.clientRepository.findById(clienteId);
    if (!client) throw new Error('Client not found');

    return this.contactRepository.getByClientId(clienteId);
  }
}
