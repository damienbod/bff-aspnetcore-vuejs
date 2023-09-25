<script setup lang="ts">

defineProps<{ currentUser: string }>()

</script>

<template>
  <div class='home'>
	<p>User: {{ currentUser }}</p>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
