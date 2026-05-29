<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AuthenticatedLayout from '@/components/common/AuthenticatedLayout.vue'
import { useAuth } from '@/services/auth'
import { loanService } from '@/services'
import { formatDate, formatPoints, getStatusLabel } from '@/utils'
import type { Loan } from '@/types'

const { user } = useAuth()
const isLoading = ref(true)
const error = ref<string | null>(null)

const loans = ref<Loan[]>([])

const activeLoans = ref<Loan[]>([])
const returnedLoans = ref<Loan[]>([])

const loadUserData = async () => {
  if (!user.value) return

  try {
    isLoading.value = true
    error.value = null

    const userLoans = await loanService.getUserLoans(user.value.id)
    loans.value = userLoans
    activeLoans.value = userLoans.filter((l) => !l.returned_at)
    returnedLoans.value = userLoans.filter((l) => !!l.returned_at)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar dados'
  } finally {
    isLoading.value = false
  }
}

const handleReturn = async (loanId: number) => {
  try {
    await loanService.returnBook(loanId)
    await loadUserData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao devolver livro'
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <AuthenticatedLayout>
    <div v-if="user">
      <h1 class="text-2xl font-bold text-black mb-6">Meu Perfil</h1>

      <div v-if="error" class="mb-4 px-3 py-2 border border-black bg-gray-50 text-sm">{{ error }}</div>

      <div class="border border-black mb-6">
        <div class="px-6 py-4 border-b border-black">
          <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Informações Pessoais</span>
        </div>
        <div class="grid grid-cols-3 divide-x divide-black border-b border-black">
          <div class="px-6 py-4">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Nome</p>
            <p class="text-sm font-medium text-black">{{ user.name }}</p>
          </div>
          <div class="px-6 py-4">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
            <p class="text-sm font-medium text-black">{{ user.email }}</p>
          </div>
          <div class="px-6 py-4">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Instituição</p>
            <p class="text-sm font-medium text-black">{{ user.institution }}</p>
          </div>
        </div>
        <div class="grid grid-cols-3 divide-x divide-black">
          <div class="px-6 py-4">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Função</p>
            <span class="inline-block border border-black px-2 py-0.5 text-xs font-medium">
              {{ getStatusLabel(user.role) }}
            </span>
          </div>
          <div class="px-6 py-4">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Pontos</p>
            <p class="text-sm font-bold text-black">{{ formatPoints(user.points) }}</p>
          </div>
          <div class="px-6 py-4">
            <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Membro desde</p>
            <p class="text-sm font-medium text-black">{{ formatDate(user.created_at) }}</p>
          </div>
        </div>
      </div>

      <p v-if="isLoading" class="text-sm text-gray-500">Carregando dados...</p>

      <div v-else>
        <div class="border border-black mb-6">
          <div class="px-6 py-4 border-b border-black">
            <span class="text-xs font-bold uppercase tracking-widest text-gray-500">
              Empréstimos Ativos ({{ activeLoans.length }})
            </span>
          </div>
          <div class="px-6 py-4">
            <p v-if="activeLoans.length === 0" class="text-sm text-gray-500 italic">
              Nenhum empréstimo ativo no momento
            </p>
            <ul v-else class="space-y-3">
              <li
                v-for="loan in activeLoans"
                :key="loan.id"
                class="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p class="text-sm font-medium text-black">{{ loan.book_title }}</p>
                  <p class="text-xs text-gray-500">{{ loan.book_author }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">Devolução até: {{ formatDate(loan.return_date) }}</p>
                </div>
                <button
                  class="shrink-0 ml-4 border border-black text-black px-3 py-1.5 text-xs font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                  @click="handleReturn(loan.id)"
                >
                  Devolver
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="returnedLoans.length > 0" class="border border-black">
          <div class="px-6 py-4 border-b border-black">
            <span class="text-xs font-bold uppercase tracking-widest text-gray-500">
              Histórico de Empréstimos ({{ returnedLoans.length }})
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-black">
                  <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Livro</th>
                  <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Autor</th>
                  <th class="text-left px-6 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">Devolvido em</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="loan in returnedLoans"
                  :key="loan.id"
                  class="border-b border-gray-100 last:border-0"
                >
                  <td class="px-6 py-3 font-medium text-black">{{ loan.book_title }}</td>
                  <td class="px-6 py-3 text-gray-600">{{ loan.book_author }}</td>
                  <td class="px-6 py-3 text-gray-600">{{ formatDate(loan.returned_at!) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
