import { ref, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import AuthService from '../services/authService';
import { TokenService } from '../services/tokenService';

interface Credentials {
  username: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const toast = useToast();
  const loading: Ref<boolean> = ref(false);

  const login = async (credentials: Credentials, rememberMe: boolean = false): Promise<void> => {
    loading.value = true;

    try {
      console.log('Attempting login with credentials:', credentials);
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
      
      const response = await AuthService.login(credentials, rememberMe);
      console.log('Login response:', response);

      toast.add({
        severity: 'success',
        summary: 'Login Berhasil',
        detail: 'Anda akan diarahkan ke scanner',
        life: 3000
      });

      // Redirect to mobile scanner instead of dashboard
      router.push('/scanner');
    } catch (error: any) {
      console.error('Login error in useAuth:', error);
      toast.add({
        severity: 'error',
        summary: 'Login Gagal',
        detail: error.message || 'Terjadi kesalahan saat login',
        life: 3000
      });
    } finally {
      loading.value = false;
    }
  };

  const logout = (): void => {
    AuthService.logout();

    toast.add({
      severity: 'success',
      summary: 'Logout Berhasil',
      detail: 'Anda telah berhasil logout',
      life: 3000
    });

    router.push('/login');
  };

  return {
    login,
    logout,
    loading
  };
}