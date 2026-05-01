import { Request, Response } from 'express';
import { CreateActivityUseCase } from '../../application/use-cases/createActivity';
import { GetActivitiesByClientUseCase } from '../../application/use-cases/getActivitiesByClient';
import { PrismaActivityRepository } from '../../infrastructure/repositories/activityRepository';
import { PrismaClientRepository } from '../../infrastructure/repositories/clientRepository';

const activityRepository = new PrismaActivityRepository();
const clientRepository = new PrismaClientRepository();
const createActivityUseCase = new CreateActivityUseCase(activityRepository, clientRepository);
const getActivitiesByClientUseCase = new GetActivitiesByClientUseCase(activityRepository, clientRepository);

export const createActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId, tipo, descripcion, fecha } = req.body;

    if (!clienteId || !tipo || !descripcion || !fecha) {
      res.status(400).json({ message: 'clienteId, tipo, descripcion and fecha are required' });
      return;
    }

    const activity = await createActivityUseCase.execute({
      clienteId,
      tipo,
      descripcion,
      fecha: new Date(fecha),
    });

    res.status(201).json(activity.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create activity';
    const status = message.includes('not found') ? 404 : 400;
    res.status(status).json({ message });
  }
};

export const getActivitiesByClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId } = req.query;

    if (!clienteId) {
      res.status(400).json({ message: 'clienteId query parameter is required' });
      return;
    }

    const activities = await getActivitiesByClientUseCase.execute(clienteId as string);
    res.status(200).json(activities.map((a) => a.toPublic()));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : 500;
    res.status(status).json({ message });
  }
};
