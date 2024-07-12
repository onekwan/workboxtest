<script>
import {required} from "vuelidate/lib/validators";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "carNumber": "",
    "type": "",
    "status": "",
    "category": "",
    "zoneId": "",
    "enterType": "MANUAL2",
    "enterMachineId": "",
    "manualEnter": true,
    "externalEnter": false,
    "benefits": "",
    "memo": "",
    "details": "",
	 "entered" : "",

	 /* 수정에서 추가되는 컬럼 */
	 "exitType" : '', // string 출차 유형
	 "exited" : '',// datetime 출차 일시
	 "exitMachineId" : '', // string 출차 설비
	 manualExit : true,
	 externalExit : false,
	 "settled" : '', // datetime 정산 일시
	 "settleMachineId" : '', // string 정산 설비
	 "payed" : '',
	 "payMachineId" : '', // string 결제 설비
	 "payMethod" : '',
	 "payedFee" : ''
}

export default {
      mixins : [modal_default],
    data() {
        return {
            api_data: {
                ...origin_format
            },
				option_zones : [],
				option_machines : [],

        };
    },
	 validations: {
		  api_data : {
				carNumber: {required},
				type : {required},
				status : {required},
				zoneId: {required},
				enterType: {required},
				enterMachineId: {required},
				entered: {required}
		  }
	 },
    created() {

    },
    mounted() {

    },
    methods: {
        reset() {
            this.api_data = {...origin_format};
				if(this.mode!=='edit'){
					 this.api_data.type = 'NORMAL';
					 this.api_data.status = 'ENTERED';
					 this.api_data.entered = moment().format('YYYY-MM-DD HH:mm:ss');
				}
        },
        setPageData() {
            for (let prop in this.api_data) {
                let flag = tool_app.covertDetailToEdit02(prop, this.api_data, this.pageData);
                if (flag) continue;
					 if(prop==='enterMachineId'){
						  this.api_data.enterMachineId = this.pageData.enterMachine ? this.pageData.enterMachine.id : '';
					 }else if(prop==='exitMachineId'){
						  this.api_data.exitMachineId = this.pageData.exitMachine ? this.pageData.exitMachine.id : '';
					 }else if(prop==='payMachineId'){
						  this.api_data.payMachineId = this.pageData.payMachine ? this.pageData.payMachine.id : '';
					 }else if(prop==='settleMachineId'){
						  this.api_data.settleMachineId = this.pageData.settleMachine ? this.pageData.settleMachine.id : '';
					 }else{
						  this.api_data[prop] = this.pageData[prop];
					 }
            }
				if(this.mode === 'edit'){
					 this.loadMachines();
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
					 create : ['carNumber','type','status','zoneId','enterType','enterMachineId','entered'],
					 edit : ['carNumber','status','type']
				})) {
					 this.api_flag = false;
					 return;
				}


            let payLoad = tool_app.getApiData(this.api_data);


            let jsStr_benefits = tool_app.makeJSONStringData(payLoad.benefits);
            if (jsStr_benefits === null) {
                tool_app.dialog_alert("정산 혜택이 JSON 형식이 아닙니다.");
                this.api_flag = false;
                return;
            }
            payLoad.benefits = jsStr_benefits;

            let jsStr_details = tool_app.makeJSONStringData(payLoad.details);
            if (jsStr_details === null) {
                tool_app.dialog_alert("부가 사항이 JSON 형식이 아닙니다.");
                this.api_flag = false;
                return;
            }
            payLoad.details = jsStr_details;

            if (this.mode === 'edit') {
					 payLoad = {
						  "carNumber": payLoad.carNumber,
						  "type": payLoad.type,
						  "status": payLoad.status,
						  "benefits": payLoad.benefits,
						  "memo": payLoad.memo,
						  "details": payLoad.details,
						  "exitType" : payLoad.exitType,
						  "exited" : payLoad.exited,
						  "exitMachineId" : payLoad.enterMachineId,
						  manualExit : payLoad.manualExit,
						  externalExit : payLoad.externalExit,
						  "settled" : payLoad.settled,
						  "settleMachineId" : payLoad.settleMachineId,
						  "payed" : payLoad.payed,
						  "payMachineId" : payLoad.payMachineId,
						  "payMethod" : payLoad.payMethod,
						  "payedFee" : payLoad.payedFee
					 }
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }else{
					 payLoad = {
						  "carNumber": payLoad.carNumber,
						  "type": payLoad.type,
						  "status": payLoad.status,
						  "category": payLoad.category,
						  "zoneId": payLoad.zoneId,
						  "enterType": payLoad.enterType,
						  "enterMachineId": payLoad.enterMachineId,
						  "manualEnter": payLoad.manualEnter,
						  "externalEnter": payLoad.externalEnter,
						  "benefits": payLoad.benefits,
						  "memo": payLoad.memo,
						  "details": payLoad.details,
						  entered : payLoad.entered
					 }
				}


            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                let url = this.mode === 'edit' ? '/api/v1/visits/' + this.pageData.id : '/api/v1/visits';
                let res = await mainapi.invokeAPI(url, payLoad, this.mode === 'edit' ? 'PATCH' : 'POST');

                let successCode = this.mode === 'edit' ? $const.ApiSuccessCode.PATCH : $const.ApiSuccessCode.POST;
                if (res.data.code !== successCode) {
                    throw res.data.msg;
                }

                this.hide();
                this.api_submitted = false;
                this.api_flag = false;
                if (this.callback) this.callback();
                tool_app.dialog_success(`방문차량 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`방문차량 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }
        },
		  changeSite(value,item){
				this.api_data.zoneId = '';
				this.api_data.enterMachineId = '';
				this.loadZones(value,item);
				this.loadMachines(value,item);
		  },
		  changeZone(value,item){
				if(value == ''){
					 this.option_machines = [];
					 this.api_data.enterMachineId = '';
					 return;
				}
				this.api_data.siteId = item.site.siteId;
				this.loadMachines();
		  },
		  async loadZones(value, item) {
				try {

					 this.option_zones = []
					 if(this.api_data.siteId===''){
						  return;
					 }

					 let payload = {
						  siteId: this.api_data.siteId,
						  page: 0,
						  size: 100,
						  sort: 'created,DESC'
					 }

					 let res = await mainapi.invokeAPI_GET('/api/v1/zones', payload)

					 if (res.data.code !== $const.ApiSuccessCode.GET) {
						  tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
					 }

					 let data = res.data.data;

					 this.option_zones = data.items;
				} catch (e) {
					 tool_app.dialog_alert(e);
				} finally {
					 this.api_flag = false;
					 this.api_load_passForm = false;
				}
		  },
		  async loadMachines(value, item) {
				try {
					 if(this.api_data.siteId===''){
						  return;
					 }

					 let payload = {
						  siteId: this.api_data.siteId,
						  page: 0,
						  size: 100,
						  sort: 'created,DESC'
					 }

					 let res = await mainapi.invokeAPI_GET('/api/v1/machines', payload)

					 if (res.data.code !== $const.ApiSuccessCode.GET) {
						  tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
					 }

					 let data = res.data.data;

					 data.items.forEach(function(item){
						  item.name = item.name + ' (' + window.$const.machineType[item.type] + ')';
					 })

					 this.option_machines = data.items;
				} catch (e) {
					 tool_app.dialog_alert(e);
				} finally {
					 this.api_flag = false;
					 this.api_load_passForm = false;
				}
		  }

	 }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'입출차 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <label class="mb-2 required">차량 번호</label>
                        <input type="text" class="form-control" v-model="api_data.carNumber"
										 :class="{ 'is-invalid': api_submitted && $v.api_data.carNumber.$error }"
								/>
							 <div v-if="api_submitted && $v.api_data.carNumber.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.carNumber.required">필수 입력값입니다.</span>
							 </div>


                        <label class="mt-3 mb-2 required">방문 유형</label>
                        <select class="form-select" v-model="api_data.type"
										  :class="{ 'is-invalid': api_submitted && $v.api_data.type.$error }"
								>
                              <option value="">방문 유형을 선택하세요.</option>
                              <option v-for="(value, key) in visitType" :value="key" :key="key">{{ value }}</option>
                        </select>
							 <div v-if="api_submitted && $v.api_data.type.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.type.required">필수 입력값입니다.</span>
							 </div>


							 <label class="mt-3 mb-2 required">상태</label>
                        <select class="form-select" v-model="api_data.status"
										  :class="{ 'is-invalid': api_submitted && $v.api_data.status.$error }"
								>
                              <option value="">상태를 선택하세요.</option>
                              <option v-for="(value, key) in visitStatus" :value="key" :key="key">{{ value }}</option>
                        </select>
							 <div v-if="api_submitted && $v.api_data.status.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.status.required">필수 입력값입니다.</span>
							 </div>

							 <div v-if="mode !== 'edit'">
								  <label class="mt-3 mb-2">카테고리</label>
								  <input type="text" class="form-control" v-model="api_data.category" />

								  <label class="mt-3 mb-2 required">주차장</label>
								  <custom-search-select v-model="api_data.zoneId" :type="'zones'" @input="changeZone" :is-site-name="true"
																:is-invalid="api_submitted && $v.api_data.zoneId.$error"
																value-field="id" label-field="name"></custom-search-select>
								  <div v-if="api_submitted && $v.api_data.zoneId.$error" class="invalid-feedback">
										<span v-if="!$v.api_data.zoneId.required">필수 입력값입니다.</span>
								  </div>


								  <label class="mt-3 mb-2 required">입차 설비</label>
								  <custom-multi-select v-model="api_data.enterMachineId" :options="option_machines"
															  :class="{ 'is-invalid': api_submitted && $v.api_data.enterMachineId.$error }"
															  label="name" value-field="id"
															  placeholder="입차 설비를 선택해주세요."/>
								  <div v-if="api_submitted && $v.api_data.enterMachineId.$error" class="invalid-feedback">
										<span v-if="!$v.api_data.enterMachineId.required">필수 입력값입니다.</span>
								  </div>


								  <label class="mt-3 mb-2 required">입차 일시</label>
								  <date-picker v-model="api_data.entered" type="datetime" lang="ko"
													value-type="format" format="YYYY-MM-DD HH:mm:ss" placeholder="입차 일시"/>



							 </div>

								<div v-if="mode==='edit'">
									 <label class="mt-3 mb-2 required">입차 유형</label>
									 <select class="form-select" v-model="api_data.enterType" :disabled="true">
										  <option value="">입차 유형을 선택하세요.</option>
										  <option v-for="(value, key) in visitEnterType" :value="key" :key="key">{{ value }}</option>
									 </select>

									 <b-form-checkbox v-model="api_data.manualEnter"  :disabled="true"
															:true-value="true" :false-value="false" class="mt-4"
									 >
										  수동 입차 여부
									 </b-form-checkbox>

									 <b-form-checkbox v-model="api_data.externalEnter"  :disabled="true"
															:true-value="true" :false-value="false" class="mt-4"
									 >
										  외부 서비스 입차 여부
									 </b-form-checkbox>


									 <label class="mt-3 mb-2">출차 유형</label>
									 <select class="form-select" v-model="api_data.exitType">
										  <option value="">출차 유형을 선택하세요.</option>
										  <option v-for="(value, key) in visitEnterType" :value="key" :key="key">{{ value }}</option>
									 </select>

									 <label class="mt-3 mb-2">출차 일시</label>
									 <date-picker
											 v-model="api_data.exited"
											 type="datetime"
											 lang="ko"
											 value-type="format" format="YYYY-MM-DD HH:mm:ss"
									 ></date-picker>

									 <label class="mt-3 mb-2">출차 설비</label>
									 <custom-multi-select v-model="api_data.exitMachineId" :options="option_machines"
																 label="name" value-field="id"
																 placeholder="출차 설비를 선택해주세요."/>


<!--									 <b-form-checkbox v-model="api_data.manualExit"-->
<!--															:true-value="true" :false-value="false" class="mt-4"-->
<!--									 >-->
<!--										  수동 출차 여부-->
<!--									 </b-form-checkbox>-->

<!--									 <b-form-checkbox v-model="api_data.externalExit"-->
<!--															:true-value="true" :false-value="false" class="mt-4"-->
<!--									 >-->
<!--										  외부 서비스 출차 여부-->
<!--									 </b-form-checkbox>-->


									 <label class="mt-3 mb-2">정산 일시</label>
									 <date-picker
											 v-model="api_data.settled"
											 type="datetime"
											 lang="ko"
											 value-type="format" format="YYYY-MM-DD HH:mm:ss"
									 ></date-picker>

									 <label class="mt-3 mb-2">정산 설비</label>
									 <custom-multi-select v-model="api_data.settleMachineId" :options="option_machines"
																 label="name" value-field="id"
																 placeholder="정산 설비를 선택해주세요."/>

									 <label class="mt-3 mb-2">정산 혜택</label>
									 <input type="text" class="form-control" v-model="api_data.benefits"/>


									 <label class="mt-3 mb-2">결제 일시</label>
									 <date-picker
											 v-model="api_data.payed"
											 type="datetime"
											 lang="ko"
											 value-type="format" format="YYYY-MM-DD HH:mm:ss"
									 ></date-picker>

									 <label class="mt-3 mb-2">결제 설비</label>
									 <custom-multi-select v-model="api_data.payMachineId" :options="option_machines"
																 label="name" value-field="id"
																 placeholder="결제 설비를 선택해주세요."/>

									 <label class="mt-3 mb-2">결제 방법</label>
									 <select class="form-select" v-model="api_data.payMethod">
										  <option value="">결제 방법을 선택하세요.</option>
										  <option v-for="(value, key) in payMethods" :value="key" :key="key">{{ value }}</option>
									 </select>

									 <label class="mt-3 mb-2">결제 금액</label>
									 <input type="text" class="form-control" v-model="api_data.payedFee"/>

									 <label class="mt-3 mb-2">상세</label>
									 <input type="text" class="form-control" v-model="api_data.details"/>
								</div>





							 <label class="mt-3 mb-2">메모</label>
							 <input type="text" class="form-control" v-model="api_data.memo"/>
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
