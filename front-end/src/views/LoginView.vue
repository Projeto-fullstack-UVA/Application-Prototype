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
  <header class="container">
    <hgroup>
      <h1>Estante Vive</h1>
        <p>Bem-vindo ao gerenciador de biblioteca compartilhada</p>
    </hgroup>
  </header>
  <main class="container">
    <article>
      <form @submit.prevent="handleSubmit">
        <p v-if="authError || errors.submit" role="alert">
          {{ authError || errors.submit }}
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
          <button type="submit">Entrar</button>
          <RouterLink to="/signup" role="button" class="secondary">
            Criar conta
          </RouterLink>
        </div>
      </form>
    </article>
  </main>
</template>
