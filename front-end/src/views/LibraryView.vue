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
const titleFilter = ref('')
const authorFilter = ref('')
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
    const matchesTitle =
      titleFilter.value === '' ||
      book.title.toLowerCase().includes(titleFilter.value.toLowerCase())
    const matchesAuthor =
      authorFilter.value === '' ||
      book.author.toLowerCase().includes(authorFilter.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || book.status === statusFilter.value
    return matchesTitle && matchesAuthor && matchesStatus
  })
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
      <h1 class="text-2xl font-bold text-black mb-6">Biblioteca</h1>

      <div v-if="error" class="mb-4 px-3 py-2 border border-black bg-gray-50 text-sm">{{ error }}</div>

      <div class="border border-black mb-6">
        <div class="px-6 py-4 border-b border-black">
          <span class="text-xs font-bold uppercase tracking-widest text-gray-500">Filtros e Busca</span>
        </div>
        <div class="grid grid-cols-3 divide-x divide-black">
          <div class="px-6 py-4">
            <label for="title" class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Título</label>
            <input
              id="title"
              v-model="titleFilter"
              type="text"
              placeholder="Filtrar por título..."
              class="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div class="px-6 py-4">
            <label for="author" class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Autor</label>
            <input
              id="author"
              v-model="authorFilter"
              type="text"
              placeholder="Filtrar por autor..."
              class="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div class="px-6 py-4">
            <label for="status" class="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Status</label>
            <select
              id="status"
              v-model="statusFilter"
              class="w-full border border-black px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black bg-white cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="available">Disponível</option>
              <option value="lent">Emprestado</option>
            </select>
          </div>
        </div>
      </div>

      <p v-if="isLoading" class="text-sm text-gray-500">Carregando livros...</p>

      <div v-else>
        <p class="text-xs text-gray-500 mb-4">Total: {{ filteredBooks.length }} livro(s)</p>

        <p v-if="filteredBooks.length === 0" class="text-sm text-gray-500 italic">
          Nenhum livro encontrado com os filtros selecionados
        </p>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="book in filteredBooks"
            :key="book.id"
            class="border border-black flex flex-col"
          >
            <div class="px-5 py-4 flex-1">
              <div class="flex items-start justify-between gap-2 mb-3">
                <h2 class="text-sm font-bold text-black leading-snug">{{ book.title }}</h2>
                <span
                  class="shrink-0 text-xs px-2 py-0.5 font-medium"
                  :class="book.status === 'available'
                    ? 'border border-black text-black'
                    : 'bg-black text-white'"
                >
                  {{ getStatusLabel(book.status) }}
                </span>
              </div>
              <p class="text-xs text-gray-600 mb-1">{{ book.author }}</p>
              <p v-if="book.edition" class="text-xs text-gray-500">Edição: {{ book.edition }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(book.release_date) }}</p>
            </div>

            <div class="border-t border-black px-5 py-3">
              <template v-if="getActiveLoanForBook(book.id)">
                <p class="text-xs text-gray-500 mb-2">
                  Devolução até: {{ formatDate(getActiveLoanForBook(book.id)!.return_date) }}
                </p>
                <button
                  class="w-full border border-black text-black px-3 py-1.5 text-xs font-medium hover:bg-gray-100 transition-colors cursor-pointer"
                  @click="handleReturn(getActiveLoanForBook(book.id)!.id)"
                >
                  Devolver
                </button>
              </template>
              <button
                v-else-if="book.status === 'available'"
                class="w-full bg-black text-white px-3 py-1.5 text-xs font-medium hover:bg-gray-900 transition-colors cursor-pointer"
                @click="handleBorrow(book.id)"
              >
                Pedir Emprestado
              </button>
              <p v-else class="text-xs text-gray-400 italic">Indisponível no momento</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
