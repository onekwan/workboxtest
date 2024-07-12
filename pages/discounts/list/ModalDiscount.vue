<script>
import {required} from "vuelidate/lib/validators";
import modal_default from "@/mixin/modal_default";

// 필수값 받음
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
  autoApplied: false,
}

// let origin_format = {
//   "name": "",
//   "code": "",
//   "visitId": "",
//   "reservationId": null,
//   "discountAccountId": null,
//   "discountFormId": null,
//   "type": "",
//   "bundle": null,
//   "sector": "",
//   "method": "",
//   "val": 0,
//   "val2": null,
//   "bonus": 0,
//   "clientId": "",
//   "mainZoneId": "",
//   "discountedAmount": null,
//   "matchingType": null,
//   "matchingCode": null,
//   "externalType": null,
//   "externalId": null,
//   "memo": null,
//   "details": "",
//   "autoApplied": false
// }


//TODO
// 404 이슈
export default {
  mixins : [modal_default],
  data() {
    return {
      api_data: {
        ...origin_format
      },
      api_load_discountForm: false,
      optionsKeys: null,
		  carNumber : '',
		  option_zones : []
    };
  },
	 validations: {
		  api_data : {
				name: {required},
				visitId : {required},
				discountFormId : {required},
				type: {required},
				sector: {required},
				method: {required},
				mainZoneId: {required}
		  }
	 },
  created() {

  },
  computed: {
    disabledWrite() {
      return this.api_load_discountForm === true || this.api_data.discountFormId === '';
    }
  },
  mounted() {

  },
  methods: {
    show(visitID,carNumber) {
      this.reset();
      this.$refs['modal'].show();
      this.api_submitted = false;
      this.api_flag = false;
      if (this.mode === 'edit') {
        let vm = this;
        setTimeout(function () {
          vm.setPageData();
        }, 100)
      }else{
        if(visitID) {
				this.api_data.visitId = visitID;
				if(carNumber) {
					this.carNumber = carNumber;
				}else{
					 this.carNumber = visitID;
				}
		  }
      }
    },
    reset() {
      this.api_data = {...origin_format};
    },
    setPageData() {
      for (let prop in this.api_data) {
        this.api_data[prop] = this.pageData[prop];
      }
    },
    async api_request() {
      if (this.api_flag) {
        tool_app.dialog_alert("데이터 전송중입니다.");
        return;
      }

      this.api_flag = true;
      this.api_submitted = true;

		  if (this.checkInValidation({
				create : ['name','visitId', 'discountFormId','type','sector','method','mainZoneId'],
				edit : ['name','status','healthStatus']
		  })) {
				this.api_flag = false;
				return;
		  }


      let payLoad = tool_app.getApiData(this.api_data);
      payLoad.cost = parseInt(payLoad.cost);
      payLoad.val = parseInt(payLoad.val);
      payLoad.val2 = parseInt(payLoad.val2);
      payLoad.bonus = parseInt(payLoad.bonus);
      payLoad.discountedAmount = parseInt(payLoad.discountedAmount);

      let msg = this.mode === 'edit' ? '수정' : '등록';
      try {
        let url = this.mode === 'edit' ? '/api/v1/discounts/' + this.pageData.id : '/api/v1/discounts';
        let res = await mainapi.invokeAPI(url, payLoad, this.mode === 'edit' ? 'PATCH' : 'POST');

        let successCode = this.mode === 'edit' ? $const.ApiSuccessCode.PATCH : $const.ApiSuccessCode.POST;
        if (res.data.code !== successCode) {
          throw res.data.msg;
        }

        this.hide();
        this.api_submitted = false;
        this.api_flag = false;
        if (this.callback) this.callback();
        tool_app.dialog_success(`할인 ${msg}이 완료되었습니다.`);
      } catch (e) {
        tool_app.log(e)
        tool_app.dialog_alert(`할인 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
      } finally {
        this.api_flag = false;
      }
    },
    async loadDiscountForm(value) {
      try {
			 if(value===''){
				  this.reset();
				  return;
			 }
        if(this.mode==='edit') return false;
        if (this.api_load_discountForm) {
          tool_app.dialog_alert("데이터 전송중입니다.");
          return;
        }
        this.api_flag = true;
        this.api_load_discountForm = true;


        const res = await mainapi.invokeAPI_GET('/api/v1/discount-forms/' + this.api_data.discountFormId, {}, 'GET')

        if (res.data.code !== $const.ApiSuccessCode.GET) {
          tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
        }

        let data = res.data.data;

        for (let prop in this.api_data) {
          if(prop==='discountFormId') continue;
          let flag = tool_app.covertDetailToEdit02(prop, this.api_data, data);
          if (flag) continue;
				if(prop==='mainZoneId'){
					 this.api_data[prop] = data.mainZone.id;
					 this.option_zones = [data.mainZone];
				}else if(data[prop]){
            this.api_data[prop] = data[prop];
          }
        }

        if(data.type === "POINTS"){
            this.optionsKeys = data.keys;
            this.api_data.cost=this.optionsKeys[0] ? this.optionsKeys[0].cost : 1;
        }else{
            this.optionsKeys = null;
            this.api_data.cost=1;
        }

      } catch (e) {
        tool_app.dialog_alert(e);
      } finally {
        this.api_flag = false;
        this.api_load_discountForm = false;
      }
    }
  }
};
</script>

<template>
  <div>
    <b-modal ref="modal" id="modal-standard" :title="'할인 ' + (mode === 'edit' ? '수정' : '등록')"
             title-class="font-18" size="lg">
      <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
      <b-container>
        <b-row>
          <b-col cols="12" md="6">
            <label class="mb-2 required">할인 유형 UID</label>
				  <custom-search-select v-model="api_data.discountFormId"
												:init-data="this.pageData && this.pageData.discountForm ? this.pageData.discountForm : null"
												:type="'discountform'"  @input="loadDiscountForm" :disabled="mode==='edit'"
												value-field="id" label-field="name"></custom-search-select>


            <label class="mt-3 mb-2 required">이름</label>
            <input type="text" class="form-control" v-model="api_data.name" :disabled="disabledWrite"/>

            <label class="mt-3 mb-2">관리 코드</label>
            <input type="text" class="form-control" v-model="api_data.code" :disabled="disabledWrite"/>

            <label class="mt-3 mb-2 required">차량번호</label>
            <input type="text" class="form-control" v-model="carNumber" :disabled="true"/>

<!--            <label class="mt-3 mb-2">예약</label>-->
<!--            <input type="text" class="form-control" v-model="api_data.reservationId" :disabled="disabledWrite"/>-->

            <label class="mt-3 mb-2">비용(cost)</label>
            <div v-if="optionsKeys !== null">
              <select class="form-select" v-model="api_data.cost" :disabled="disabledWrite">
                <option v-for="(value, key) in optionsKeys" :value="value.cost" :key="key">
                  {{ `${value.name}, 타입 : ${value.type}, 할인값 : ${value.val}, 비용 : ${value.cost}`}}</option>
               </select>
            </div>
<!--            <div v-else>-->
<!--              <input type="text" class="form-control" v-model="api_data.cost" :disabled="true"/>-->
<!--            </div>-->








            <label class="mt-3 mb-2 required">종류</label>
            <select class="form-select" v-model="api_data.type" :disabled="true">
              <option v-for="(value, key) in discountType" :value="key" :key="key">{{ value }}</option>
            </select>

            <label class="mt-3 mb-2">할인 묶음</label>
            <input type="text" class="form-control" v-model="api_data.bundle" :disabled="true"/>

            <label class="mt-3 mb-2 required">부문</label>
            <select class="form-select" v-model="api_data.sector" :disabled="true">
              <option v-for="(value, key) in discountSector" :value="key" :key="key">{{ value }}</option>
            </select>

            <label class="mt-3 mb-2 required">적용 방식</label>
            <select class="form-select" v-model="api_data.method" :disabled="true">
              <option v-for="(value, key) in discountMethod" :value="key" :key="key">{{ value }}</option>
            </select>

            <div v-if="optionsKeys === null">
              <label class="mt-3 mb-2">할인 값</label>
              <input type="text" class="form-control" v-model="api_data.val" :disabled="true"/>

					 <div v-if="api_data.val2 && api_data.val2>0">
						  <label class="mt-3 mb-2">할인 값2</label>
						  <input type="text" class="form-control" v-model="api_data.val2" :disabled="true"/>
					 </div>
            </div>

          </b-col>

          <b-col cols="12" md="6">
            <label class="mb-2">추가 할인</label>
            <input type="text" class="form-control" v-model="api_data.bonus" :disabled="disabledWrite"/>

<!--            <label class="mt-3 mb-2">할인을 제공하는 고객사 *</label>-->
<!--            <custom-multi-select v-model="api_data.clientId" :options="option_clients"  :disabled="true"-->
<!--                                 label="name" value-field="id"-->
<!--                                 placeholder="고객사를 선택해주세요."/>-->


            <label class="mt-3 mb-2 required">기본 주차장</label>
            <custom-multi-select v-model="api_data.mainZoneId" :options="option_zones"  :disabled="true"
                                 label="name" value-field="id"
                                 placeholder="기본 주차장을 선택해주세요."/>

<!--            <label class="mt-3 mb-2">실제 할인이 반영된 금액</label>-->
<!--            <input type="text" class="form-control" v-model="api_data.discountedAmount" :disabled="disabledWrite"/>-->

<!--            <label class="mt-3 mb-2">바코드 등을 이용해 발급할 때 그 유형</label>-->
<!--            <input type="text" class="form-control" v-model="api_data.matchingType" :disabled="disabledWrite"/>-->

<!--            <label class="mt-3 mb-2">바코드 등을 이용해 발급할 때, 그 코드</label>-->
<!--            <input type="text" class="form-control" v-model="api_data.matchingCode" :disabled="disabledWrite"/>-->

<!--            <label class="mt-3 mb-2">외부에서 발행된 경우 그 서비스</label>-->
<!--            <input type="text" class="form-control" v-model="api_data.externalType" :disabled="disabledWrite"/>-->

<!--            <label class="mt-3 mb-2">외부에서 발행된 경우 전송된 아이디</label>-->
<!--            <input type="text" class="form-control" v-model="api_data.externalId" :disabled="disabledWrite"/>-->

            <label class="mt-3 mb-2">메모</label>
            <input type="text" class="form-control" v-model="api_data.memo" :disabled="disabledWrite"/>

<!--            <label class="mt-3 mb-2">부가 사항</label>-->
<!--            <input type="text" class="form-control" v-model="api_data.details" :disabled="disabledWrite"/>-->

            <label class="mt-3 mb-2">자동 발급 여부</label>
            <select class="form-select" v-model="api_data.autoApplied" :disabled="true">
              <option value="">선택하세요</option>
              <option :value="true">예</option>
              <option :value="false">아니요</option>
            </select>
          </b-col>
        </b-row>

      </b-container>
      <template #modal-footer>
        <div class="w-100" style="text-align:right">
          <button class="btn btn-secondary" @click="hide">취소</button>
          <button class="btn" :class="mode==='edit' ? 'btn-warning' : 'btn-info'"
                  @click="api_request">{{ mode === 'edit' ? '수정' : '등록' }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
