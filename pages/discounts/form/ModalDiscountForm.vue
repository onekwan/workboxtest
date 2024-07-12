<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

// 필수값 받음
let origin_format = {
  name: '',
  code: '',
  type: 'COUPON',
  bundle: null,
  pattern: null,
  sector: 'PRIVATE',
  free: false,
  method: 'TIME',
  val: 0,
  val2: 0,
  bonus: 0,
  keys: '[]',
  discountLimitId: '',
  price: '',
  refillAmt: 1,
  autoRefill: 'NONE',
  mainZoneId: '',
  zoneGroupIds: [],
  details: ''
}
function isGreaterThanZero(value){
  let passed = tool_app.vuelidate.isGreaterThanZero(value);
  return passed;
}

// let origin_format = {
//   "name": "월 충전 할인",
//   "code": "월충전",
//   "type": "POINTS",
//   "bundle": null,
//   "pattern": null,
//   "sector": "PRIVATE",
//   "free": false,
//   "method": "KEYS",
//   "val": null,
//   "val2": null,
//   "bonus": null,
//   "keys": "[{\"name\": \"50분\",\"type\": \"M\",\"val\": 50,\"cost\": 1000},{\"name\": \"3000원\",\"unit\": \"W\",\"val\": 3000,\"cost\": 2500}]",
//   "discountLimitId": null,
//   "price": 20000,
//   "refillAmt": 10000,
//   "autoRefill": "MONTHLY2",
//   "clientId": "albtrs-20240202-150431-28j1nww67",
//   "mainZoneId": "dt000110",
//   "zoneGroupIds": [],
//   "details": "{\"sample\":1}"
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
      infoText : {
        TIME : '(예) 1시간일 경우 60, 단위 분',
        AMOUNT : '(예) 1,000원일 경우 1000, 단위 원',
        RATE : '(예) 50%일 경우 50, 단위 %'
      },
		  option_zones : []
    };
  },
  validations: {
    api_data : {
      name: {required},
      type: {required},
      sector: {required},
		  free: {required},
      method: {required},
      mainZoneId : {required},
      refillAmt : {isGreaterThanZero}
    }
  },
  computed: {
    infoVal(){
      switch (this.api_data.method) {
        case 'TIME':
          return this.infoText.TIME;
        case 'AMOUNT':
          return this.infoText.AMOUNT;
        case 'AMOUNT2':
          return this.infoText.TIME;
        case 'RATE':
          return this.infoText.RATE;
        case 'RATE2':
          return this.infoText.TIME;
        default:
          return '';
      }
    },
    infoVal2(){
      switch (this.api_data.method) {
        case 'TIME':
          return '';
        case 'AMOUNT':
          return '';
        case 'AMOUNT2':
          return this.infoText.AMOUNT;
        case 'RATE':
          return '';
        case 'RATE2':
          return this.infoText.RATE;
        default:
          return '';
      }
    },
    useInputVal01(){
      if(this.api_data.method === 'FIXED' || this.api_data.method === 'KEYS' || this.api_data.method === 'NONE'){
        return true;
      }else{
        return false;
      }
    },
    useInputVal02(){
      if(this.api_data.method === 'AMOUNT2' || this.api_data.method === 'RATE2' ){
        return false;
      }else{
        return true;
      }
    }
  },
  mounted() {
  },
  methods: {
    reset() {
      this.api_data = {...origin_format};
    },
    setPageData() {
      for (let prop in this.api_data) {
        let flag = tool_app.covertDetailToEdit02(prop, this.api_data, this.pageData);
        if (flag) continue;
			 if(prop ==='refillAmt'){
				  if(this.pageData[prop]){
						this.api_data[prop] = this.pageData[prop];
				  }else{
						this.api_data[prop] = 1;
				  }
			 }else if(prop==='mainZoneId'){
				  this.option_zones = [this.pageData['mainZone']];
				  this.api_data.mainZoneId = this.pageData['mainZone'].id;
			 }else if(this.pageData[prop]) {
				  this.api_data[prop] = this.pageData[prop];
			 }
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
				create : ['name','type', 'sector','free','method','mainZoneId'],
				edit : ['name','type','mainZoneId']
		  })) {
				this.api_flag = false;
				return;
		  }

      let payLoad = tool_app.getApiData(this.api_data);
      payLoad.zoneGroupIds = tool_app.emptyArrayNull(payLoad.zoneGroupIds);
      payLoad.val = parseInt(payLoad.val);
      payLoad.val2 = parseInt(payLoad.val2);
      payLoad.bonus = parseInt(payLoad.bonus);
      payLoad.price = parseInt(payLoad.price);
      payLoad.refillAmt = parseInt(payLoad.refillAmt);

      let _keys = tool_app.makeJSONStringData(payLoad.keys);
      if (_keys === null) {
        tool_app.dialog_alert("옵션이 JSON 형식이 아닙니다.");
        this.api_flag = false;
        return;
      }
      payLoad.keys = _keys;

      let jsStr_details = tool_app.makeJSONStringData(payLoad.details);
      if (jsStr_details === null) {
        tool_app.dialog_alert("부가 사항이 JSON 형식이 아닙니다.");
        this.api_flag = false;
        return;
      }
      payLoad.details = jsStr_details;

      if(payLoad.type==='COUPON'){
        payLoad.keys = null;
      }else{
        let keys = JSON.parse(payLoad.keys);
        if(!Array.isArray(keys)){
          tool_app.dialog_alert("type이 POINTS일 때 keys는 배열 형식이어야 합니다.");
          this.api_flag = false;
          return;
        }else if(Array.isArray(keys) && keys.length === 0){
            tool_app.dialog_alert("type이 POINTS일 때 keys는 필수입니다.");
            this.api_flag = false;
            return;
         }
      }

		  if(payLoad.autoRefill==='NONE') payLoad.refillAmt = 1;

      if (this.mode === 'edit') {
        let fields = [];
        for (let prop in payLoad) {
          fields.push(prop);
        }
        payLoad.fields = fields;
      }


      let msg = this.mode === 'edit' ? '수정' : '등록';
      try {
        let url = this.mode === 'edit' ? '/api/v1/discount-forms/' + this.pageData.id : '/api/v1/discount-forms';
        let res = await mainapi.invokeAPI(url, payLoad, this.mode === 'edit' ? 'PATCH' : 'POST');

        let successCode = this.mode === 'edit' ? $const.ApiSuccessCode.PATCH : $const.ApiSuccessCode.POST;
        if (res.data.code !== successCode) {
          throw res.data.msg;
          return false;
        }

        this.hide();
        this.api_submitted = false;
        this.api_flag = false;
        if (this.callback) this.callback();
        tool_app.dialog_success(`할인 유형 ${msg}이 완료되었습니다.`);
      } catch (e) {
        tool_app.log(e)
        tool_app.dialog_alert(`할인 유형 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
      } finally {
        this.api_flag = false;
      }
    },
		onChangeAutoRefill(){
			 if(this.api_data.autoRefill==='NONE'){
				  this.api_data.refillAmt = 1;
			 }
		},
    change_type(){
      if(this.api_data.type === 'POINTS') {
        this.api_data.method = 'KEYS';
      }else{
        this.api_data.method = 'TIME';
      }
    },
    change_method(){
      if(this.api_data.method === 'KEYS' || this.api_data.method === 'NONE' || this.api_data.method === 'FIXED'){
        this.api_data.val = 0;
        this.api_data.val2 = 0;
      }else if(this.api_data.method === 'TIME' || this.api_data.method === 'AMOUNT' || this.api_data.method === 'RATE'){
        this.api_data.val2 = 0;
      }
    },
		changeClient(value,item,init){
			 if(init) return;
			 if(value == ''){
				  this.option_zones = [];
				  this.api_data.mainZoneId = '';
				  return;
			 }

			 this.loadZones();
		},
		async loadZones() {
			 try {

				  if(this.api_data.clientId===''){
						return;
				  }

				  let payload = {
						clientId: this.api_data.clientId,
						page: 0,
						size: 100,
						sort: 'created,DESC'
				  }

				  let res = await mainapi.invokeAPI_GET('/api/v1/zones', payload)

				  if (res.data.code !== $const.ApiSuccessCode.GET) {
						tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
				  }

				  let data = res.data.data;

				  data.items.forEach(function(item){
						let siteName = item.site ? (item.site.name || item.site.siteName || '') : '';
						item.name = item.name+'('+siteName + ')';
				  })

				  this.option_zones = data.items;
			 } catch (e) {
				  tool_app.dialog_alert(e);
			 } finally {
				  this.api_flag = false;
			 }
		}
  }
};
</script>

<template>
  <div>
    <b-modal ref="modal" id="modal-standard" :title="'할인 유형' + (mode === 'edit' ? '수정' : '등록')"
             title-class="font-18" size="lg">
      <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
      <b-container>
        <b-row>
          <b-col cols="12" md="6">

            <label class="mb-2 required">할인권 유형 이름</label>
            <input type="text" class="form-control" v-model="api_data.name" :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"/>
            <div
                  v-if="api_submitted && $v.api_data.name.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.name.required"
                                                >필수 입력값입니다.</span>
            </div>

            <label class="mt-3 mb-2">관리 코드</label>
            <input type="text" class="form-control" v-model="api_data.code" :class="{ 'is-invalid': api_submitted && $v.api_data.code.$error }"/>
            <div
                  v-if="api_submitted && $v.api_data.code.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.code.required"
                                                >필수 입력값입니다.</span>
            </div>

            <label class="mt-3 mb-2 required">종류</label>
            <select class="form-select" v-model="api_data.type" @change="change_type" :class="{ 'is-invalid': api_submitted && $v.api_data.type.$error }">
              <option v-for="(value, key) in discountType" :value="key" :key="key">{{ value }}</option>
            </select>
            <div
                  v-if="api_submitted && $v.api_data.type.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.type.required"
                                                >필수 입력값입니다.</span>
            </div>

            <label class="mt-3 mb-2">묶음 이름</label>
            <input type="text" class="form-control" v-model="api_data.bundle"/>

            <label class="mt-3 mb-2">매칭 패턴</label>
            <input type="text" class="form-control" v-model="api_data.pattern"/>

            <label class="mt-3 mb-2 required">부문</label>
            <select class="form-select" v-model="api_data.sector" :class="{ 'is-invalid': api_submitted && $v.api_data.sector.$error }">
              <option v-for="(value, key) in discountSector" :value="key" :key="key">{{ value }}</option>
            </select>
            <div
                  v-if="api_submitted && $v.api_data.sector.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.sector.required"
                                                >필수 입력값입니다.</span>
            </div>

            <label class="mt-3 mb-2 required">무료 제공 여부</label>
            <select class="form-select" v-model="api_data.free">
              <option :value="true">예</option>
              <option :value="false">아니요</option>
            </select>

            <label class="mt-3 mb-2 required">적용 방식</label>
            <select class="form-select" v-model="api_data.method" :disabled="this.api_data.type === 'POINTS'" @change="change_method" :class="{ 'is-invalid': api_submitted && $v.api_data.method.$error }">
              <option v-for="(value, key) in discountMethod" :value="key" :key="key">{{ value }}</option>
            </select>
            <div
                  v-if="api_submitted && $v.api_data.method.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.method.required"
                                                >필수 입력값입니다.</span>
            </div>

            <label class="mt-3 mb-2">할인 값 <span class="text-muted">{{infoVal}}</span></label>
            <input type="text" class="form-control" v-model="api_data.val" v-mask="'########'" :disabled="useInputVal01"/>

            <label class="mt-3 mb-2">할인 값2 <span class="text-muted"> {{infoVal2}}</span></label>
            <input type="text" class="form-control" v-model="api_data.val2" v-mask="'########'" :disabled="useInputVal02"/>

            <label class="mt-3 mb-2">추가 할인</label>
            <input type="text" class="form-control" v-model="api_data.bonus" v-mask="'########'"/>

            <div  v-if="api_data.type==='POINTS'">
              <label class="mt-3 mb-2">포인트형에서 사용 할 선택 옵션</label>
              <input type="text" class="form-control" v-model="api_data.keys" :disabled="api_data.type==='COUPON'"  :class="{ 'is-invalid': api_submitted && api_data.keys === '' }"/>
              <div
                    v-if="api_submitted && api_data.keys === ''"
                    class="invalid-feedback"
              >
																<span>필수 입력값입니다.</span>
              </div>
            </div>
          </b-col>

          <b-col cols="12" md="6">
            <label class="mb-2">할인 제한 UID</label>
            <input type="text" class="form-control" v-model="api_data.discountLimitId"/>

            <label class="mt-3 mb-2">권장 판매 가격</label>
            <input type="text" class="form-control" v-model="api_data.price" v-mask="'#############'" :class="{ 'is-invalid': api_submitted && $v.api_data.price.$error }"/>
            <div
                  v-if="api_submitted && $v.api_data.price.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.price.required"
                                                >필수 입력값입니다.</span>
            </div>

				  <label class="mt-3 mb-2">1회분의 충전량</label>
				  <input type="text" class="form-control" v-model="api_data.refillAmt" v-mask="'########'" :class="{ 'is-invalid': api_submitted && $v.api_data.refillAmt.$error }"/>
				  <div
						  v-if="api_submitted && $v.api_data.refillAmt.$error"
						  class="invalid-feedback"
				  >
																<span v-if="!$v.api_data.refillAmt.isGreaterThanZero"
																>0보다 큰 숫자이어야 합니다.</span>
				  </div>


            <label class="mt-3 mb-2">자동 충전 방식</label>
            <select class="form-select" v-model="api_data.autoRefill"  @change="onChangeAutoRefill"
						  :class="{ 'is-invalid': api_submitted && $v.api_data.autoRefill.$error }">
              <option v-for="(value, key) in passAutoRefill " :value="key" :key="key">{{ value }}</option>
            </select>
            <div
                  v-if="api_submitted && $v.api_data.autoRefill.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.autoRefill.required"
                                                >필수 입력값입니다.</span>
            </div>




<!--            <label class="mt-3 mb-2">할인을 제공하는 고객사(필수)</label>-->
<!--				  <custom-search-select v-model="api_data.clientId" :type="'clients'"-->
<!--												@input="changeClient"-->
<!--												:init-data="this.pageData && this.pageData.client ? this.pageData.client : null"-->
<!--												:class="{ 'is-invalid': api_submitted && $v.api_data.clientId.$error }"-->
<!--												value-field="id" label-field="name"></custom-search-select>-->
<!--            <div-->
<!--                  v-if="api_submitted && $v.api_data.clientId.$error"-->
<!--                  class="invalid-feedback"-->
<!--            >-->
<!--																<span v-if="!$v.api_data.clientId.required"-->
<!--                                                >필수 입력값입니다.</span>-->
<!--            </div>-->


            <label class="mt-3 mb-2 required">기본 주차장</label>
				  <custom-search-select v-model="api_data.mainZoneId" :type="'zones'" :is-site-name="true"
												:init-data="this.pageData && this.pageData.zone ? this.pageData.zone : null"
												:class="{ 'is-invalid': api_submitted && $v.api_data.mainZoneId.$error }"
												value-field="id" label-field="name"></custom-search-select>
            <div
                  v-if="api_submitted && $v.api_data.mainZoneId.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.mainZoneId.required"
                                                >필수 입력값입니다.</span>
            </div>


            <label class="mt-3 mb-2">적용 가능한 주차장 그룹</label>
				  <custom-search-select v-model="api_data.zoneGroupIds" :type="'zoneGroups'" :multiple="true"
												:init-data="this.pageData && this.pageData.zoneGroup ? this.pageData.zoneGroup : null"
												value-field="id" label-field="name"></custom-search-select>



            <label class="mt-3 mb-2">부가 사항</label>
            <input type="text" class="form-control" v-model="api_data.details"/>
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
