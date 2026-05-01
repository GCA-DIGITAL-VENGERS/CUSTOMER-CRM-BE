import { v4 as uuidv4 } from 'uuid';
import { Client } from '../../domain/entities/Client';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

interface CreateClientInput {
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
}

export class CreateClientUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(input: CreateClientInput): Promise<Client> {
    const existing = await this.clientRepository.findByEmail(input.email);
    if (existing) throw new Error('Email already registered');

    return this.clientRepository.create({
      id: uuidv4(),
      nombre: input.nombre,
      email: input.email,
      telefono: input.telefono,
      empresa: input.empresa,
      estado: 'ACTIVO',
    });
  }
}
