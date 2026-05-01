import { Opportunity } from '../entities/Opportunity';

export interface CreateOpportunityData {
  id: string;
  clienteId: string;
  titulo: string;
  valor: number;
  fechaCierre: Date;
}

export interface IOpportunityRepository {
  create(data: CreateOpportunityData): Promise<Opportunity>;
  findById(id: string): Promise<Opportunity | null>;
  getByClientId(clienteId: string): Promise<Opportunity[]>;
  updateStage(id: string, etapa: string): Promise<Opportunity>;
}
