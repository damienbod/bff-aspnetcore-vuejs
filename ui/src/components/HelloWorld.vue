<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios';

currentUser: ''; 
accessTokenExpired: false;
isLoggedIn: false;

function getDirectApi() {
	axios.get(`${this.getCurrentHost()}/api/DirectApi`)
		.then((response: any) => {
			this.data = response.data;
		})
		.catch((error: any) => {
			alert(error);
		});
}

function getUserProfile() {
	axios.get(`${this.getCurrentHost()}/api/User`)
	.then((response: any) => {
		this.data = response.data;
	})
	.catch((error: any) => {
		alert(error);
	});
}

function getGraphApiDataUsingApi() {
	axios.get(`${this.getCurrentHost()}/api/GraphApiData`)
		.then((response: any) => {
			this.data = response.data;
		})
		.catch((error: any) => {
			alert(error);
	});
}

function getCurrentHost() {
	const host = window.location.host;
	const url = `${window.location.protocol}//${host}`;

	return url;
}

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
