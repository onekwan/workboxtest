<template>
	 <div id="errorWrapper">
		  <p v-if="error.statusCode === 404">
				Page not found {{ error ? error.statusCode : ""}}
		  </p>
		  <p v-else>
				  관리자에게 문의해 주세요.<br/>
				  {{error ? error : ""}}
		  </p>

		  <nuxt-link to="/">홈으로 돌아가기</nuxt-link>
	 </div>
</template>

<script>
export default {
	 props: ['error'],
	 layout : 'auth'
}
</script>

<style>
#errorWrapper {
	 margin-top:50px;
	 padding:30px;
	 background-color: #fff;
	 font-size: 18px;
	 text-align: center;
}
</style>
