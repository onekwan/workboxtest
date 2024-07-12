<script>
import {required} from "vuelidate/lib/validators";
import SetTimeTable from "../../components/common/SetTimeTable";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";


// 필수값 받음
let origin_format = {
    "name": "",
    "type": "MONTHLY",
    "code": "",
    "passGroupId": null,
    "timetable": null,
    "holiday": null,
    "price": 0,
    "enterMachineGroupIds": [],
    "enterMsg": "",
    "exitMsg": null,
    "autoRefill": "NONE",
    "refillPoints": 1,
    "mainZoneId": "",
    "zoneGroupIds": [],
    "externalType": null,
    "externalId": null,
    "maxCntInDay": null,
    "maxCntInMonth": null,
    "maxPointsInDay": null,
    "maxPointsInMonth": null,
    "maxPointsPerVisit": null,
    "details": ""
}


function isGreaterThanZero(value){
      let passed = tool_app.vuelidate.isGreaterThanZero(value);
      return passed;
}


export default {
      mixins : [modal_default],
    components: {
        SetTimeTable
    },
    data() {
        return {
            api_submitted: false,
            api_flag: false,
            api_data: {
                ...origin_format
            },
            select_limit_timeTable: "none",
				option_zones : [],
				option_zone_groups : []

        };
    },
      validations: {
            api_data : {
                  name: {required},
                  type: {required},
                  mainZoneId : {required},
                  refillPoints : {isGreaterThanZero}
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
                let flag = tool_app.covertDetailToEdit02(prop, this.api_data, this.pageData);
                if (flag) continue;
                if (prop === 'timetable') {
                    if (this.pageData.timetable !== null) {
                        this.api_data.timetable = this.pageData.timetable;
                        this.select_limit_timeTable = 'limit';
                        this.$refs.ref_setTimeTable.setTimeTable(this.pageData.timetable);
                    }
                }else if(prop ==='refillPoints'){
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
					 create : ['name','type', 'mainZoneId'],
					 edit : ['name','type','mainZoneId']
				})) {
					 this.api_flag = false;
					 return;
				}

            let payLoad = tool_app.getApiData(this.api_data);
            payLoad.price = parseInt(payLoad.price);
            payLoad.refillPoints = parseInt(payLoad.refillPoints);
            payLoad.zoneGroupIds = tool_app.emptyArrayNull(payLoad.zoneGroupIds);
            payLoad.enterMachineGroupIds = tool_app.emptyArrayNull(payLoad.enterMachineGroupIds);

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


            if (payLoad.type === 'TIMELY') {
                payLoad.maxCntInDay = parseInt(payLoad.maxCntInDay);
                payLoad.maxCntInMonth = parseInt(payLoad.maxCntInMonth);
                payLoad.maxPointsInDay = parseInt(payLoad.maxPointsInDay);
                payLoad.maxPointsInMonth = parseInt(payLoad.maxPointsInMonth);
                payLoad.maxPointsPerVisit = parseInt(payLoad.maxPointsPerVisit);
            } else {
                payLoad.maxCntInDay = null;
                payLoad.maxCntInMonth = null;
                payLoad.maxPointsInDay = null;
                payLoad.maxPointsInMonth = null;
                payLoad.maxPointsPerVisit = null;
            }

            if(payLoad.autoRefill==='NONE') payLoad.refillPoints = 1;


            if (this.mode === 'edit') {
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }

            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                let url = this.mode === 'edit' ? '/api/v1/pass-forms/' + this.pageData.id : '/api/v1/pass-forms';
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

                tool_app.dialog_success(`정기권 유형 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`정기권 유형 ${msg}에 실패하였습니다.` + "<br/>" + tool_app.ErrorMsg(e));
            } finally {
                this.api_flag = false;
            }

        },
        async change_pass_group_id(value,item,init){
				tool_app.log(init)
				if(init) return;
				try {
					 if(this.mode==='edit') return false;
					 if(value===''){
						  this.reset();
						  return;
					 }

					 this.api_flag = true;



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

					 if(this.api_data.type !== 'MONTHLY' && this.api_data.type !== 'ALWAYS'){
						  this.api_data.autoRefill = data.autoRefill;
							this.api_data.refillPoints = data.refillPoints;
					 }

				} catch (e) {
					 tool_app.dialog_alert(e);
				} finally {
					 this.api_flag = false;

				}
        },
          onChangeAutoRefill(){
                if(this.api_data.autoRefill==='NONE'){
                      this.api_data.refillPoints = 1;
                }
          },
		  onChangeType(){
				if(this.api_data.type === 'MONTHLY'|| this.api_data.type === 'ALWAYS'){
					 this.api_data.autoRefill='NONE';
					 this.api_data.refillPoints = 1;
				}

		  }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'정기권 유형 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18" size="lg">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <b-row>
                              <b-col cols="12" md="6">
                                    <label class="mb-2 required">정기권 유형 이름</label>
                                    <input type="text" class="form-control" v-model="api_data.name" :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"/>
                                    <div
                                          v-if="api_submitted && $v.api_data.name.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.name.required"
                                                >필수 입력값입니다.</span>
                                    </div>

                                    <label class="mt-4 mb-2 required">종류</label>
                                    <select class="form-select" v-model="api_data.type" :disabled="mode==='edit'"
														  @change="onChangeType"
														  :class="{ 'is-invalid': api_submitted && $v.api_data.type.$error }">
                                          <option v-for="(value, key) in passType" :value="key"  :key="key">{{ value }}</option>
                                    </select>
                                    <div
                                          v-if="api_submitted && $v.api_data.type.$error"
                                          class="invalid-feedback"
                                    >
																<span v-if="!$v.api_data.type.required"
                                                >필수 입력값입니다.</span>
                                    </div>


                                    <label class="mt-4 mb-2">관리코드</label>
                                    <input type="text" class="form-control" v-model="api_data.code"/>



                                    <label class="mt-4 mb-2">주간 입차 허용 시간표</label>
                                    <select class="form-select" v-model="select_limit_timeTable"
                                            :disabled="mode==='edit'">
                                          <option value="none">제한 없음</option>
                                          <option value="limit">제한 설정</option>
                                    </select>
                                    <SetTimeTable class="mt-2" ref="ref_setTimeTable"
                                                  v-show="select_limit_timeTable==='limit'" :disabled="mode==='edit'"/>

                                    <!--					 <label class="mt-4 mb-2">공휴일 입차 허용 시간표. null이나 제한이 없는 것으로 본다. 비었으면 항상 허용하지 않는 것이다. *</label>-->
                                    <!--					 <input type="text" class="form-control" v-model="api_data.holiday"/>-->

                                    <label class="mt-4 mb-2">권장 판매 가격</label>
                                    <input type="text" class="form-control" v-model="api_data.price" v-mask="'########'"
                                           :disabled="mode==='edit'"/>


                                    <label class="mt-4 mb-2">입차 설비 그룹</label>
											 <custom-search-select v-model="api_data.enterMachineGroupIds" :type="'machineGroups'" :multiple="true"
																		  :init-data="this.pageData && this.pageData.enterMachineGroup ? this.pageData.enterMachineGroup : null"
																		  value-field="id" label-field="name"></custom-search-select>



                                    <label class="mt-4 mb-2">정기권 속성 그룹</label>
											 <custom-search-select v-model="api_data.passGroupId" :type="'passGroups'"  @input="change_pass_group_id"
																		  :init-data="this.pageData && this.pageData.passGroup ? this.pageData.passGroup : null"
																		  value-field="id" label-field="name"></custom-search-select>



                                    <label class="mt-4 mb-2">입차 메시지</label>
                                    <input type="text" class="form-control" v-model="api_data.enterMsg"
                                           :disabled="api_data.passGroupId || mode==='edit'"/>

                                    <label class="mt-4 mb-2">출차 메시지</label>
                                    <input type="text" class="form-control" v-model="api_data.exitMsg"
                                           :disabled="api_data.passGroupId || mode==='edit'"/>
                              </b-col>
                              <b-col cols="12" md="6">
											 <div>
												  <label class="mb-2">
														1회 분의 충전량
														<span  class="text-muted mb-0" v-if="api_data.type === 'MONTHLY' || api_data.type === 'DAILY'">(단위 : 분)</span>
														<span  class="text-muted mb-0" v-if="api_data.type === 'TIMELY'">(단위 : 개수)</span>
												  </label>
												  <input type="text" class="form-control" v-model="api_data.refillPoints" :class="{ 'is-invalid': api_submitted && $v.api_data.refillPoints.$error }"
															v-mask="'########'" :disabled="api_data.passGroupId"/>

												  <div
														  v-if="api_submitted && $v.api_data.refillPoints.$error"
														  class="invalid-feedback"
												  >
																<span v-if="!$v.api_data.refillPoints.isGreaterThanZero"
																>0보다 큰 숫자이어야 합니다.</span>
												  </div>
											 </div>

                                    <label class="mt-4 mb-2">자동 충전 방식</label>
                                    <select class="form-select" v-model="api_data.autoRefill" :disabled="api_data.passGroupId || api_data.type === 'MONTHLY'|| api_data.type === 'ALWAYS'"
                                            @change="onChangeAutoRefill"
                                    >
                                          <option v-for="(value, key) in passAutoRefill" :value="key" :key="key">{{ value }}
                                          </option>
                                    </select>






<!--                                    <label class="mt-4 mb-2">정기권을 제공하는 고객사(필수)</label>-->
<!--											  <custom-search-select v-model="api_data.clientId" :type="'clients'"-->
<!--																			@input="changeClient"-->
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


                                    <label class="mt-4 mb-2 required">기본 주차장</label>
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



                                    <label class="mt-4 mb-2">적용 가능한 주차장 그룹 UID</label>
											   <custom-search-select v-model="api_data.zoneGroupIds" :type="'zoneGroups'" :multiple="true"
																		  :init-data="this.pageData && this.pageData.zoneGroup ? this.pageData.zoneGroup : null"
																		  value-field="id" label-field="name"></custom-search-select>

<!--                                    <label class="mt-4 mb-2">외부 정기권</label>-->
<!--                                    <input type="text" class="form-control" v-model="api_data.externalType"-->
<!--                                           :disabled="mode==='edit'"/>-->
<!--                                    <p class="text-muted mb-0">외부에서 발행한 정기권인 경우</p>-->

<!--                                    <label class="mt-4 mb-2">외부 정기권 아이디</label>-->
<!--                                    <input type="text" class="form-control" v-model="api_data.externalId"-->
<!--                                           :disabled="mode==='edit'"/>-->
<!--                                    <p class="text-muted mb-0">전송된 아이디. 외부에서 정의한다.</p>-->

                                    <label v-if="api_data.type==='TIMELY'" class="mt-4 mb-2">입주사가 하루에 발급할 수 있는 최대
                                          개수</label>
                                    <input v-if="api_data.type==='TIMELY'" v-model="api_data.maxCntInDay" type="text"
                                           class="form-control" v-mask="'########'" :disabled="mode==='edit'"/>

                                    <label v-if="api_data.type==='TIMELY'" class="mt-4 mb-2">입주사가 한 달에 발급할 수 있는 최대
                                          개수</label>
                                    <input v-if="api_data.type==='TIMELY'" v-model="api_data.maxCntInMonth" type="text"
                                           class="form-control" v-mask="'########'" :disabled="mode==='edit'"/>

                                    <label v-if="api_data.type==='TIMELY'" class="mt-4 mb-2">입주사가 하루에 발급할 수 있는 최대
                                          포인트(분)</label>
                                    <input v-if="api_data.type==='TIMELY'" v-model="api_data.maxPointsInDay" type="text"
                                           class="form-control" v-mask="'########'" :disabled="mode==='edit'"/>

                                    <label v-if="api_data.type==='TIMELY'" class="mt-4 mb-2">입주사가 한 달에 발급할 수 있는 최대
                                          포인트(분)</label>
                                    <input v-if="api_data.type==='TIMELY'" v-model="api_data.maxPointsInMonth"
                                           type="text" class="form-control" v-mask="'########'"
                                           :disabled="mode==='edit'"/>

                                    <label v-if="api_data.type==='TIMELY'" class="mt-4 mb-2">입주사가 한 방문에 발급할 수 있는 최대
                                          포인트(분)</label>
                                    <input v-if="api_data.type==='TIMELY'" v-model="api_data.maxPointsPerVisit"
                                           type="text" class="form-control" v-mask="'########'"
                                           :disabled="mode==='edit'"/>

<!--                                    <label class="mt-4 mb-2">부가 사항</label>-->
<!--                                    <input type="text" class="form-control" v-model="api_data.details"-->
<!--                                           :disabled="mode==='edit'"/>-->
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
