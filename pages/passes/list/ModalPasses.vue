<script>
import {required} from "vuelidate/lib/validators";
import SetTimeTable from "../../../components/common/SetTimeTable";
import {mapState} from "vuex";
import Date_StartEnd from "@/components/common/Date_StartEnd.vue";
import modal_default from "@/mixin/modal_default";

// 필수값 받음
let origin_format = {
    "name": "",
    "type": "MONTHLY",
    "origin": "FREE",
	 'status' : 'READY',
    "code": "",
    "carNumber": "",
    "carModel": "",
    "holderName": "",
    "phone": "",
    "address": "",
    "position": "",
    "payedAmt": 0,
    "payed": null,
    "start": "",
    "end": "",
    "passFormId": '',
    "passGroupId": null,
    "timetable": null,
    "holiday": null,
    "enterMachineGroupIds": [],
    "enterMsg": "",
    "exitMsg": null,
    "mainZoneId": "",
    "zoneGroupIds": [],
    "memo": null,
    "details": ""
}

export default {
      mixins : [modal_default],
    components: {
          Date_StartEnd,
        SetTimeTable
    },
    data() {
        return {
            api_data: {
                ...origin_format
            },
            select_limit_timeTable: "none",
            api_load_passForm: false
        };
    },
      validations: {
            api_data : {
                  passFormId: {required},
					 status : {required},
                  name: {required},
                  origin: {required},
                  type: {required},
                  code: {required},
                  carNumber : {required},
                  carModel : {required},
                  holderName : {required},
                  position : {required},
                  mainZoneId : {required}
            }
      },
    computed: {
        disabledWrite() {
            return this.api_load_passForm === true || this.api_data.passFormId === '';
        }
    },
    mounted() {

    },
    methods: {
        reset() {
            this.api_data = {...origin_format};
            this.select_limit_timeTable = "none";
        },
        setPageData() {
            for (let prop in this.api_data) {
                if(prop==='passFormId') {
                      this.api_data[prop] = this.pageData[prop];
                      continue;
                }

                let flag = tool_app.covertDetailToEdit02(prop, this.api_data, this.pageData);
                if (flag) continue;
                if (prop === 'timetable') {
                    if (this.pageData.timetable !== null) {
                        this.api_data.timetable = this.pageData.timetable;
                        this.select_limit_timeTable = 'limit';
                        this.$refs.ref_setTimeTable.setTimeTable(this.pageData.timetable);
                    }
                } else {
                    this.api_data[prop] = this.pageData[prop];
                }
            }

            this.edit_status = this.pageData.status;
        },
        async api_request() {
            if (this.api_flag) {
                tool_app.dialog_alert("데이터 전송중입니다.");
                return;
            }

            this.api_flag = true;
            this.api_submitted = true;

				if (this.checkInValidation({
					 create : ['name','type', 'origin','passFormId','mainZoneId'],
					 edit : ['name','status']
				})) {
					 this.api_flag = false;
					 return;
				}


            let payLoad = tool_app.getApiData(this.api_data);
            payLoad.position = tool_app.makeArrayForCreateApi(payLoad.position);
            payLoad.payedAmt = parseInt(payLoad.payedAmt);
            payLoad.zoneGroupIds = tool_app.emptyArrayNull(payLoad.zoneGroupIds);
            payLoad.enterMachineGroupIds = tool_app.emptyArrayNull(payLoad.enterMachineGroupIds);
				payLoad.start = payLoad.start=='' ? null : payLoad.start;
				payLoad.end = payLoad.end=='' ? null : payLoad.end;


            let _details = tool_app.makeJSONStringData(payLoad.details);
            if (_details === null) {
                tool_app.dialog_alert("부가 사항이 JSON 형식이 아닙니다.");
                this.api_flag = false;
                return;
            }
            payLoad.details = _details;


            if (this.select_limit_timeTable === 'limit') {
					 let {result,msg} = this.$refs.ref_setTimeTable.checkValidation();
					 if(!result) {
						  tool_app.dialog_alert(msg);
						  this.api_flag = false;
						  return;
					 }
                payLoad.timetable = this.$refs.ref_setTimeTable.getJSONdata();
            } else {
                payLoad.timetable = null;
            }

            if (this.mode === 'edit') {
                // 수정할때 삭제해야 할 항 목

                payLoad = {
						  status : payLoad.status,
						  code : payLoad.code,
						  carNumber : payLoad.carNumber,
						  carModel : payLoad.carModel,
						  holderName : payLoad.holderName,
						  phone : payLoad.phone,
						  address : payLoad.address,
						  start : payLoad.start,
						  end : payLoad.end,
						  timetable : payLoad.timetable,
						  enterMsg : payLoad.enterMsg,
						  holiday : payLoad.holiday,
						  exitMsg : payLoad.exitMsg,
						  memo : payLoad.memo,
						  details : payLoad.details
					 }
                let fields = [];
					 for (let prop in payLoad) {
						  fields.push(prop);
					 }
                payLoad.fields = fields;
                payLoad.fields.push('status');
            }else{
					 let status = moment().isBetween(payLoad.start, payLoad.end) ? 'AVAILABLE' : moment().isBefore(payLoad.start) ? 'READY' : 'WARNING';
					 if(status !== 'WARNING'){
							payLoad.status = status;
					 }else{
						  tool_app.dialog_alert('정기권 기간 설정 오류입니다.');
						  this.api_flag = false;
						  return;
					 }
				}

            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {

                let url = this.mode === 'edit' ? '/api/v1/passes/' + this.pageData.id : '/api/v1/passes';
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
                tool_app.dialog_success(`정기권 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`정기권 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        },
        async loadPassForm(value,item) {
            try {
                if(this.mode==='edit') return false;
					 if(value===''){
							this.reset();
							return;
					 }
                if (this.api_load_passForm) {
                    tool_app.dialog_alert("데이터 전송중입니다.");
                    return;
                }
                this.api_flag = true;
                this.api_load_passForm = true;


                const res = await mainapi.invokeAPI_GET('/api/v1/pass-forms/' + this.api_data.passFormId, {}, 'GET')

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }

                let data = res.data.data;

                let setPropList = ['name','enterMsg', 'exitMsg', 'price','code']
                for(let prop in this.api_data) {
                    if(prop==='passFormId') continue;
                    let flag = tool_app.covertDetailToEdit02(prop, this.api_data, data);
                    if (flag) continue;
                    if (prop === 'timetable') {
                        if (data.timetable !== null) {
                            this.api_data.timetable = data.timetable;
                            this.select_limit_timeTable = 'limit';
                            this.$refs.ref_setTimeTable.setTimeTable(data.timetable);
                        } else {
                            this.api_data.timetable = null;
                            this.select_limit_timeTable = 'none';
                        }
                    }else if(setPropList.includes(prop)) {
                        this.api_data[prop] = data[prop];
                    }else if(prop==='mainZoneId'){
								  this.$refs.ref_mainZoneId.setChangeData(data.mainZone);
						  }else if(prop==='zoneGroupIds'){
								  this.$refs.ref_zoneGroupIds.setChangeData(data.zoneGroup);
						  }else if(prop==='enterMachineGroupIds'){
								  this.$refs.ref_enterMachineGroupIds.setChangeData(data.enterMachineGroup);
						  }
                }

            } catch (e) {
                tool_app.dialog_alert(e);
            } finally {
                this.api_flag = false;
                this.api_load_passForm = false;
            }
        },
		  async loadPassGroup(value,item) {
				try {
					 if(this.mode==='edit') return false;
					 if(value===''){
						  this.reset();
						  return;
					 }
					 if (this.api_load_passForm) {
						  tool_app.dialog_alert("데이터 전송중입니다.");
						  return;
					 }
					 this.api_flag = true;
					 this.api_load_passForm = true;


					 const res = await mainapi.invokeAPI_GET('/api/v1/pass-groups/' + this.api_data.passGroupId, {}, 'GET')

					 if (res.data.code !== $const.ApiSuccessCode.GET) {
						  tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
					 }

					 let data = res.data.data;

					 let setPropList = ['enterMsg', 'exitMsg']
					 for(let prop in this.api_data) {
						  if(setPropList.includes(prop)) {
								this.api_data[prop] = data[prop];
						  }
					 }

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
            <b-modal ref="modal" id="modal-standard" :title="'정기권 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18" size="lg">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <b-row>
                              <b-col cols="12" md="6">
                                    <label class="mb-2 required">정기권 유형</label>
											   <custom-search-select v-model="api_data.passFormId" :type="'passform'"  @input="loadPassForm" :disabled="mode==='edit'"
																			 :init-data="this.pageData && this.pageData.passForm ? this.pageData.passForm : null"
																			 :class="{ 'is-invalid': api_submitted && $v.api_data.passFormId.$error }"
																		  value-field="id" label-field="name"></custom-search-select>
											 <div
													 v-if="api_submitted && $v.api_data.passFormId.$error"
													 class="invalid-feedback"
											 >
																<span v-if="!$v.api_data.passFormId.required"
																>필수 입력값입니다.</span>
											 </div>



                                    <div class="mt-3" v-if="mode==='edit'">
                                          <label class="mb-2 required">상태</label>
                                          <select class="form-select" v-model="api_data.status" :class="{ 'is-invalid': api_submitted && $v.edit_status.$error }">
                                                <option v-for="(value, key) in passStatus" :value="key" :key="key">{{ value }}
                                                </option>
                                          </select>
                                          <div
                                                v-if="api_submitted && $v.edit_status.$error"
                                                class="invalid-feedback"
                                          >
																<span v-if="!$v.edit_status.required"
                                                >필수 입력값입니다.</span>
                                          </div>
                                    </div>

                                    <label class="mt-3 mb-2 required">정기권 이름</label>
                                    <input type="text" class="form-control" v-model="api_data.name" :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"
                                           :disabled="disabledWrite"/>
                                    <div
                                          v-if="api_submitted && $v.api_data.name.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.name.required"
                                                >필수 입력값입니다.</span>
                                    </div>

                                    <label class="mt-3 mb-2 required">종류</label>
                                    <select class="form-select" v-model="api_data.type" :disabled="true" :class="{ 'is-invalid': api_submitted && $v.api_data.type.$error }">
                                          <option v-for="(value, key) in passType" :value="key" :key="key">{{ value }}</option>
                                    </select>
                                    <div
                                          v-if="api_submitted && $v.api_data.type.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.type.required"
                                                >필수 입력값입니다.</span>
                                    </div>

                                    <label class="mt-3 mb-2 required">발행경로</label>
                                    <select class="form-select" v-model="api_data.origin" :disabled="true" :class="{ 'is-invalid': api_submitted && $v.api_data.origin.$error }">
                                          <option v-for="(value, key) in passOrigin" :value="key" :key="key">{{ value }}</option>
                                    </select>
                                    <div
                                          v-if="api_submitted && $v.api_data.origin.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.origin.required"
                                                >필수 입력값입니다.</span>
                                    </div>

                                    <label class="mt-3 mb-2">관리코드</label>
                                    <input type="text" class="form-control" v-model="api_data.code" :class="{ 'is-invalid': api_submitted && $v.api_data.code.$error }"
                                           :disabled="disabledWrite"/>
                                    <div
                                          v-if="api_submitted && $v.api_data.code.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.code.required"
                                                >필수 입력값입니다.</span>
                                    </div>

                                    <label class="mt-3 mb-2">차량번호</label>
                                    <input type="text" class="form-control" v-model="api_data.carNumber" :class="{ 'is-invalid': api_submitted && $v.api_data.carNumber.$error }"
                                           :disabled="disabledWrite"/>
                                    <div
                                          v-if="api_submitted && $v.api_data.carNumber.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.carNumber.required"
                                                >필수 입력값입니다.</span>
                                    </div>

                                    <label class="mt-3 mb-2">차량 모델</label>
                                    <input type="text" class="form-control" v-model="api_data.carModel" :class="{ 'is-invalid': api_submitted && $v.api_data.carModel.$error }"
                                           :disabled="disabledWrite"/>
                                    <div
                                          v-if="api_submitted && $v.api_data.carModel.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.carModel.required"
                                                >필수 입력값입니다.</span>
                                    </div>

                                    <label class="mt-3 mb-2">정기권자 이름</label>
                                    <input type="text" class="form-control" v-model="api_data.holderName" :class="{ 'is-invalid': api_submitted && $v.api_data.holderName.$error }"
                                           :disabled="disabledWrite"/>
                                    <div
                                          v-if="api_submitted && $v.api_data.holderName.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.holderName.required"
                                                >필수 입력값입니다.</span>
                                    </div>

                                    <label class="mt-3 mb-2">정기권자 전화번호</label>
                                    <input type="text" class="form-control" v-model="api_data.phone"
                                           :disabled="disabledWrite"
                                           v-mask="'#############'"/>

                                    <label class="mt-3 mb-2">정기권자 주소</label>
                                    <input type="text" class="form-control" v-model="api_data.address"
                                           :disabled="disabledWrite"/>

                                    <label class="mt-3 mb-2">소속 부서</label>
                                    <input type="text" class="form-control" v-model="api_data.position" :class="{ 'is-invalid': api_submitted && $v.api_data.position.$error }"
                                           :disabled="mode==='edit' || disabledWrite"/>
                                    <div
                                          v-if="api_submitted && $v.api_data.position.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.position.required"
                                                >필수 입력값입니다.</span>
                                    </div>
                                    <p class="text-muted">* 콤마로 구분하여 적어주세요.</p>


<!--                                    <label class="mt-3 mb-2">구매 금액</label>-->
<!--                                    <input type="text" class="form-control" v-model="api_data.payedAmt"-->
<!--                                           :disabled="mode==='edit' || disabledWrite" v-mask="'########'"/>-->


                              </b-col>
                              <b-col cols="12" md="6">
<!--                                    <label class="mb-2">구매 일시(필수)</label>-->
<!--                                    <date-picker-->
<!--                                            v-model="api_data.payed"-->
<!--                                            type="datetime"-->
<!--                                            lang="ko"-->
<!--                                            value-type="format" format="YYYY-MM-DD HH:mm:ss"-->
<!--                                            :class="{ 'is-invalid': api_submitted && $v.api_data.payed.$error }"-->
<!--                                            :disabled="mode==='edit'||disabledWrite"-->
<!--                                    ></date-picker>-->
<!--                                    <div-->
<!--                                          v-if="api_submitted && $v.api_data.payed.$error"-->
<!--                                          class="invalid-feedback"-->
<!--                                    >-->
<!--																<span v-if="!$v.api_data.payed.required"-->
<!--                                                >필수 입력값입니다.</span>-->
<!--                                    </div>-->


                                    <label class="mb-2">시작일시</label>
                                    <Date_StartEnd v-model="api_data.start" init-type="start"
                                                   :disabled="disabledWrite"/>


                                    <label class="mt-3 mb-2">종료일시</label>
                                    <Date_StartEnd v-model="api_data.end" init-type="end"
                                                   :disabled="disabledWrite"/>



                                    <label class="mt-3 mb-2">정기권 속성 그룹</label>
											 	<custom-search-select v-model="api_data.passGroupId" :type="'passGroups'"  @input="loadPassGroup" :disabled="disabledWrite || mode==='edit'"
																		  :init-data="this.pageData && this.pageData.passGroup ? this.pageData.passGroup : null"
																		  value-field="id" label-field="name"></custom-search-select>


                                    <label class="mt-3 mb-2">주간 입차 허용 시간표</label>
                                    <select class="form-select" v-model="select_limit_timeTable"
                                            :disabled="disabledWrite">
                                          <option value="none">제한 없음</option>
                                          <option value="limit">제한 설정</option>
                                    </select>
                                    <SetTimeTable class="mt-2" ref="ref_setTimeTable"
                                                  v-show="select_limit_timeTable==='limit'" :disabled="disabledWrite"/>


                                    <!--                              <label class="mt-3 mb-2">공휴일 입차 허용 시간표</label>-->
                                    <!--                              <input type="text" class="form-control" v-model="api_data.holiday"/>-->

                                    <label class="mt-3 mb-2">입차 설비 그룹</label>
											 <custom-search-select v-model="api_data.enterMachineGroupIds" :type="'zones'" :multiple="true"
																		  ref="ref_enterMachineGroupIds"
																		  :disabled="mode==='edit' || disabledWrite"
																		  :init-data="this.pageData && this.pageData.enterMachineGroup ? this.pageData.enterMachineGroup : null"
																		  value-field="id" label-field="name"></custom-search-select>



                                    <label class="mt-3 mb-2">입차 메시지</label>
                                    <input type="text" class="form-control" v-model="api_data.enterMsg"
                                           :disabled="disabledWrite || api_data.passGroupId"/>

                                    <label class="mt-3 mb-2">출차 메시지</label>
                                    <input type="text" class="form-control" v-model="api_data.exitMsg"
                                           :disabled="disabledWrite || api_data.passGroupId"/>

<!--                                  <label class="mt-3 mb-2">통행권을 제공하는 고객사(필수)</label>-->
<!--											 <custom-search-select v-model="api_data.clientId" :type="'clients'" :disabled="true"-->
<!--																		  ref="ref_clientId"-->
<!--																		  :init-data="this.pageData && this.pageData.client ? this.pageData.client : null"-->
<!--																		  :class="{ 'is-invalid': api_submitted && $v.api_data.clientId.$error }"-->
<!--																		  value-field="id" label-field="name"></custom-search-select>-->

<!--                                    <div-->
<!--                                          v-if="api_submitted && $v.api_data.clientId.$error"-->
<!--                                          class="invalid-feedback"-->
<!--                                    >-->
<!--																<span v-if="!$v.api_data.clientId.required"-->
<!--                                                >필수 입력값입니다.</span>-->
<!--                                    </div>-->


                                    <label class="mt-3 mb-2 required">기본 주차장</label>
											 <custom-search-select v-model="api_data.mainZoneId" :type="'zones'" :disabled="true"
																		  ref="ref_mainZoneId"
																		  :init-data="this.pageData && this.pageData.mainZone ? this.pageData.mainZone : null"
																		  :class="{ 'is-invalid': api_submitted && $v.api_data.mainZoneId.$error }"
																		  value-field="id" label-field="name"></custom-search-select>

                                    <div
                                          v-if="api_submitted && $v.api_data.mainZoneId.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.mainZoneId.required"
                                                >필수 입력값입니다.</span>
                                    </div>
                                    <p class="text-muted mb-0">※ 영업 일보상 매출이 잡힌다.</p>


                                   <label class="mt-3 mb-2">적용 가능한 주차장 그룹</label>
											 <custom-search-select v-model="api_data.zoneGroupIds" :type="'zones'" :disabled="true"
																		  ref="ref_zoneGroupIds" :multiple="true"
																		  :init-data="this.pageData && this.pageData.zoneGroup ? this.pageData.zoneGroup : null"

																		  value-field="id" label-field="name"></custom-search-select>

                                    <label class="mt-3 mb-2">특기 사항</label>
                                    <input type="text" class="form-control" v-model="api_data.memo"
                                           :disabled="disabledWrite"/>

                                    <label class="mt-3 mb-2">부가사항</label>
                                    <input type="text" class="form-control" v-model="api_data.details"
                                           :disabled="disabledWrite"/>
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
