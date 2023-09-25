<script setup lang="ts">

defineProps<{ currentUser: string, jsonResponse:any }>()

</script>

<template>
  <div class='home'>
	<p>User: {{ currentUser }}</p>
	
	<p>{{ jsonResponse }}</p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
