<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/services/auth'

const router = useRouter()
const route = useRoute()
const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/login')
}

const isActive = (path: string): boolean => {
  return route.path === path
}
</script>

<template>
  <nav class="container-fluid">
    <ul>
      <li>
        <RouterLink to="/dashboard"><strong>📚 Estante Vive</strong></RouterLink>
      </li>
      <li>
        <RouterLink
          to="/dashboard"
          :aria-current="isActive('/dashboard') ? 'page' : undefined"
        >
          Perfil
        </RouterLink>
      </li>
      <li>
        <RouterLink
          to="/library"
          :aria-current="isActive('/library') ? 'page' : undefined"
        >
          Biblioteca
        </RouterLink>
      </li>
    </ul>
    <ul>
      <li v-if="user">{{ user.name }}</li>
      <li>
        <button class="secondary outline" @click="handleLogout">Sair</button>
      </li>
    </ul>
  </nav>
</template>
