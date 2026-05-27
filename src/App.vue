<template>
	<div id="app">
		<WebApp />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WebApp from './WebApp.vue'

export default defineComponent({
	name: 'App',
	components: { WebApp }
})
</script>

<style>
body { margin: 0; }
#app { min-height: 100vh; }
</style>
