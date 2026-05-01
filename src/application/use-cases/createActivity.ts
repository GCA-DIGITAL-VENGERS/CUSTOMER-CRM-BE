import { v4 as uuidv4 } from 'uuid';
import { Activity } from '../../domain/entities/Activity';
import { IActivityRepository } from '../../domain/repositories/IActivityRepository';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

const VALID_TYPES = ['LLAMADA', 'REUNION', 'CORREO', 'NOTA'];

interface CreateActivityInput {
  clienteId: string;
  tipo: string;
  descripcion: string;
  fecha: Date;
}

export class CreateActivityUseCase {
  constructor(
    private readonly activityRepository: IActivityRepository,
    private readonly clientRepository: IClientRepository
  ) {}

  async execute(input: CreateActivityInput): Promise<Activity> {
    const client = await this.clientRepository.findById(input.clienteId);
    if (!client) throw new Error('Client not found');

    if (!VALID_TYPES.includes(input.tipo)) {
      throw new Error(`Tipo must be one of: ${VALID_TYPES.join(', ')}`);
    }

    if (!input.descripcion || input.descripcion.trim().length === 0) {
      throw new Error('Descripcion cannot be empty');
    }

    return this.activityRepository.create({
      id: uuidv4(),
      clienteId: input.clienteId,
      tipo: input.tipo,
      descripcion: input.descripcion,
      fecha: input.fecha,
    });
  }
}
