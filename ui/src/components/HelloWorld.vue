<script setup lang="ts">
import axios from 'axios';

import { ref } from 'vue'

const isLoggedIn = ref(0)
const currentUser = ref(1)
const jsonResponse = ref(2)

function getDirectApi() {
	axios.get(`${getCurrentHost()}/api/DirectApi`)
		.then((response: any) => {
			jsonResponse.value =  response.data;
			return response.data;
		})
		.catch((error: any) => {
			alert(error);
		});
}

function getUserProfile() {
	axios.get(`${getCurrentHost()}/api/User`)
	.then((response: any) => {
		console.log(response);
		jsonResponse.value  =  response.data;
		if(response.data.isAuthenticated){
			isLoggedIn.value  = true;
			currentUser.value  = response.data.claims[0].value
		}

		return response.data;
	})
	.catch((error: any) => {
		alert(error);
	});
}

function getGraphApiDataUsingApi() {
	axios.get(`${getCurrentHost()}/api/GraphApiData`)
		.then((response: any) => {
			jsonResponse.value  =  response.data;
			return response.data;
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
	<p v-if='isLoggedIn'>User: {{ currentUser }}</p>
	
	<a class="btn" href="api/Account/Login" v-if='!isLoggedIn'>Log in</a>
	
	<div v-if='isLoggedIn'>
		<form method="post" action="api/Account/Logout">
		  <button class="btn btn-link" type="submit">Sign out</button>
		</form>
	</div>
	
	<button class='btn' @click='getUserProfile' >Get Profile data</button>
	<button class='btn' @click='getDirectApi' >Get API data</button>
	<button class='btn' @click='getGraphApiDataUsingApi' >Get Graph data</button>
  </div>
  
  <p class="read-the-docs">BFF using ASP.NET Core and Vue.js</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
