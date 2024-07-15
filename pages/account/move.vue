<script>
// layout null로 설정


export default {
	 layout:"empty",
	 middleware : 'guest',
	 mounted() {
		  tool_app.log('move mounted')

	 }
}
</script>

<template>
	   <div>
		  <h1>Move</h1>
			 <nuxt-link to="/account/login">홈으로 이동</nuxt-link>
			 잘 반영이 될까? 0000000000000
		</div>
</template>

<style scoped>

</style>
