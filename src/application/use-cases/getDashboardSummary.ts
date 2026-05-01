import { IClientRepository } from '../../domain/repositories/IClientRepository';
import { IOpportunityRepository } from '../../domain/repositories/IOpportunityRepository';

export interface DashboardSummary {
  totalActiveClients: number;
  openOpportunities: number;
  totalPipelineValue: number;
  averageDealSize: number;
  opportunitiesByStage: {
    PROSPECCION: number;
    PROPUESTA: number;
    NEGOCIACION: number;
    CERRADA: number;
  };
}

export class GetDashboardSummaryUseCase {
  constructor(
    private readonly clientRepository: IClientRepository,
    private readonly opportunityRepository: IOpportunityRepository
  ) {}

  async execute(): Promise<DashboardSummary> {
    const activeClients = await this.clientRepository.list({ estado: 'ACTIVO' });
    const allOpportunities = await this.getAllOpportunities();

    const openOpportunities = allOpportunities.filter((opp) => opp.etapa !== 'CERRADA');
    const totalPipelineValue = openOpportunities.reduce((sum, opp) => sum + opp.valor, 0);

    const opportunitiesByStage = {
      PROSPECCION: allOpportunities.filter((opp) => opp.etapa === 'PROSPECCION').length,
      PROPUESTA: allOpportunities.filter((opp) => opp.etapa === 'PROPUESTA').length,
      NEGOCIACION: allOpportunities.filter((opp) => opp.etapa === 'NEGOCIACION').length,
      CERRADA: allOpportunities.filter((opp) => opp.etapa === 'CERRADA').length,
    };

    const averageDealSize = openOpportunities.length > 0 ? totalPipelineValue / openOpportunities.length : 0;

    return {
      totalActiveClients: activeClients.length,
      openOpportunities: openOpportunities.length,
      totalPipelineValue: Math.round(totalPipelineValue * 100) / 100,
      averageDealSize: Math.round(averageDealSize * 100) / 100,
      opportunitiesByStage,
    };
  }

  private async getAllOpportunities() {
    const clients = await this.clientRepository.list();
    const allOpportunities = [];

    for (const client of clients) {
      const opps = await this.opportunityRepository.getByClientId(client.id);
      allOpportunities.push(...opps);
    }

    return allOpportunities;
  }
}
