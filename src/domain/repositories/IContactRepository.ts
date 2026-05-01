import { Contact } from '../entities/Contact';

export interface CreateContactData {
  id: string;
  clienteId: string;
  nombre: string;
  cargo: string;
  email: string;
}

export interface IContactRepository {
  create(data: CreateContactData): Promise<Contact>;
  findById(id: string): Promise<Contact | null>;
  getByClientId(clienteId: string): Promise<Contact[]>;
  findByEmail(clienteId: string, email: string): Promise<Contact | null>;
}
