<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

// 필수값 받음
let origin_format = {
    "id": "",
    "name": "",
    "siteId": "",
    "outerZoneId": null,
    "clientId": "",
    "ceo": "",
    "bizNumber": "",
    "address": "",
    "phone": "",
    "vatRate": 10,
    "bankName": "",
    "bankHolder": "",
    "bankNumber": "",
    "operatorId": "",
    "country": "",
    "timeZone": "",
    "lat": 0,
    "lon": 0,
    "totalSpaceCnt": 0,
    "seizsedSpaceCnt": 0,
    "monthlyPassCnt": 0,
    "spaceWiseManaging": false,
    "operationTimes": "",
    "monthlyPassOnly": false,
    "cashExposed": false,
    "smallCarExposed": false,
    "largeCarExposed": false,
    "unpayExposed": false,
    "addPrevUnpayedAllowed": false,
    "camperAllowed": false,
    "workerOnReceipt": false,
    "pubDcCachingDays": 0,
    "memoWhenCmdOnGate": false,
    "memoWhenOfficial": false,
    "whenExitOnNoOperation": false,
    "ignorePrevNotExited": false,
    "handleNotExitedAs": "",
    "handleNotExitedAt": "",
    "handleNotExitedBefore": 1,
    "closeWhenFull": false,
    "passOnlyWhenFull": false,
    "fullForced": false,
    "freeForced": false,
    "kioskRebooting": "00:00:00",
    "payZeroWhenQuickOut": false,
	 area : 0
}

/*
let origin_format = {
    "id": "",
    "name": "",
    "siteId": "",
    "outerZoneId": null,
    "clientId": "",
    "ceo": "",
    "bizNumber": "",
    "address": "",
    "phone": "",
    "vatRate": 10,
    "bankName": "",
    "bankHolder": "",
    "bankNumber": "",
    "operatorId": "",
    "country": "KR",
    "timeZone": "+0900",
    "lat": 35.9643801,
    "lon": 126.961548,
    "totalSpaceCnt": 200,
    "seizsedSpaceCnt": 100,
    "monthlyPassCnt": 100,
    "spaceWiseManaging": false,
    "operationTimes": "평일: 06:00 ~ 23:00\n주말: 09:00 ~ 20:00\n일요일 및 공휴일: 09:00 ~ 18:00",
    "monthlyPassOnly": false,
    "cashExposed": true,
    "smallCarExposed": false,
    "largeCarExposed": true,
    "unpayAllowed": true,
    "addPrevUnpayedAllowed": false,
    "camperAllowed": false,
    "workerOnReceipt": false,
    "pubDcCachingDays": 0,
    "memoWhenCmdOnGate": true,
    "memoWhenOfficial": false,
    "whenExitOnNoOperation": "FREE",
    "ignorePrevNotExited": false,
    "handleNotExitedAs": "EXIT",
    "handleNotExitedAt": "01:00:00",
    "handleNotExitedBefore": 7,
    "closeWhenFull": true,
    "passOnlyWhenFull": true,
    "fullForced": true,
    "freeForced": true,
    "kioskRebooting": "01:00:00",
    "payZeroWhenQuickOut": true,
    unpayExposed: true
}
 */
export default {
      mixins : [modal_default],
    data() {
        return {
            api_data: {
                ...origin_format
            },
              api_load_client: false,
              label_client_name : '',
              label_operator_name : ''
        };
    },
	 validations: {
		  api_data : {
				name: {required},
				id : {required},
				clientId : {required},
				siteId: {required},
				ceo: {required},
				bizNumber: {required}
		  }
	 },
    created() {

    },
    mounted() {

    },
    methods: {
          show_after_reset(){

          },
        reset() {
            this.api_data = {...origin_format};
        },
        setPageData() {
            for (let prop in this.api_data) {
                let flag = tool_app.covertDetailToEdit02(prop, this.api_data, this.pageData);
                if (flag) continue;

                if(prop==='clientId'){
                      this.label_client_name = this.pageData.client.name;
                      this.api_data.clientId = this.pageData.client.id;
                }else{
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
					 create : ['name','id', 'clientId','siteId','ceo','bizNumber'],
					 edit : ['name','id', 'clientId','siteId','ceo','bizNumber']
				})) {
					 this.api_flag = false;
					 return;
				}


            let payLoad = tool_app.getApiData(this.api_data);
            payLoad.lat = parseFloat(payLoad.lat);
            payLoad.lon = parseFloat(payLoad.lon);
            payLoad.vatRate = parseInt(payLoad.vatRate);
            payLoad.totalSpaceCnt = parseInt(payLoad.totalSpaceCnt);
            payLoad.seizsedSpaceCnt = parseInt(payLoad.seizsedSpaceCnt);
            payLoad.monthlyPassCnt = parseInt(payLoad.monthlyPassCnt);
              payLoad.handleNotExitedBefore = parseInt(payLoad.handleNotExitedBefore);
				  payLoad.area = parseFloat(payLoad.area)


            if (this.mode === 'edit') {
                delete payLoad.id;
                delete payLoad.siteId;
					 delete payLoad.clientId;

                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }else{
                  payLoad = {
                        id : payLoad.id,
                        name : payLoad.name,
                        siteId : payLoad.siteId,
							 ceo : payLoad.ceo,
							 bizNumber : payLoad.bizNumber,
							 clientId :payLoad.clientId
                  }
            }

            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                let url = this.mode === 'edit' ? '/api/v1/zones/' + this.pageData.id : '/api/v1/zones';
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
                tool_app.dialog_success(`주차장 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`주차장 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        },
          async loadClient(value, item) {
                try {

                      if(value==='') {
                            this.label_client_name = '';
                            this.api_data.clientId = '';
                            this.api_data.ceo = '';
                              this.api_data.bizNumber = '';
                            return;
                      }

                      if(this.mode==='edit') return false;

                      if (this.api_load_client) {
                            tool_app.dialog_alert("데이터 전송중입니다.");
                            return;
                      }

                      this.api_flag = true;
                      this.api_load_client = true;


                      const res = await mainapi.invokeAPI_GET('/api/v1/clients/' + item.client.id, {}, 'GET')

                      if (res.data.code !== $const.ApiSuccessCode.GET) {
                            tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg);
                            return;
                      }

                      let data = res.data.data;

                      this.label_client_name = data.name;
                      this.api_data.clientId = data.id;
                        this.api_data.ceo = data.ceoName;
                        this.api_data.bizNumber = data.registrationNumber;
                } catch (e) {
                      tool_app.dialog_alert(e);
                } finally {
                      this.api_flag = false;
                      this.api_load_client = false;
                }
          }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'주차장 ' + (mode === 'edit' ? '수정' : '등록')"
                     title-class="font-18" :size="mode==='edit' ? 'lg' : 'md'">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <b-row>
                              <b-col cols="12" :md="mode==='edit' ? '6' : '12'">
                                    <label class="mt-3 mb-2 required">아이디</label>
                                    <input type="text" class="form-control" v-model="api_data.id" :class="{ 'is-invalid': api_submitted && $v.api_data.id.$error }"/>
											 <div v-if="api_submitted && $v.api_data.id.$error" class="invalid-feedback">
												  <span v-if="!$v.api_data.id.required">필수 입력값입니다.</span>
											 </div>

                                    <label class="mt-3 mb-2 required">이름</label>
                                    <input type="text" class="form-control" v-model="api_data.name" :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"/>
											 <div v-if="api_submitted && $v.api_data.name.$error" class="invalid-feedback">
												  <span v-if="!$v.api_data.name.required">필수 입력값입니다.</span>
											 </div>

                                    <label class="mt-3 mb-2 required">사업장</label>
                                    <custom-search-select v-model="api_data.siteId" :type="'sites'" :disabled="mode==='edit'"
                                                          @input="loadClient" :is-invalid="api_submitted && $v.api_data.siteId.$error"
                                                          :init-data="pageData && pageData.site ? pageData.site : null"
                                                          value-field="id" label-field="name"></custom-search-select>
											 <div v-if="api_submitted && $v.api_data.siteId.$error" class="invalid-feedback">
												  <span v-if="!$v.api_data.siteId.required">필수 입력값입니다.</span>
											 </div>

                                    <label class="mt-3 mb-2 required">고객사</label>
                                    <input type="text" class="form-control" v-model="label_client_name" :disabled="true" :class="{ 'is-invalid': api_submitted && $v.api_data.clientId.$error }"/>
											 <div v-if="api_submitted && $v.api_data.clientId.$error" class="invalid-feedback">
												  <span v-if="!$v.api_data.clientId.required">필수 입력값입니다.</span>
											 </div>

                                    <label class="mt-3 mb-2 required">대표자</label>
                                    <input type="text" class="form-control" v-model="api_data.ceo" :class="{ 'is-invalid': api_submitted && $v.api_data.ceo.$error }"/>
											 <div v-if="api_submitted && $v.api_data.ceo.$error" class="invalid-feedback">
												  <span v-if="!$v.api_data.ceo.required">필수 입력값입니다.</span>
											 </div>

                                    <label class="mt-3 mb-2 required">사업자 등록번호</label>
                                    <input type="text" class="form-control" v-model="api_data.bizNumber" :class="{ 'is-invalid': api_submitted && $v.api_data.bizNumber.$error }"/>
											 <div v-if="api_submitted && $v.api_data.bizNumber.$error" class="invalid-feedback">
												  <span v-if="!$v.api_data.bizNumber.required">필수 입력값입니다.</span>
											 </div>

                                    <div v-if="mode==='edit'">
                                          <label class="mt-3 mb-2">외부 주차장 ID(주차장내 주차장일 경우)</label>
                                          <input type="text" class="form-control"
                                                 v-model="api_data.outerZoneId"/>

                                          <label class="mt-3 mb-2">운영사 아이디 *</label>
                                          <custom-search-select v-model="api_data.operatorId" :type="'operators'"
                                                                :init-data="pageData && pageData.operator ? pageData.operator : null"
                                                                value-field="id" label-field="name"></custom-search-select>


                                          <label class="mt-3 mb-2">주소 *</label>
                                          <input type="text" class="form-control" v-model="api_data.address"/>

                                          <label class="mt-3 mb-2">전화번호</label>
                                          <input type="text" class="form-control" v-model="api_data.phone"/>

                                          <label class="mt-3 mb-2">부가가치세율</label>
                                          <input type="text" class="form-control" v-model="api_data.vatRate"/>

                                          <label class="mt-3 mb-2">은행이름 *</label>
                                          <input type="text" class="form-control" v-model="api_data.bankName"/>

                                          <label class="mt-3 mb-2">예금주 *</label>
                                          <input type="text" class="form-control" v-model="api_data.bankHolder"/>

                                          <label class="mt-3 mb-2">계좌번호(암호화) *</label>
                                          <input type="text" class="form-control" v-model="api_data.bankNumber"/>


                                          <label class="mt-3 mb-2">국가코드(ISO 3166-1) *</label>
                                          <input type="text" class="form-control" v-model="api_data.country"/>

                                          <label class="mt-3 mb-2">시간대(ISO 8601) *</label>
                                          <input type="text" class="form-control" v-model="api_data.timeZone"/>

                                          <label class="mt-3 mb-2">위도 *</label>
                                          <input type="text" class="form-control" v-model="api_data.lat"/>

                                          <label class="mt-3 mb-2">경도 *</label>
                                          <input type="text" class="form-control" v-model="api_data.lon"/>

													 <label class="mt-3 mb-2">면적 *</label>
													 <input type="text" class="form-control" v-model="api_data.area"/>

                                          <label class="mt-3 mb-2">전체 주차 면수 *</label>
                                          <input type="text" class="form-control" v-model="api_data.totalSpaceCnt"/>

                                          <label class="mt-3 mb-2">차량이 주차된 주차 면수</label>
                                          <input type="text" class="form-control" v-model="api_data.seizsedSpaceCnt"/>

                                          <label class="mt-3 mb-2">발급 가능한 월정기권 개수</label>
                                          <input type="text" class="form-control" v-model="api_data.monthlyPassCnt"/>

                                          <b-form-checkbox v-model="api_data.spaceWiseManaging"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                주차면 단위로 관리하는지 여부 *
                                          </b-form-checkbox>
                                    </div>

                              </b-col>
                              <b-col cols="12" md="6" v-if="mode==='edit'">
                                    <div v-if="mode==='edit'">
                                          <label class="mt-3 mb-2">운영시간 안내 *</label>
                                          <input type="text" class="form-control" v-model="api_data.operationTimes"/>
                                          <b-form-checkbox v-model="api_data.monthlyPassOnly"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                월정기권을 가진 차량만 주차 가능 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.cashExposed"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                현금 처리 버튼 노출 여부 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.smallCarExposed"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                경차 처리 버튼 노출 여부 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.largeCarExposed"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                대형 처리 버튼 노출 여부 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.unpayExposed"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                주차 요금을 미납으로 처리 가능(관제화면에 버튼) *
                                          </b-form-checkbox>
                                          <b-form-checkbox v-model="api_data.addPrevUnpayedAllowed"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                이전 미납요금을 현재 요금에 추가할지 여부 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.camperAllowed"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                캠핑차량 주차 허용 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.workerOnReceipt"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                영수증에 근무자 이름을 표시 *
                                          </b-form-checkbox>
                                          <label class="mt-3 mb-2">공공 할인 발급 여부를 저장해 두는 기간. *</label>
                                          <input type="text" class="form-control" v-model="api_data.pubDcCachingDays"/>
                                          <p class="text-muted">- 입차시 이 기간 내에 발급한 것인지 여부 / 정보가 있으면 같은 할인이 자동 발급된다.</p>


                                          <b-form-checkbox v-model="api_data.memoWhenCmdOnGate"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                수동으로 차단기 제어 명령을 내릴 때 반드시 사유를 적게 할 *
                                          </b-form-checkbox>


                                          <b-form-checkbox v-model="api_data.memoWhenOfficial"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                공무로 입차한 경우 공무 내용 기록 필요 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.whenExitOnNoOperation"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                운영 시간이 아닐 때 출차하는 차량에 대한 과금 처리 방식 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.ignorePrevNotExited"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                같은 번호의 이전 미출차 차량을 출차 처리하지 않고 그냥 두기 *
                                          </b-form-checkbox>


                                          <label class="mt-3 mb-2">handleNotExitedBefore 기간을 넘은 미출차 차량의 처리 방법 *</label>
                                          <input type="text" class="form-control" v-model="api_data.handleNotExitedAs"/>

                                          <label class="mt-3 mb-2">handleNotExitedBefore 기간을 넘은 미출차 차량을 자동으로 처리할 시각 *</label>
                                          <input type="text" class="form-control" v-model="api_data.handleNotExitedAt"/>

                                          <label class="mt-3 mb-2">며칠 동안 미출차 한 차량을 처리할 것인지 여부. 단위가 日임. *</label>
                                          <input type="text" class="form-control" v-model="api_data.handleNotExitedBefore"/>


                                          <b-form-checkbox v-model="api_data.closeWhenFull"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                만차시 입차 차단 *
                                          </b-form-checkbox>


                                          <b-form-checkbox v-model="api_data.passOnlyWhenFull"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                만차시 정기권 차량만 입출차 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.fullForced"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                실제 여부와 상관없이 만차로 설정 *
                                          </b-form-checkbox>

                                          <b-form-checkbox v-model="api_data.freeForced"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                모든 입출차에 100% 할인 쿠폰 일괄 적용 *
                                          </b-form-checkbox>

                                          <label class="mt-3 mb-2">무인 정산기 자동 리부팅 시각</label>
                                          <input type="text" class="form-control" v-model="api_data.kioskRebooting"/>


                                          <b-form-checkbox v-model="api_data.payZeroWhenQuickOut"
                                                           :true-value="true" :false-value="false" class="mt-4"
                                          >
                                                회차를 0원으로 결제처리한다. 출차 시간이 부여된다. *
                                          </b-form-checkbox>
                                    </div>
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
<style>

</style>
