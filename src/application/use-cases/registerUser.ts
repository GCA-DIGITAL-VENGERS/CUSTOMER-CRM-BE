import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const [existingEmail, existingUsername] = await Promise.all([
      this.userRepository.findByEmail(input.email),
      this.userRepository.findByUsername(input.username),
    ]);

    if (existingEmail) throw new Error('Email already in use');
    if (existingUsername) throw new Error('Username already in use');

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return this.userRepository.create({
      id: uuidv4(),
      username: input.username,
      email: input.email,
      password: hashedPassword,
      isActive: true,
    });
  }
}
