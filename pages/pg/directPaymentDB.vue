<script>
import {mapState} from "vuex";

export default {
    components: {
    },
    data() {
        return {
            api_data: {
                name: '',
                orderIds: [],
                // clientId: '',
                mainZoneId: '',
                billedAmt: 0,
                payedAmt: 0,
                payMethod: '',
                payMethodNo: '',
                authCode: '',
                authDate: '',
                authTime: '',
                payed: '',
                payMachineId: '',
                payRawData: '',
                created: ''
            }
        };
    },
    middleware: "authentication",
    computed: {
        ...mapState('product', {
            orderData: state => state.orderData,
				mainZoneID: state => state.mainZoneID,
				payMethod: state => state.payMethod
        })
    },
	 mounted() {

	 },
    methods: {
          async api_payment(){
                if (this.api_payment_flag) {
                      tool_app.dialog_alert("데이터 전송중입니다.");
                      return;
                }

                this.api_payment_flag = true;

				    this.api_data.payMethod = this.payMethod;
                let payLoad = tool_app.getApiData(this.api_data);
                payLoad.name = "정기권 결제";
                payLoad.billedAmt = parseInt(this.orderData.price);
                payLoad.payedAmt = parseInt(this.orderData.price);
                payLoad.orderIds = [this.orderData.orderer.id];
                // payLoad.clientId = 'albtrs-20240315-145156-u01y8pt0r';
                payLoad.mainZoneId = this.mainZoneID;

                if(payLoad.payMethod==='CARD'){
                        payLoad.payMethodNo = '123124124124';
                }else{
                      payLoad.payMethodNo = '';
                }
                  payLoad.authCode = '123123';
                  payLoad.authDate = moment().format('YYYYMMDD');
                  payLoad.authTime = moment().format('HHmmss');
                  payLoad.payed = moment().format('YYYY-MM-DD HH:mm:ss');
                  payLoad.payMachineId = null;
                  payLoad.payRawData = JSON.stringify({rawData: 'rawData'});
                  payLoad.created = moment().format('YYYY-MM-DD HH:mm:ss');


                try {

                      let res = await mainapi.invokeAPI('/api/v1/product-payments', payLoad, 'POST');

                      if (res.data.code !== $const.ApiSuccessCode.POST) {
                            throw res.data.msg;
                            return false;
                      }

                      tool_app.dialog_success(`결제가 완료되었습니다.`);
                      this.$store.commit('product/SET_PAYMENT_ID', res.data.data.id);
                      this.$router.push('/ut/shop/complete');
                } catch (e) {
                      tool_app.log(e)
                      tool_app.dialog_alert(`결제에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
                } finally {
                      this.api_payment_flag = false;
                }
          }
    }
};
</script>

<template>
<div>

</div>
</template>

<style>
</style>
