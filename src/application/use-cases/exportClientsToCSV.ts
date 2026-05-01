import { stringify } from 'csv-stringify/sync';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

export class ExportClientsToCSVUseCase {
  constructor(private readonly clientRepository: IClientRepository) {}

  async execute(): Promise<string> {
    const clients = await this.clientRepository.list();

    const records = clients.map((client) => ({
      ID: client.id,
      Nombre: client.nombre,
      Email: client.email,
      Telefono: client.telefono,
      Empresa: client.empresa,
      Estado: client.estado,
      'Fecha de Creación': new Date(client.createdAt!).toISOString().split('T')[0],
      'Fecha de Actualización': new Date(client.updatedAt!).toISOString().split('T')[0],
    }));

    const csv = stringify(records, {
      header: true,
      columns: ['ID', 'Nombre', 'Email', 'Telefono', 'Empresa', 'Estado', 'Fecha de Creación', 'Fecha de Actualización'],
    });

    return csv;
  }
}
