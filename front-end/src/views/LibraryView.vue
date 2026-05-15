<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AuthenticatedLayout from '@/components/common/AuthenticatedLayout.vue'
import { useAuth } from '@/services/auth'
import { bookService, loanService } from '@/services'
import { formatDate, getStatusLabel } from '@/utils'
import type { Book, Loan } from '@/types'

const { user } = useAuth()
const isLoading = ref(true)
const error = ref<string | null>(null)

const books = ref<Book[]>([])
const activeLoans = ref<Loan[]>([])
const searchQuery = ref('')
const statusFilter = ref<string>('all')

const loadData = async () => {
  try {
    isLoading.value = true
    error.value = null
    ;[books.value, activeLoans.value] = await Promise.all([
      bookService.getAllBooks(),
      user.value ? loanService.getUserLoans(user.value.id) : Promise.resolve([]),
    ])
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar livros'
  } finally {
    isLoading.value = false
  }
}

const filteredBooks = computed(() => {
  return books.value.filter((book) => {
    const matchesSearch =
      searchQuery.value === '' ||
      book.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = statusFilter.value === 'all' || book.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const bookGroups = computed(() => {
  const groups: Book[][] = []
  for (let i = 0; i < filteredBooks.value.length; i += 3) {
    groups.push(filteredBooks.value.slice(i, i + 3))
  }
  return groups
})

const getActiveLoanForBook = (bookId: number): Loan | undefined => {
  return activeLoans.value.find((l) => l.book_id === bookId && !l.returned_at)
}

const handleBorrow = async (bookId: number) => {
  if (!user.value) return
  try {
    await loanService.borrowBook(user.value.id, bookId)
    await loadData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao pegar livro emprestado'
  }
}

const handleReturn = async (loanId: number) => {
  try {
    await loanService.returnBook(loanId)
    await loadData()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao devolver livro'
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <AuthenticatedLayout>
    <div>
      <h1>Biblioteca</h1>

      <p v-if="error" role="alert">{{ error }}</p>

      <article>
        <header>Filtros e Busca</header>
        <div class="grid">
          <label for="search">
            Buscar
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="Título ou autor..."
            />
          </label>

          <label for="status">
            Status
            <select id="status" v-model="statusFilter">
              <option value="all">Todos</option>
              <option value="available">Disponível</option>
              <option value="lent">Emprestado</option>
            </select>
          </label>

        </div>
      </article>

      <p v-if="isLoading" aria-busy="true">Carregando livros...</p>

      <div v-else>
        <p><small>Total: {{ filteredBooks.length }} livro(s)</small></p>

        <p v-if="filteredBooks.length === 0">
          <em>Nenhum livro encontrado com os filtros selecionados</em>
        </p>

        <div v-else>
          <div v-for="(group, i) in bookGroups" :key="i" class="grid">
            <article v-for="book in group" :key="book.id">
              <header>{{ book.title }}</header>
              <p><small>{{ book.author }}</small></p>
              <p v-if="book.edition"><small>Edição: {{ book.edition }}</small></p>
              <p><small>Publicado em: {{ formatDate(book.release_date) }}</small></p>
              <p><mark>{{ getStatusLabel(book.status) }}</mark></p>

              <footer>
                <template v-if="getActiveLoanForBook(book.id)">
                  <p>
                    <small>
                      Devolução até: {{ formatDate(getActiveLoanForBook(book.id)!.return_date) }}
                    </small>
                  </p>
                  <button
                    class="secondary"
                    @click="handleReturn(getActiveLoanForBook(book.id)!.id)"
                  >
                    Devolver
                  </button>
                </template>
                <button v-else-if="book.status === 'available'" @click="handleBorrow(book.id)">
                  Pedir Emprestado
                </button>
                <small v-else>Indisponível no momento</small>
              </footer>
            </article>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
