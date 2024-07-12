<template>
		<div>
            <directPaymentDB ref="ref_directPaymentDB" />
            <nicepayPG ref="ref_nicepayPG"/>
		</div>
</template>

<script>
import directPaymentDB from "@/pages/pg/directPaymentDB.vue";
import nicepayPG from "@/pages/pg/nicepayPG.vue";
export default {
    name: "pg통합관리",
	 components : {
        directPaymentDB,
         nicepayPG
	 },
	 data(){
        return {
            paymentData : {},
            mainZoneId : '',
            PayMethod : ''
		  }
	 },
	 created(){

	 },
    methods: {
        open_module(opt) {
            this.paymentData = opt.data;
            this.mainZoneId = opt.mainZoneId;
            this.PayMethod = opt.PayMethod;
            this.$store.commit('product/SET_ORDER_DATA', this.paymentData);
            this.$store.commit('product/SET_MAIN_ZONE_ID', this.mainZoneId);
            this.$store.commit('product/SET_PAY_METHOD', this.PayMethod);
            if (opt.type === 'direct') {
					this.$refs.ref_directPaymentDB.api_payment();
            } else if (opt.type === 'nicepay') {
				   this.$refs.ref_nicepayPG.connectPG();
            }
        }
    }
}
</script>

<style scoped>

</style>
