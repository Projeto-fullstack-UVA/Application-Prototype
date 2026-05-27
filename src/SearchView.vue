<template>
  <div class="search-view">
    <section class="filters">
      <input v-model="q.titulo" placeholder="Filtrar por título" />
      <input v-model="q.autor" placeholder="Filtrar por autor" />
      <input v-model.number="q.ano" type="number" placeholder="Filtrar por ano" />
      <select v-model="q.disponivel">
        <option :value="null">Qualquer disponibilidade</option>
        <option :value="true">Disponível</option>
        <option :value="false">Indisponível</option>
      </select>
      <input v-model="q.edicao" placeholder="Filtrar por edição" />
      <button @click="resetFilters">Limpar filtros</button>
    </section>

    <section class="results">
      <p v-if="filtered.length === 0">Nenhum livro encontrado.</p>
      <ul>
        <li v-for="livro in filtered" :key="livro.id">
          <strong>{{ livro.titulo }}</strong> — {{ livro.autor }} ({{ livro.ano }})
          <span v-if="livro.disponivel"> — Disponível</span>
          <span v-else> — Indisponível</span>
          <div class="edicao">Edição: {{ livro.edicao }}</div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from 'vue'
import type { Livro } from './type'

export default defineComponent({
  name: 'SearchView',
  props: {
    livros: {
      type: Array as () => Livro[],
      required: true
    }
  },
  setup(props) {
    const q = reactive({
      titulo: '',
      autor: '',
      ano: null as number | null,
      disponivel: null as boolean | null,
      edicao: ''
    })

    function matchesString(field: string, pattern: string) {
      if (!pattern) return true
      return field.toLowerCase().indexOf(pattern.toLowerCase()) !== -1
    }

    const filtered = computed(() => {
      return props.livros.filter((l: Livro) => {
        if (q.titulo && !matchesString(l.titulo, q.titulo)) return false
        if (q.autor && !matchesString(l.autor, q.autor)) return false
        if (q.ano && l.ano !== q.ano) return false
        if (q.disponivel !== null && l.disponivel !== q.disponivel) return false
        if (q.edicao && !matchesString(l.edicao, q.edicao)) return false
        return true
      })
    })

    function resetFilters() {
      q.titulo = ''
      q.autor = ''
      q.ano = null
      q.disponivel = null
      q.edicao = ''
    }

    return { q, filtered, resetFilters }
  }
})
</script>

<style scoped>
.search-view { padding: 1rem }
.filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem }
.filters input, .filters select { padding: 0.4rem; border-radius: 4px; border: 1px solid #ccc }
.results ul { list-style: none; padding: 0 }
.results li { padding: 0.5rem 0; border-bottom: 1px solid #eee }
.edicao { font-size: 0.85rem; color: #666 }
</style>
