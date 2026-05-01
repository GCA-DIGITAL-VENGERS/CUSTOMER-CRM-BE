import { Client } from '../entities/Client';

export interface CreateClientData {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  empresa: string;
  estado: string;
}

export interface UpdateClientData {
  nombre?: string;
  email?: string;
  telefono?: string;
  empresa?: string;
}

export interface ListClientFilters {
  estado?: string;
  empresa?: string;
}

export interface IClientRepository {
  create(data: CreateClientData): Promise<Client>;
  findById(id: string): Promise<Client | null>;
  findByEmail(email: string): Promise<Client | null>;
  list(filters?: ListClientFilters): Promise<Client[]>;
  update(id: string, data: UpdateClientData): Promise<Client>;
  deactivate(id: string): Promise<Client>;
}
