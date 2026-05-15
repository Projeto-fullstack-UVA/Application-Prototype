<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiClient } from '@/services/api'
import { validateEmail } from '@/utils'

const router = useRouter()

const email = ref('')
const name = ref('')
const password = ref('')
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
      institution: 'N/A',
      role: 'student',
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
  <header class="container">
    <hgroup>
      <h1>Estante Vive</h1>
      <p>Crie sua conta</p>
    </hgroup>
  </header>
  <main class="container">
    <article>
      <form @submit.prevent="handleSubmit">
        <p v-if="submitError" role="alert">
          {{ submitError }}
        </p>

        <label for="email">
          Email
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            :aria-invalid="errors.email ? 'true' : undefined"
          />
          <small v-if="errors.email">{{ errors.email }}</small>
        </label>

        <label for="name">
          Nome
          <input 
            id="name"
            v-model="name"
            type="text"
            placeholder="seu nome"
            :aria-invalid="errors.name ? 'true' : undefined"
          />
          <small v-if="errors.name">{{ errors.name }}</small>
        </label>

        <label for="password">
          Senha
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            :aria-invalid="errors.password ? 'true' : undefined"
          />
          <small v-if="errors.password">{{ errors.password }}</small>
        </label>

        <div class="grid">
          <button type="submit" :aria-busy="isSubmitting ? 'true' : undefined">
            Criar conta
          </button>
          <RouterLink to="/login" role="button" class="secondary">
            Já tenho conta
          </RouterLink>
        </div>
      </form>
    </article>
  </main>
</template>
