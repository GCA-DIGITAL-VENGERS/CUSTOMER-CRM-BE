import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/registerUser';
import { LoginUserUseCase } from '../../application/use-cases/loginUser';
import { PrismaUserRepository } from '../../infrastructure/repositories/userRepository';

const userRepository = new PrismaUserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);
const loginUserUseCase = new LoginUserUseCase(userRepository);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'username, email and password are required' });
      return;
    }

    const user = await registerUserUseCase.execute({ username, email, password });
    res.status(201).json(user.toPublic());
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'email and password are required' });
      return;
    }

    const result = await loginUserUseCase.execute({ email, password });
    res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    res.status(401).json({ message });
  }
};

export const profile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findById(req.user!.id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user.toPublic());
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
