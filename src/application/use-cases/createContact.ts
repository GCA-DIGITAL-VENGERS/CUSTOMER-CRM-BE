import { v4 as uuidv4 } from 'uuid';
import { Contact } from '../../domain/entities/Contact';
import { IContactRepository } from '../../domain/repositories/IContactRepository';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

interface CreateContactInput {
  clienteId: string;
  nombre: string;
  cargo: string;
  email: string;
}

export class CreateContactUseCase {
  constructor(
    private readonly contactRepository: IContactRepository,
    private readonly clientRepository: IClientRepository
  ) {}

  async execute(input: CreateContactInput): Promise<Contact> {
    const client = await this.clientRepository.findById(input.clienteId);
    if (!client) throw new Error('Client not found');

    const existing = await this.contactRepository.findByEmail(input.clienteId, input.email);
    if (existing) throw new Error('Contact with this email already exists for this client');

    return this.contactRepository.create({
      id: uuidv4(),
      clienteId: input.clienteId,
      nombre: input.nombre,
      cargo: input.cargo,
      email: input.email,
    });
  }
}
