import { Request, Response } from 'express';
import { GetDashboardSummaryUseCase } from '../../application/use-cases/getDashboardSummary';
import { ExportClientsToCSVUseCase } from '../../application/use-cases/exportClientsToCSV';
import { PrismaClientRepository } from '../../infrastructure/repositories/clientRepository';
import { PrismaOpportunityRepository } from '../../infrastructure/repositories/opportunityRepository';

const clientRepository = new PrismaClientRepository();
const opportunityRepository = new PrismaOpportunityRepository();

const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase(clientRepository, opportunityRepository);
const exportClientsToCSVUseCase = new ExportClientsToCSVUseCase(clientRepository);

export const getDashboardSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = await getDashboardSummaryUseCase.execute();
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const exportClientsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const csv = await exportClientsToCSVUseCase.execute();

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="clientes_${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
