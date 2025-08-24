import ApiService from './apiService';
import { TokenService } from './tokenService';
import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';

interface Credentials {
  username: string;
  password: string;
}

interface LoginResponse {
  data: {
    token: string;
    message: string;
  };
}

const AuthService = {
  async login(credentials: Credentials, rememberMe: boolean = false): Promise<string> {
    try {
      const response = await ApiService.post<LoginResponse>('/auth/login', credentials);
      console.log('Login response:', response);

      const token = response.data.data.token;
      console.log('Login token:', token);
      TokenService.setToken(token, rememberMe);
      ApiService.setHeader(token);

      return token;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  logout(): void {
    TokenService.removeToken();
    ApiService.removeHeader();
  },

  checkAuth(): boolean {
    const token = TokenService.getToken();
    if (token) {
      try {

        const decoded = jwtDecode(token) as JwtPayload;
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          console.log('Token expired');
          TokenService.removeToken();
          ApiService.removeHeader();
          return false;
        }

        ApiService.setHeader(token);
        console.log('Token found and valid:', token);
        return true;
      } catch (error) {
        console.error('Invalid token:', error);
        TokenService.removeToken();
        ApiService.removeHeader();
        return false;
      }
    }

    console.log('Token not found');
    return false;
  }
};

export default AuthService;
