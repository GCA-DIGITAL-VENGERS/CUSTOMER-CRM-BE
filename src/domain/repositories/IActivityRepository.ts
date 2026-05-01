import { Activity } from '../entities/Activity';

export interface CreateActivityData {
  id: string;
  clienteId: string;
  tipo: string;
  descripcion: string;
  fecha: Date;
}

export interface IActivityRepository {
  create(data: CreateActivityData): Promise<Activity>;
  getByClientId(clienteId: string): Promise<Activity[]>;
  findById(id: string): Promise<Activity | null>;
}
