<template>
<div>
		<button class="btn btn-success" @click="serverAuth">버튼</button>
</div>
</template>

<script>
export default {
    name: "pgtest",
	 methods : {
        serverAuth(){
				AUTHNICE.requestPay({
					 clientId: 'S2_8d7cc758ea2c44d2821e6729c4b91e0a',
					 method: 'card',
					 orderId: this.random(),
					 amount: 1004,
					 goodsName: '나이스페이-상품',
                returnUrl: 'http://localhost:7978/#/ut/shop/pgreturn',
					 fnError: function (result) {
						  alert('고객용메시지 : ' + result.msg + '\n개발자확인용 : ' + result.errorMsg + '')
					 }
				});
		  },
		  random(){
				let length = 8;
				return Math.random().toString(16).substr(2, length);
		  }
	},
	 mounted() {

    }
}
</script>

<style scoped>

</style>
