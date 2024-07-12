<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

// 필수값 받음
let origin_format = {
	   clientId: '',
	   afterExit: 0,
	   monthsForCntPerCar: 0,
	   maxCntPerCarInMonths: 0,
	   daysForCntPerCar: 0,
	   maxCntPerCarInDays: 0,
	   maxCntPerCarOnWeek: [],
	   maxCntPerVisit: 0,
	   maxCntPerVisitWeekly: [],
	   maxTimePerVisit: 0,
	   maxTimePerVisitWeekly: [],
	   maxAmtPerVisit: 0,
	   maxAmtPerVisitWeekly: [],
	   maxRatePerVisit: 0,
	   maxRatePerWeekly: [],
	   maxCmplCntPerVisit: 0,
	   maxCmplCntPerWeekly: [],
	   maxCmplTimePerVisit: 0,
	   maxCmplTimePerWeekly: [],
	   maxPvtCntForPub: 0,
	   maxPvtCntForPubWeekly: [],
	   timetable: [],
	   holiday: []
}
function isGreaterThanZero(value){
  let passed = tool_app.vuelidate.isGreaterThanZero(value);
  return passed;
}




// 404 이슈
export default {
  mixins : [modal_default],
  data() {
    return {
      api_data: {
        ...origin_format
      }
    };
  },
  validations: {
    api_data : {
		  clientId: {required}
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
			 if(this.pageData[prop]) {
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
				create : ['clientId'],
				edit : ['clientId']
		  })) {
				this.api_flag = false;
				return;
		  }

      let payLoad = tool_app.getApiData(this.api_data);


      // let _keys = tool_app.makeJSONStringData(payLoad.keys);
      // if (_keys === null) {
      //   tool_app.dialog_alert("옵션이 JSON 형식이 아닙니다.");
      //   this.api_flag = false;
      //   return;
      // }
      // payLoad.keys = _keys;

      if (this.mode === 'edit') {
        let fields = [];
        for (let prop in payLoad) {
          fields.push(prop);
        }
        payLoad.fields = fields;
      }


      let msg = this.mode === 'edit' ? '수정' : '등록';
      try {
        let url = this.mode === 'edit' ? '/api/v1/discount-limits/' + this.pageData.id : '/api/v1/discount-limits';
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
        tool_app.dialog_success(`할인 제한 ${msg}이 완료되었습니다.`);
      } catch (e) {
        tool_app.log(e)
        tool_app.dialog_alert(`할인 제한 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
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

            <label class="mb-2 required">고객사</label>
				  <custom-search-select v-model="api_data.clientId" :type="'clients'"
												:init-data="this.pageData && this.pageData.client ? this.pageData.client : null"
												:class="{ 'is-invalid': api_submitted && $v.api_data.clientId.$error }"
												value-field="id" label-field="name"></custom-search-select>
            <div
                  v-if="api_submitted && $v.api_data.clientId.$error"
                  class="invalid-feedback"
            >
																<span v-if="!$v.api_data.clientId.required"
                                                >필수 입력값입니다.</span>
            </div>

				  				<label class="mt-3 mb-2">출차 후 재발급 가능 시간</label>
				  				<input type="text" class="form-control" v-model="api_data.afterExit" v-mask="'########'"/>

				  				<label class="mt-3 mb-2">차량별 발급 제한할 때 기준 월 수</label>
				  				<input type="text" class="form-control" v-model="api_data.monthsForCntPerCar" v-mask="'########'"/>

				<label class="mt-3 mb-2">monthsForCntPerCar개월 동안 발급할 수 있는 최대 할인 수</label>
				<input type="text" class="form-control" v-model="api_data.maxCntPerCarInMonths" v-mask="'########'"/>

				<label class="mt-3 mb-2">차량별 발급 제한할 때 기준 일 수</label>
				<input type="text" class="form-control" v-model="api_data.daysForCntPerCar" v-mask="'########'"/>

				<label class="mt-3 mb-2">daysForCntPerCar일 동안 발급할 수 있는 최대 할인 수</label>
				<input type="text" class="form-control" v-model="api_data.maxCntPerCarInDays" v-mask="'########'"/>

				<label class="mt-3 mb-2">차량별로 요일마다 발급할 수 있는 최대 수</label>
				<input type="text" class="form-control" v-model="api_data.maxCntPerCarOnWeek"/>

				<label class="mt-3 mb-2">방문별로 기간마다 최대 발급 수</label>
				<input type="text" class="form-control" v-model="api_data.maxCntPerVisit" v-mask="'########'"/>

				<label class="mt-3 mb-2">방문별로 기간마다 최대 발급 수</label>
				<input type="text" class="form-control" v-model="api_data.maxCntPerVisitWeekly" />

				  <label class="mt-3 mb-2">방문별로 기간마다 최대 할인 시간</label>
				  <input type="text" class="form-control" v-model="api_data.maxTimePerVisit" v-mask="'########'"/>

				  <label class="mt-3 mb-2">방문별로 기간마다 최대 할인 시간</label>
				  <input type="text" class="form-control" v-model="api_data.maxTimePerVisitWeekly"/>

				  <label class="mt-3 mb-2">방문별로 기간마다 최대 할인 금액</label>
				  <input type="text" class="form-control" v-model="api_data.maxAmtPerVisit" v-mask="'########'"/>
          </b-col>

          <b-col cols="12" md="6">
				  <label class="mb-2">방문별로 기간마다 최대 할인 금액</label>
				  <input type="text" class="form-control" v-model="api_data.maxAmtPerVisitWeekly"/>

				  <label class="mt-3 mb-2">방문별로 기간마다 최대 할인 비율</label>
				  <input type="text" class="form-control" v-model="api_data.maxRatePerVisit" v-mask="'########'"/>

				  <label class="mt-3 mb-2">방문별로 기간마다 최대 할인 비율</label>
				  <input type="text" class="form-control" v-model="api_data.maxRatePerWeekly" />

				  <label class="mt-3 mb-2">방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대 개수</label>
				  <input type="text" class="form-control" v-model="api_data.maxCmplCntPerVisit" v-mask="'########'"/>

				  <label class="mt-3 mb-2">방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대 개수</label>
				  <input type="text" class="form-control" v-model="api_data.maxCmplCntPerWeekly"/>

				  <label class="mt-3 mb-2">방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대 시간</label>
				  <input type="text" class="form-control" v-model="api_data.maxCmplTimePerVisit" v-mask="'########'"/>

				  <label class="mt-3 mb-2">방문별로 무료로 입주사에게 제공되는 할인을 발급할 수 있는 최대 시간</label>
				  <input type="text" class="form-control" v-model="api_data.maxCmplTimePerWeekly" />

				  <label class="mt-3 mb-2">공공할인이 발행된 경우 발행할 수 있는 민간 할인 최대 개수</label>
				  <input type="text" class="form-control" v-model="api_data.maxPvtCntForPub" v-mask="'########'"/>

				  <label class="mt-3 mb-2">공공할인이 발행된 경우 발행할 수 있는 민간 할인 최대 개수</label>
				  <input type="text" class="form-control" v-model="api_data.maxPvtCntForPubWeekly"/>

				  <label class="mt-3 mb-2">주간 발급 가능 시간표</label>
				  <input type="text" class="form-control" v-model="api_data.timetable" />

				  <label class="mt-3 mb-2">휴일 발급 가능 시간표</label>
				  <input type="text" class="form-control" v-model="api_data.holiday" />
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
