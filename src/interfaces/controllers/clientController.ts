import { Request, Response } from 'express';
import { CreateClientUseCase } from '../../application/use-cases/createClient';
import { ListClientsUseCase } from '../../application/use-cases/listClients';
import { GetClientUseCase } from '../../application/use-cases/getClient';
import { UpdateClientUseCase } from '../../application/use-cases/updateClient';
import { DeactivateClientUseCase } from '../../application/use-cases/deactivateClient';
import { PrismaClientRepository } from '../../infrastructure/repositories/clientRepository';

const clientRepository = new PrismaClientRepository();
const createClientUseCase = new CreateClientUseCase(clientRepository);
const listClientsUseCase = new ListClientsUseCase(clientRepository);
const getClientUseCase = new GetClientUseCase(clientRepository);
const updateClientUseCase = new UpdateClientUseCase(clientRepository);
const deactivateClientUseCase = new DeactivateClientUseCase(clientRepository);

export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, telefono, empresa } = req.body;

    if (!nombre || !email || !telefono || !empresa) {
      res.status(400).json({ message: 'nombre, email, telefono and empresa are required' });
      return;
    }

    const client = await createClientUseCase.execute({ nombre, email, telefono, empresa });
    res.status(201).json(client.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create client';
    const status = message.includes('already') ? 400 : 500;
    res.status(status).json({ message });
  }
};

export const listClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { estado, empresa } = req.query;

    const filters = {
      estado: estado as string | undefined,
      empresa: empresa as string | undefined,
    };

    const clients = await listClientsUseCase.execute(filters);
    res.status(200).json(clients.map((c) => c.toPublic()));
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const client = await getClientUseCase.execute(id);
    res.status(200).json(client.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : 500;
    res.status(status).json({ message });
  }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, empresa } = req.body;

    const updateData: any = {};
    if (nombre) updateData.nombre = nombre;
    if (email) updateData.email = email;
    if (telefono) updateData.telefono = telefono;
    if (empresa) updateData.empresa = empresa;

    const client = await updateClientUseCase.execute(id, updateData);
    res.status(200).json(client.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : message.includes('already') ? 400 : 500;
    res.status(status).json({ message });
  }
};

export const deactivateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const client = await deactivateClientUseCase.execute(id);
    res.status(200).json(client.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : message.includes('already') ? 400 : 500;
    res.status(status).json({ message });
  }
};
