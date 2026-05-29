<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/services/auth'
import { validateEmail } from '@/utils'

const router = useRouter()
const { login, error: authError } = useAuth()

const email = ref('')
const password = ref('')
const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}

  if (!email.value.trim()) {
    errors.value.email = 'Email é obrigatório'
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Email inválido'
  }

  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
  } else if (password.value.length < 6) {
    errors.value.password = 'Senha deve ter pelo menos 6 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await login({ email: email.value, password: password.value })
    router.push('/dashboard')
  } catch (err) {
    errors.value.submit = authError.value || 'Erro ao fazer login'
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-black">Estante Vive</h1>
        <p class="text-gray-500 mt-1 text-sm">Bem-vindo ao gerenciador de biblioteca compartilhada</p>
      </div>

      <div class="border border-black p-8">
        <form @submit.prevent="handleSubmit">
          <div v-if="authError || errors.submit" class="mb-4 px-3 py-2 border border-black bg-gray-50 text-sm">
            {{ authError || errors.submit }}
          </div>

          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-black mb-1">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="seu@email.com"
              class="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-gray-600">{{ errors.email }}</p>
          </div>

          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-black mb-1">Senha</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.password" class="mt-1 text-xs text-gray-600">{{ errors.password }}</p>
          </div>

          <div class="flex gap-3">
            <button
              type="submit"
              class="flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900 transition-colors cursor-pointer"
            >
              Entrar
            </button>
            <RouterLink
              to="/signup"
              class="flex-1 text-center border border-black text-black px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Criar conta
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
