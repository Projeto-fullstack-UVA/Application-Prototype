<template>
  <div class="webapp">
    <h1>Biblioteca - WebApp</h1>

    <section class="add-book">
      <h2>Adicionar livro</h2>
      <form @submit.prevent="addLivro">
        <input v-model="form.titulo" placeholder="Título" required />
        <input v-model="form.autor" placeholder="Autor" required />
        <input v-model.number="form.ano" type="number" placeholder="Ano" required />
        <input v-model="form.edicao" placeholder="Edição" />
        <label>
          <input type="checkbox" v-model="form.disponivel" /> Disponível
        </label>
        <button type="submit">Adicionar</button>
      </form>
    </section>

    <section class="library">
      <h2>Livros</h2>
      <SearchView :livros="livros" />
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import SearchView from './SearchView.vue'
import type { Livro } from './type'

export default defineComponent({
  name: 'WebApp',
  components: { SearchView },
  setup() {
    const nextId = ref(1)
    const livros = reactive<Array<Livro>>([
      { id: nextId.value++, titulo: 'O Alquimista', autor: 'Paulo Coelho', ano: 1988, disponivel: true, edicao: '1ª' },
      { id: nextId.value++, titulo: 'Dom Casmurro', autor: 'Machado de Assis', ano: 1899, disponivel: false, edicao: '2ª' }
    ])

    const form = reactive({ titulo: '', autor: '', ano: null as number | null, edicao: '', disponivel: true })

    function addLivro() {
      if (!form.titulo || !form.autor || !form.ano) return
      livros.push({ id: nextId.value++, titulo: form.titulo, autor: form.autor, ano: form.ano as number, disponivel: form.disponivel, edicao: form.edicao || 'N/A' })
      form.titulo = ''
      form.autor = ''
      form.ano = null
      form.edicao = ''
      form.disponivel = true
    }

    return { livros, form, addLivro }
  }
})
</script>

<style scoped>
.webapp { padding: 1rem; font-family: Arial, sans-serif }
.add-book { margin-bottom: 1rem }
.add-book form { display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center }
.add-book input[type="text"], .add-book input[type="number"] { padding: 0.4rem; border: 1px solid #ccc; border-radius: 4px }
</style>
