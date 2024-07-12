<script>
import Selectbox01 from "../common/Selectbox01";

import {mapState} from "vuex";
import {required,minLength} from "vuelidate/lib/validators";
const validSpaceNspecialChar = function(value){
	 var specialCharsOrSpacesRegex = /[!@#$%^&*(),.?":{}|<>~\s]/;

	 // 문자열에 특수문자나 스페이스가 있는지 확인
	 return !specialCharsOrSpacesRegex.test(value);
}

let origin_format = {
    name: '',
    code: '',
    visitId: '',
    reservationId: '',
    cost: 1,
    discountFormId: '',
    type: '',
    bundle: '',
    sector: '',
    method: '',
    val: 0,
    val2: 0,
    bonus: 0,
    clientId: '',
    mainZoneId: '',
    discountedAmount: 0,
    matchingType: '',
    matchingCode: '',
    externalType: '',
    externalId: '',
    memo: '',
    details: '',
    autoApplied: true,
}

export default {
	 name: "Discount_fee",
	 components: {Selectbox01},
	 computed: {
		  ...mapState('webdiscount', {
				ParkingInfo: state => state.currentParkingInfo
		  }),
        ...mapState('fee', {
            feeInfo: state => state.fee
        })
	 },
	 watch: {
        selected_discount_product(newVal) {
            this.loadDiscountForm(newVal);
		  }
	 },
	 data() {
		  return {
				title: "웹할인 적용",
            parking_duration : 0,
            loading_fee : false,
            current_fee : 0,
				api_data: { //전송될 데이터
                    ...origin_format
				},
				api_flag : false,
            api_load_discountForm : false,
				option_discount: [],
            selected_discount_product : '',
				feeCheckInterval :null,
            optionsKeys : null,
            latestBill : {},
            selected_discount_form : null,
            selected_cost : '',
            init_temp_discount_list : false
		  };
	 },
	 validations: {
	 },
	 created() {
        let temp = moment().valueOf() - moment(this.ParkingInfo.entered).valueOf();
        this.parking_duration = tool_app.formattingTimeRegular(temp);
	 },
	 mounted() {
        let imageHeight = window.localStorage.getItem('discount_car_image_h');
        if(parseInt(imageHeight) > 0){
            document.getElementById('discount_car_image').style.height = imageHeight + 'px';
        }
        this.getList();
	 },
	 beforeDestroy(){
		  this.$store.dispatch('fee/clearFeeCheck');
	 },
	 methods: {
        reset() {
            this.api_data = {...origin_format};
        },
		  async feeCheck() {
            try {
                let res = await mainapi.invokeAPI_GET(`/api/v1/visits/${this.ParkingInfo.id}/calc-bill`, {})

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }

                let data = res.data.data;
                if(data.latestBill){
                    this.latestBill = JSON.parse(data.latestBill);
                    for(let prop in this.latestBill){
                        this.latestBill[prop] = parseInt(this.latestBill[prop]);
                        if(isNaN(this.latestBill[prop])){
                            this.latestBill[prop] = 0;
                        }
                    }
					 }

                //"latestBill": "{\"standardFee\":11500.0,\"finalFee\":10500.0,\"discountedFee\":10500.0,\"passedFee\":11500.0,\"adjustFee\":0}"


            } catch (e) {
                tool_app.dialog_alert(e);
            }

		  },
		  async getList(noFeeCheck) {
				//차량 정보 불러오기
				let vm = this;
				try {
					 let res = await vm.$parent.SET_CURRENT_CAR({id:vm.ParkingInfo.id,carNumber:vm.ParkingInfo.carNumber});
				} catch (e) {
					 tool_app.dialog_alert((e ? e : ''));
					 tool_app.log(e);
				} finally {
					 vm.$parent.loading_spinner('hide');
				}

				// window.feeCheckCount = 0;
				//
				// if(window.feeCheckInterval){
            //     clearInterval(window.feeCheckInterval);
            //     window.feeCheckInterval = null;
				// }
				//
            // window.feeCheckInterval = setInterval(function(){
            //     if(window.feeCheckCount > 10){
            //         clearInterval(window.feeCheckInterval);
            //         window.feeCheckInterval = null;
				// 	 }
            //     window.feeCheckCount++;
            //     vm.feeCheck();
            // },1000)

				this.temp_discount_list();

				this.$store.dispatch('fee/polingFeeCheck',vm.ParkingInfo.id);

                return;

            try {
                let payload = {
                    tenantId: this.$store.getters['auth/currentUser'].id,
                    page: 0,
                    size: 10,
                    sort: 'created,DESC'
                }

                let res = await mainapi.invokeAPI_GET('/api/v1/discount-accounts', payload)

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }

                let data = res.data.data;

                data.items.forEach(function (value) {

                })



            } catch (e) {
                tool_app.dialog_alert(e);
            }

		  },
		  async temp_discount_list() {
				if(this.init_temp_discount_list) return false;
            let orderArr = [];

            try {
                let payload = {
                    page: 0,
                    size: 10,
                    sort: 'created,DESC'
                }

                let res = await mainapi.invokeAPI_GET('/api/v1/product-payments', payload)

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }

                let data = res.data.data;



					 for(let i=0;i<data.items.length;i++){

                         try{

                             let item = data.items[i];


                             let res = await mainapi.invokeAPI_GET('/api/v1/product-payments/'+item.id, {})

                             if (res.data.code !== $const.ApiSuccessCode.GET) {
                                 tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                             }

                             let data02 = res.data.data;

									  if(data02.orders[0].type === 'DISCOUNT'){
                                 orderArr.push(data02.orders[0].id);
									  }
								 }catch (e) {

                         }
                }
            } catch (e) {
                tool_app.dialog_alert(e);
            }

            try {
                for (let i = 0; i < orderArr.length; i++) {
                    let res = await mainapi.invokeAPI_GET('/api/v1/orders/' + orderArr[i], {})
                    if (res.data.code !== $const.ApiSuccessCode.GET) {
                        tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                    }
                    let data = res.data.data;

                    {
                        let res = await mainapi.invokeAPI_GET('/api/v1/discount-products/' + data.product.id, {}, 'GET')

                        if (res.data.code !== $const.ApiSuccessCode.GET) {
                            tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                        }
                        const data02 = res.data.data
								this.option_discount.push(data02.discountForm);
						  }

                }

                this.init_temp_discount_list = true;
            }catch (e) {
                tool_app.dialog_alert(e);
            }
        },
		  async api_use_webdiscount() {
				let vm = this;

            if(vm.api_flag === true) return false;
            let msg = '등록';
            try {

                let payload = {
                    name: '입주사 할인',
                    code: this.selected_discount_form.code,
                    visitId: this.ParkingInfo.id,
                    reservationId: null,
                    cost: this.selected_discount_form.type === "POINTS" ? this.selected_cost : 1,
                    discountFormId: this.selected_discount_form.id,
                    type: this.selected_discount_form.type,
                    bundle: this.selected_discount_form.bundle,
                    sector: this.selected_discount_form.sector,
                    method: this.selected_discount_form.method,
                    val: this.selected_discount_form.val,
                    val2: this.selected_discount_form.val2,
                    bonus: this.selected_discount_form.bonus,
                    clientId: this.selected_discount_form.client.id,
                    mainZoneId: this.selected_discount_form.mainZone.id,
                    discountedAmount: 0,
                    matchingType: null,
                    matchingCode: null,
                    externalType: null,
                    externalId: null,
                    memo: null,
                    details: null,
                    autoApplied: true,
					 }


                // let payLoad = tool_app.getApiData(this.api_data);
                // payLoad.cost = parseInt(payLoad.cost);
                // payLoad.val = parseInt(payLoad.val);
                // payLoad.val2 = parseInt(payLoad.val2);
                // payLoad.bonus = parseInt(payLoad.bonus);
                // payLoad.discountedAmount = parseInt(payLoad.discountedAmount);

                let url = '/api/v1/discounts';
                let res = await mainapi.invokeAPI(url, payload, 'POST');

                let successCode = $const.ApiSuccessCode.POST;
                if (res.data.code !== successCode) {
                    throw res.data.msg;
                    return false;
                }

                this.api_submitted = false;
                this.api_flag = false;
                this.reset();
                this.getList();
                tool_app.dialog_success(`할인 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`할인 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }
		  },
        async loadDiscountForm(id) {
            try {
                if(this.mode==='edit') return false;
                if (this.api_load_discountForm) {
                    tool_app.dialog_alert("데이터 전송중입니다.");
                    return;
                }
                this.api_load_discountForm = true;


                const res = await mainapi.invokeAPI_GET('/api/v1/discount-forms/' + id, {}, 'GET')

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }

                let data = res.data.data;

                // for (let prop in this.api_data) {
                //     //if(prop==='discountFormId' || prop==='name' || prop==='code') continue;
                //     let flag = tool_app.covertDetailToEdit(prop, this.api_data, data);
                //     if (flag) continue;
					 //
                //     if(data[prop]){
                //         this.api_data[prop] = data[prop];
                //     }
                // }
					 this.selected_discount_form = data;
                if(data.type === "POINTS"){
                    this.optionsKeys = data.keys;
                }else{
                    this.optionsKeys = null;
                }
                tool_app.log(this.api_data)

            } catch (e) {
                tool_app.dialog_alert(e);
            } finally {
                this.api_load_discountForm = false;
            }
        },
        setImageHeight(){

            const img = document.getElementById('discount_car_image');
            const imageHeight = img.clientHeight;
            console.log('Image height:', imageHeight);
            window.localStorage.setItem('discount_car_image_h',imageHeight);
            img.style.height = imageHeight + 'px';
		  }
	 }

}
</script>
<template>
	 <div class="inner">
		  <div class="discount_fee position-relative">
				<div class="tit03">
					 <h3>{{ ParkingInfo.carNumber }}</h3>
					 <p class="time">{{ ParkingInfo.entered }} ({{ parking_duration }}
						  주차중,
						  <b-spinner variant="secondary" role="status" style="width:12px;height:12px;"
										 v-show="loading_fee"></b-spinner>
						  <span v-show="!loading_fee">{{current_fee | three_comma }}원</span>)
					 </p>
				</div>
				  <div>
						  <img id="discount_car_image" src="https://cdn.kakaopark.com/parking_images/4eea64f3-f201-47c2-9495-a598668467ff.jpg" style="width:100%" @load="setImageHeight"/>
				  </div>
				<div style="padding: 10px 20px">
                  <dl class="row mb-0">
                        <dt class="col-6 col-md-9 text-right" style="font-weight:normal">발생한 주차 요금</dt>
                        <dd class="col-6 col-md-3 bold text-right" >{{ isNaN(feeInfo.standardFee) ? 0 : feeInfo.standardFee | three_comma }} 원</dd>
                        <dt class="col-6 col-md-9 text-right" style="font-weight:normal">할인 금액</dt>
                        <dd class="col-6 col-md-3 bold text-right">{{ isNaN(feeInfo.standardFee-feeInfo.discountedFee) ? 0 : (feeInfo.standardFee-feeInfo.discountedFee) | three_comma }} 원</dd>
                        <dt class="col-6 col-md-9 text-right" style="font-weight:normal">정기권 할인 금액</dt>
                        <dd class="col-6 col-md-3 bold text-right">{{ isNaN(feeInfo.standardFee-feeInfo.passedFee) ? 0 : (feeInfo.standardFee-feeInfo.passedFee) | three_comma }} 원</dd>
                        <dt class="col-6 col-md-9 text-right" style="font-weight:normal">조정 금액</dt>
                        <dd class="col-6 col-md-3 bold text-right">{{ isNaN(feeInfo.adjustFee) ? 0 : feeInfo.adjustFee | three_comma }} 원</dd>
                        <dt class="col-6 col-md-9 mb-0 text-right" style="font-weight:normal">실제 결제 금액</dt>
                        <dd class="col-6 col-md-3 mb-0 bold text-right">{{ isNaN(feeInfo.finalFee) ? 0 : feeInfo.finalFee | three_comma }} 원</dd>
                  </dl>
				</div>
				<div class="input_box">
					 <select class="form-select mt-2 form-select-lg" v-model="selected_discount_product">
							 <option value="">할인권을 선택하세요.</option>
							 <option v-for="item in option_discount" :value="item.id">{{item.name}}</option>
					 </select>
                  <div v-if="optionsKeys !== null" class="mt-3">
                        <select class="form-select form-select-lg" v-model="selected_cost">
                              <option v-for="(value, key) in optionsKeys" :value="value.cost">
<!--                                    {{ `${value.name}, 타입 : ${value.type}, 할인값 : ${value.val}, 비용 : ${value.cost}`}}-->
												{{value.name}} 할인
										</option>
                        </select>
                  </div>
				</div>
				<div class="btn_wrap mt-3">
					 <button class="btn btn-lg btn-warning w-100 btn_m_lg" @click="api_use_webdiscount">등록하기</button>
				</div>


		  </div>
	 </div>
</template>

<style scoped>
.btn-change-feePlan {
	 position: absolute;
	 bottom: 0;
	 height: 270px;
	 width: 100%;
	 line-height: 270px;
	 z-index: 2;
}

.btn-change-feePlan .btn {
	 position: absolute;
	 left: 50%;
	 top: 50%;
	 transform: translate(-50%, -50%);
	 padding: 5% 10%;
	 word-break: keep-all;
}

.btn-change-feePlan:before {
	 position: absolute;
	 content: '';
	 width: 100%;
	 height: 100%;
	 background-color: #000;
	 opacity: 0.5;
	 z-index: -1;
}
</style>
