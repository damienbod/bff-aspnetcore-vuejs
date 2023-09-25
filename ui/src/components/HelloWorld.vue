<script setup lang="ts">
import ResultsDisplay from './ResultsDisplay.vue'
import axios from 'axios';
import { ref, onMounted } from 'vue'
import { getCookie } from '../getCookie';

const isLoggedIn = ref<boolean>()
const currentUser = ref<any>()
const jsonResponse = ref<any>()

onMounted(() => {
  getUserProfile()
})

const axiosConfig = {
  headers:{
    'X-XSRF-TOKEN': getCookie('XSRF-RequestToken'),
  }
};

// request.headers.set('X-XSRF-TOKEN',  getCookie('XSRF-RequestToken'));

function getDirectApi() {
	axios.get(`${getCurrentHost()}/api/DirectApi`, axiosConfig)
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
	axios.get(`${getCurrentHost()}/api/GraphApiData`, axiosConfig)
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
	
	<a class="btn" href="api/Account/Login" v-if='!isLoggedIn'>Log in</a>
	
	<div v-if='isLoggedIn'>
		<form method="post" action="api/Account/Logout">
		  <button class="btn btn-link" type="submit">Sign out</button>
		</form>

	</div>
	
	<button v-if='isLoggedIn' class='btn' @click='getUserProfile' >Get Profile data</button>
	<button v-if='isLoggedIn' class='btn' @click='getDirectApi' >Get API data</button>
	<button v-if='isLoggedIn' class='btn' @click='getGraphApiDataUsingApi' >Get Graph data</button>
	
	<ResultsDisplay v-if='isLoggedIn' 
		v-bind:currentUser='currentUser'
		v-bind:jsonResponse='jsonResponse' />
		
  </div>
  
  <p class="read-the-docs">BFF using ASP.NET Core and Vue.js</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
