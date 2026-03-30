export interface RegisterDto {
  username: string;
  passwordHash?: string; // Client typically sends "password"
  password?: string;
  role?: string;
}

export interface LoginDto {
  username: string;
  password?: string;
}
