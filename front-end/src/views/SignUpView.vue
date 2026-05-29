<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '@/services/api'
import { validateEmail } from '@/utils'

const router = useRouter()

const email = ref('')
const name = ref('')
const password = ref('')
const institution = ref('')
const role = ref<'student' | 'teacher' | 'donator'>('student')
const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)

const validateForm = () => {
  errors.value = {}
  submitError.value = null

  if (!email.value.trim()) {
    errors.value.email = 'Email é obrigatório'
  } else if (!validateEmail(email.value)) {
    errors.value.email = 'Email inválido'
  }

  if (!name.value.trim()) {
    errors.value.name = 'O nome é obrigatório'
  }

  if (!institution.value.trim()) {
    errors.value.institution = 'Instituição é obrigatória'
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

  if (isSubmitting.value) return

  try {
    isSubmitting.value = true

    await apiClient.post('/users', {
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
      institution: institution.value.trim(),
      role: role.value,
      points: 0,
      created_at: new Date().toISOString(),
    })

    router.push('/login')
  } catch {
    submitError.value = 'Erro ao criar conta'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-black">Estante Vive</h1>
        <p class="text-gray-500 mt-1 text-sm">Crie sua conta</p>
      </div>

      <div class="border border-black p-8">
        <form @submit.prevent="handleSubmit">
          <div v-if="submitError" class="mb-4 px-3 py-2 border border-black bg-gray-50 text-sm">
            {{ submitError }}
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

          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-black mb-1">Nome</label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="seu nome"
              class="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.name" class="mt-1 text-xs text-gray-600">{{ errors.name }}</p>
          </div>

          <div class="mb-4">
            <label for="institution" class="block text-sm font-medium text-black mb-1">Instituição</label>
            <input
              id="institution"
              v-model="institution"
              type="text"
              placeholder="nome da sua instituição"
              class="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="errors.institution" class="mt-1 text-xs text-gray-600">{{ errors.institution }}</p>
          </div>

          <div class="mb-4">
            <label for="role" class="block text-sm font-medium text-black mb-1">Perfil</label>
            <select
              id="role"
              v-model="role"
              class="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white cursor-pointer"
            >
              <option value="student">Aluno</option>
              <option value="teacher">Professor</option>
              <option value="donator">Doador</option>
            </select>
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
              class="flex-1 bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-50"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Criando...' : 'Criar conta' }}
            </button>
            <RouterLink
              to="/login"
              class="flex-1 text-center border border-black text-black px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Já tenho conta
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
