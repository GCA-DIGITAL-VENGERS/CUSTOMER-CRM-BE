import { Request, Response } from 'express';
import { CreateContactUseCase } from '../../application/use-cases/createContact';
import { GetContactsByClientUseCase } from '../../application/use-cases/getContactsByClient';
import { PrismaContactRepository } from '../../infrastructure/repositories/contactRepository';
import { PrismaClientRepository } from '../../infrastructure/repositories/clientRepository';

const contactRepository = new PrismaContactRepository();
const clientRepository = new PrismaClientRepository();
const createContactUseCase = new CreateContactUseCase(contactRepository, clientRepository);
const getContactsByClientUseCase = new GetContactsByClientUseCase(contactRepository, clientRepository);

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId, nombre, cargo, email } = req.body;

    if (!clienteId || !nombre || !cargo || !email) {
      res.status(400).json({ message: 'clienteId, nombre, cargo and email are required' });
      return;
    }

    const contact = await createContactUseCase.execute({ clienteId, nombre, cargo, email });
    res.status(201).json(contact.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create contact';
    const status = message.includes('not found') ? 404 : message.includes('already') ? 400 : 500;
    res.status(status).json({ message });
  }
};

export const getContactsByClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clienteId } = req.params;

    const contacts = await getContactsByClientUseCase.execute(clienteId);
    res.status(200).json(contacts.map((c) => c.toPublic()));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : 500;
    res.status(status).json({ message });
  }
};
