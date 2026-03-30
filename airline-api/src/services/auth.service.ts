import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../middleware/error.middleware';

import { RegisterDto, LoginDto } from '../dtos/auth.dto';

const userRepository = new UserRepository();

export class AuthService {
  async register(dto: RegisterDto) {
    const existingUser = await userRepository.findByUsername(dto.username);
    if (existingUser) {
      throw new AppError('Bu kullanıcı adı zaten alınmış.', 409);
    }

    const passwordHash = await bcrypt.hash(dto.password || '', 10);
    const user = await userRepository.create({
      username: dto.username,
      passwordHash,
      role: dto.role || 'user'
    });

    return {
      id: user.id,
      username: user.username,
      role: user.role
    };
  }

  async login(dto: LoginDto) {
    const user = await userRepository.findByUsername(dto.username);
    if (!user) {
      throw new AppError('Kullanıcı adı veya şifre hatalı.', 401);
    }

    const isPasswordValid = await bcrypt.compare(dto.password || '', user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Kullanıcı adı veya şifre hatalı.', 401);
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as any }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      },
      token
    };
  }
}
