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

onMounted(() => {
  loadUserData()
})
</script>

<template>
  <AuthenticatedLayout>
    <div v-if="user">
      <h1>Meu Perfil</h1>

      <p v-if="error" role="alert">{{ error }}</p>

      <article>
        <header>Informações Pessoais</header>
        <div class="grid">
          <div>
            <strong>Nome</strong>
            <p>{{ user.name }}</p>
          </div>
          <div>
            <strong>Email</strong>
            <p>{{ user.email }}</p>
          </div>
          <div>
            <strong>Instituição</strong>
            <p>{{ user.institution }}</p>
          </div>
        </div>
        <div class="grid">
          <div>
            <strong>Função</strong>
            <p><mark>{{ getStatusLabel(user.role) }}</mark></p>
          </div>
          <div>
            <strong>Pontos</strong>
            <p><strong>{{ formatPoints(user.points) }}</strong></p>
          </div>
          <div>
            <strong>Membro desde</strong>
            <p>{{ formatDate(user.created_at) }}</p>
          </div>
        </div>
      </article>

      <p v-if="isLoading" aria-busy="true">Carregando dados...</p>

      <div v-else>
        <div class="grid">
          <article>
            <header>Empréstimos Ativos ({{ activeLoans.length }})</header>
            <p v-if="activeLoans.length === 0"><em>Nenhum empréstimo ativo no momento</em></p>
            <ul v-else>
              <li v-for="loan in activeLoans" :key="loan.id">
                <strong>{{ loan.book_title }}</strong><br />
                <small>{{ loan.book_author }}</small><br />
                <small>Devolução até: {{ formatDate(loan.return_date) }}</small>
              </li>
            </ul>
          </article>
        </div>

        <article v-if="returnedLoans.length > 0">
          <header>Histórico de Empréstimos ({{ returnedLoans.length }})</header>
          <figure>
            <table>
              <thead>
                <tr>
                  <th>Livro</th>
                  <th>Autor</th>
                  <th>Devolvido em</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="loan in returnedLoans" :key="loan.id">
                  <td>{{ loan.book_title }}</td>
                  <td>{{ loan.book_author }}</td>
                  <td>{{ formatDate(loan.returned_at!) }}</td>
                </tr>
              </tbody>
            </table>
          </figure>
        </article>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
