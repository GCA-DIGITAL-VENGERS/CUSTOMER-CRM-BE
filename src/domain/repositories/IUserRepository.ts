import { User } from '../entities/User';

export interface CreateUserData {
  id: string;
  username: string;
  email: string;
  password: string;
  isActive: boolean;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(data: CreateUserData): Promise<User>;
}
