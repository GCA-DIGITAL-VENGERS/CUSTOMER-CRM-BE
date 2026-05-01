import { Activity } from '../../domain/entities/Activity';
import { IActivityRepository } from '../../domain/repositories/IActivityRepository';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

export class GetActivitiesByClientUseCase {
  constructor(
    private readonly activityRepository: IActivityRepository,
    private readonly clientRepository: IClientRepository
  ) {}

  async execute(clienteId: string): Promise<Activity[]> {
    const client = await this.clientRepository.findById(clienteId);
    if (!client) throw new Error('Client not found');

    return this.activityRepository.getByClientId(clienteId);
  }
}
