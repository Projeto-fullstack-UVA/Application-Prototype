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

const isActive = (path: string) => route.path === path
</script>

<template>
  <header class="bg-black text-white">
    <nav class="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
      <div class="flex items-center gap-8">
        <RouterLink to="/dashboard" class="font-bold text-white text-base">
          📚 Estante Vive
        </RouterLink>
        <RouterLink
          to="/dashboard"
          class="text-sm transition-colors"
          :class="isActive('/dashboard') ? 'text-white font-medium' : 'text-gray-400 hover:text-white'"
        >
          Perfil
        </RouterLink>
        <RouterLink
          to="/library"
          class="text-sm transition-colors"
          :class="isActive('/library') ? 'text-white font-medium' : 'text-gray-400 hover:text-white'"
        >
          Biblioteca
        </RouterLink>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="user" class="text-sm text-gray-400">{{ user.name }}</span>
        <button
          class="text-sm border border-white text-white px-3 py-1 hover:bg-white hover:text-black transition-colors cursor-pointer"
          @click="handleLogout"
        >
          Sair
        </button>
      </div>
    </nav>
  </header>
</template>
