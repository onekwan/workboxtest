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
			 별 빛이 내린다~88888888
		</div>
</template>

<style scoped>

</style>
