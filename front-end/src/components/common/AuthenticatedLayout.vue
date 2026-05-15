<script setup lang="ts">
import Header from '@/components/common/Header.vue'
</script>

<template>
  <div>
    <Header />
    <main class="container">
      <slot />
    </main>
  </div>
</template>
