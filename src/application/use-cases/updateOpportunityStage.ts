import { Opportunity } from '../../domain/entities/Opportunity';
import { IOpportunityRepository } from '../../domain/repositories/IOpportunityRepository';

const STAGES = ['PROSPECCION', 'PROPUESTA', 'NEGOCIACION', 'CERRADA'];

export class UpdateOpportunityStageUseCase {
  constructor(private readonly opportunityRepository: IOpportunityRepository) {}

  async execute(id: string, etapa: string): Promise<Opportunity> {
    if (!STAGES.includes(etapa)) {
      throw new Error(`Etapa must be one of: ${STAGES.join(', ')}`);
    }

    const opportunity = await this.opportunityRepository.findById(id);
    if (!opportunity) throw new Error('Opportunity not found');

    if (opportunity.etapa === 'CERRADA') {
      throw new Error('Cannot change stage of a closed opportunity');
    }

    const currentIndex = STAGES.indexOf(opportunity.etapa);
    const newIndex = STAGES.indexOf(etapa);

    if (newIndex < currentIndex) {
      throw new Error('Cannot go back to previous stages');
    }

    return this.opportunityRepository.updateStage(id, etapa);
  }
}
