import { User } from '../interfaces/user';

export interface LoginResponseDto {
  user: User;
  token?: string;
  expiration?: number;
  refreshToken?: string;
  expirationRefresh?: number;
}
