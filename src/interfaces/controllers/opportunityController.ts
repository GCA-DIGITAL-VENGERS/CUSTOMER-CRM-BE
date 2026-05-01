import { Request, Response } from 'express';
import { CreateOpportunityUseCase } from '../../application/use-cases/createOpportunity';
import { UpdateOpportunityStageUseCase } from '../../application/use-cases/updateOpportunityStage';
import { GetOpportunitiesByClientUseCase } from '../../application/use-cases/getOpportunitiesByClient';
import { PrismaOpportunityRepository } from '../../infrastructure/repositories/opportunityRepository';
import { PrismaClientRepository } from '../../infrastructure/repositories/clientRepository';

const opportunityRepository = new PrismaOpportunityRepository();
const clientRepository = new PrismaClientRepository();
const createOpportunityUseCase = new CreateOpportunityUseCase(opportunityRepository, clientRepository);
const updateOpportunityStageUseCase = new UpdateOpportunityStageUseCase(opportunityRepository);
const getOpportunitiesByClientUseCase = new GetOpportunitiesByClientUseCase(opportunityRepository, clientRepository);

export const createOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId, titulo, valor, fechaCierre } = req.body;

    if (!clienteId || !titulo || !valor || !fechaCierre) {
      res.status(400).json({ message: 'clienteId, titulo, valor and fechaCierre are required' });
      return;
    }

    const opportunity = await createOpportunityUseCase.execute({
      clienteId,
      titulo,
      valor,
      fechaCierre: new Date(fechaCierre),
    });

    res.status(201).json(opportunity.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create opportunity';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ message });
  }
};

export const updateOpportunityStage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { etapa } = req.body;

    if (!etapa) {
      res.status(400).json({ message: 'etapa is required' });
      return;
    }

    const opportunity = await updateOpportunityStageUseCase.execute(id, etapa);
    res.status(200).json(opportunity.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ message });
  }
};

export const getOpportunitiesByClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId } = req.params;

    const opportunities = await getOpportunitiesByClientUseCase.execute(clienteId);
    res.status(200).json(opportunities.map((o) => o.toPublic()));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : 500;
    res.status(status).json({ message });
  }
};
