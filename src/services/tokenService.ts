const TOKEN_KEY: string = import.meta.env.VITE_JWT_TOKEN_KEY || 'auth_token';

export const TokenService = {
  getToken(): string | null {
    console.log('getToken called');
    // Check both localStorage and sessionStorage
    const token: string | null = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
    console.log('getToken returned:', token);
    return token;
  },

  setToken(token: string, rememberMe: boolean = false): void {
    console.log('setToken called with token:', token, 'rememberMe:', rememberMe);
    
    if (rememberMe) {
      // Remember me: use localStorage, clear sessionStorage
      localStorage.setItem(TOKEN_KEY, token);
      sessionStorage.removeItem(TOKEN_KEY);
    } else {
      // Default: use sessionStorage, clear localStorage
      sessionStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  removeToken(): void {
    console.log('removeToken called');
    // Clear from both storages
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },

  isRemembered(): boolean {
    // Check if token exists in localStorage (remember me was used)
    return !!localStorage.getItem(TOKEN_KEY);
  }
};
