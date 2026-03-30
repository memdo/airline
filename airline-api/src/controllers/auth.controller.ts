import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse } from '../utils/response';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: RegisterDto = req.body;
    const user = await authService.register(dto);
    res.status(201).json(successResponse({ user }, 'Kullanıcı başarıyla oluşturuldu.'));
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: LoginDto = req.body;
    const result = await authService.login(dto);
    res.json(successResponse(result, 'Giriş başarılı.'));
  } catch (error) {
    next(error);
  }
};
