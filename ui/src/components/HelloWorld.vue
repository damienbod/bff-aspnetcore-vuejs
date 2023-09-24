<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios';

defineProps<{ msg: string }>()



const count = ref(0)
</script>

<template>
  <div class='home'>
	<p v-if='isLoggedIn'>User: {{ username }}</p>
	
	<a class="btn" href="api/Account/Login" v-if='!isLoggedIn'>Log in</a>
	
	<div v-if='isLoggedIn'>
		<form method="post" action="api/Account/Logout">
		  <button class="btn btn-link" type="submit">Sign out</button>
		</form>
	</div>
	
	<button class='btn' @click='getProtectedApiData' v-if='isLoggedIn'>Get API data</button>
  </div>
  
  <p class="read-the-docs">BFF using ASP.NET Core and Vue.js</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
