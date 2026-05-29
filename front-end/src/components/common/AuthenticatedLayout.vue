<script setup lang="ts">
import Header from '@/components/common/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-white">
    <Header />
    <main class="max-w-5xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>
