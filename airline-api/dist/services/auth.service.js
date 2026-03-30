"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const error_middleware_1 = require("../middleware/error.middleware");
const userRepository = new user_repository_1.UserRepository();
class AuthService {
    async register(dto) {
        const existingUser = await userRepository.findByUsername(dto.username);
        if (existingUser) {
            throw new error_middleware_1.AppError('Bu kullanıcı adı zaten alınmış.', 409);
        }
        const passwordHash = await bcryptjs_1.default.hash(dto.password || '', 10);
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
    async login(dto) {
        const user = await userRepository.findByUsername(dto.username);
        if (!user) {
            throw new error_middleware_1.AppError('Kullanıcı adı veya şifre hatalı.', 401);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(dto.password || '', user.passwordHash);
        if (!isPasswordValid) {
            throw new error_middleware_1.AppError('Kullanıcı adı veya şifre hatalı.', 401);
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: (process.env.JWT_EXPIRES_IN || '1d') });
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
exports.AuthService = AuthService;
