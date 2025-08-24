<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center p-5">
    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <img src="@/assets/logo.png" alt="LLT Logo" class="w-20 h-auto mb-4 mx-auto" />
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Surveyor App</h1>
        <p class="text-gray-600 text-sm">Sistem Informasi Lansia Terpadu</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label for="username" class="font-semibold text-gray-700 text-sm">Username</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            placeholder="Enter your username"
            required
            class="w-full px-3 py-3 border border-gray-300 rounded-2xl text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="font-semibold text-gray-700 text-sm">Password</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="Enter your password"
            required
            class="w-full px-3 py-3 border border-gray-300 rounded-2xl text-base transition-all duration-200 focus:outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/10"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white border-none px-6 py-4 rounded-2xl text-base font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none hover:transform hover:-translate-y-px"
        >
          <i v-if="loading" class="pi pi-spin pi-spinner"></i>
          <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { login, loading } = useAuth()

const loginForm = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  await login(loginForm.value, false)
}
</script>

<style scoped>
/* Mobile optimizations - specific adjustments that Tailwind can't handle */
@media (max-width: 480px) {
  .mobile-login {
    padding: 0.625rem;
  }
  
  .login-container {
    padding: 1.5rem;
  }
  
  .logo {
    width: 60px;
  }
  
  .title {
    font-size: 1.25rem;
  }
}
</style>