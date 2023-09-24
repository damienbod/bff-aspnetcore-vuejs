<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios';

defineProps<{ msg: string }>()

currentUser: string = '';
accessTokenExpired: boolean | undefined = false;
isLoggedIn: boolean = false;
data: any;

getDirectApi() {
	axios.get(`${this.getCurrentHost()}/api/DirectApi`)
		.then((response: any) => {
			this.data = response.data;
		})
		.catch((error: any) => {
			alert(error);
		});
	
}

getUserProfile() {
	axios.get(`${this.getCurrentHost()}/api/User`)
		.then((response: any) => {
			this.data = response.data;
		})
		.catch((error: any) => {
			alert(error);
		});
}

getGraphApiDataUsingApi() {
  	axios.get(`${this.getCurrentHost()}/api/GraphApiData`)
		.then((response: any) => {
			this.data = response.data;
		})
		.catch((error: any) => {
			alert(error);
		});
}

getCurrentHost() {
    const host = window.location.host;
    const url = `${window.location.protocol}//${host}`;

    return url;
}

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
