<script>
// layout null로 설정

if ('serviceWorker' in navigator) {
	 navigator.serviceWorker.register('/sw.js').then((registration) => {
		  // 페이지가 로드될 때마다 업데이트 확인
		  registration.update();
	 });
}


</script>

<template>
	   <div>
	 <h1>Move</h1>
			 <nuxt-link to="/account/login">홈으로 이동</nuxt-link>
  </div>
</template>

<style scoped>

</style>
