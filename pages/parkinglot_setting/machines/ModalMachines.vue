<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "name": "",
    "type": "",
    "code": "",
    "zoneId": "",
    "maintainerId": "",
    "model": "",
    "protocol": "",
    "statusChecked": null,
    "lat": 0,
    "lon": 0,
    "devices": "[]",
    "details": "",
    "emgcyCar": null,
    "commrCar": null,
    "largeCar": null
}

// let origin_format = {
//   "name": "",
//   "type": "GATE_IN",
//   "code": "LPR.IN.1",
//   "siteId": "test01",
//   "zoneId": "alphadom",
//   "maintainerId": "albtrs-20240318-120506-9957vvrhf",
//   "model": "AM-LPR.13 v23",
//   "protocol": "UPC",
//   "status": "NORMAL",
//   "statusChecked": "2024-02-23 22:53:14",
//   "lat": 37.4678076,
//   "lon": 126.8018078,
//   "devices": "[{\"code\":\"FptGate\",\"data\":{\"com\":\"COM4\",\"baudrate\":9600},\"model\":\"FptGate NEW DOOR v12\",\"name\":\"차단기\",\"protocol\":\"SERIAL\",\"status\":\"NORMAL\"}]",
//   "details": "{\"color\":1}",
//   "emgcyCar": "(998|999).+\\d{4}",
//   "commrCar" : "\\d{2,3}(아|자|바|사)\\d{4}",
//   "largeCar" : "7[0-9].+\\d{4}"
// }

export default {
      mixins : [modal_default],
    data() {
        return {
            api_data: {
                ...origin_format
            },
              selected_status : '',
				options_zones : [],
				api_load_zones :false
        };
    },
	 validations: {
		  api_data : {
				name: {required},
				type : {required},
				zoneId : {required}
		  }
	 },
    created() {

    },
    mounted() {

    },
    methods: {
        reset() {
            this.api_data = {...origin_format};
            if (this.mode === 'edit') {
                this.selected_status = this.pageData.status;
            }
        },
        setPageData() {
            for (let prop in this.api_data) {
                let flag = tool_app.covertDetailToEdit(prop, this.api_data, this.pageData);
                if (flag) continue;
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
					 create : ['name','type', 'zoneId'],
					 edit : ['id','name','status','statusChecked']
				})) {
					 this.api_flag = false;
					 return;
				}


            let payLoad = tool_app.getApiData(this.api_data);
            payLoad.lat = parseFloat(payLoad.lat);
            payLoad.lon = parseFloat(payLoad.lon);

              let _devices = tool_app.makeJSONStringData(payLoad.devices);
              if (_devices === null) {
                    tool_app.dialog_alert("설비에 장착된 장치가 JSON 형식이 아닙니다.");
                    this.api_flag = false;
                    return;
              }
              payLoad.devices = _devices;

              let _details = tool_app.makeJSONStringData(payLoad.details);
              if (_details === null) {
                    tool_app.dialog_alert("부가 사항이 JSON 형식이 아닙니다.");
                    this.api_flag = false;
                    return;
              }
              payLoad.details = _details;




              if (this.mode === 'edit') {
                    payLoad.status = this.selected_status;
                    let fields = [];
                    for (let prop in payLoad) {
                          fields.push(prop);
                    }
                    payLoad.fields = fields;
              }


            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {
                let url = this.mode === 'edit' ? '/api/v1/machines/' + this.pageData.id : '/api/v1/machines';
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
                tool_app.dialog_success(`설비 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`설비 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        },
		  async loadZones(value, item) {
				try {

					 this.api_data.zoneId = '';
					 this.options_zones = [];

					 if(!item || !item.id) {
						  return;
					 }

					 if (this.api_load_client) {
						  tool_app.dialog_alert("데이터 전송중입니다.");
						  return;
					 }

					 this.api_flag = true;
					 this.api_load_zones = true;

					 let payload={
						  siteId: item.id,
						  page: 0,
						  size: 100,
						  sort: 'created,DESC'
					 }


					 const res = await mainapi.invokeAPI_GET('/api/v1/zones', payload, 'GET')

					 if (res.data.code !== $const.ApiSuccessCode.GET) {
						  tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg);
						  return;
					 }

					 let data = res.data.data;

					 this.options_zones = data.items;
				} catch (e) {
					 tool_app.dialog_alert(e);
				} finally {
					 this.api_flag = false;
					 this.api_load_zones = false;
				}
		  }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard"  :title="'설비 ' + (mode === 'edit' ? '수정' : '등록')" title-class="font-18">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <div v-if="mode==='edit'">
                              <label class="mb-2">status *</label>
                              <select class="form-select mb-3" v-model="selected_status"
										>
                                    <option v-for="(value, key) in machineStatus" :value="key" :key="key">({{ key }}) {{ value }}
                                    </option>
                              </select>
                        </div>

                        <label class="mb-2 required">설비 이름</label>
                        <input type="text" class="form-control" v-model="api_data.name" :class="{ 'is-invalid': api_submitted && $v.api_data.name.$error }"/>
							 <div v-if="api_submitted && $v.api_data.name.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.name.required">필수 입력값입니다.</span>
							 </div>

                        <label class="mt-3 mb-2 required">유형</label>
                        <select class="form-select" v-model="api_data.type" :class="{ 'is-invalid': api_submitted && $v.api_data.type.$error }">
                              <option v-for="(value, key) in machineType" :value="key" :key="key">({{ key }}) {{ value }}</option>
                        </select>
							 <div v-if="api_submitted && $v.api_data.type.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.type.required">필수 입력값입니다.</span>
							 </div>

                        <label class="mt-3 mb-2">관리 코드</label>
                        <input type="text" class="form-control" v-model="api_data.code"/>


                        <label class="mt-3 mb-2 required">주차장</label>
							 <custom-search-select v-model="api_data.zoneId" :type="'zones'" :class="{ 'is-invalid': api_submitted && $v.api_data.zoneId.$error }"
														  :is-site-name="true"
														  value-field="id" label-field="name"></custom-search-select>
							 <div v-if="api_submitted && $v.api_data.zoneId.$error" class="invalid-feedback">
								  <span v-if="!$v.api_data.zoneId.required">필수 입력값입니다.</span>
							 </div>


                        <label class="mt-3 mb-2">유지보수사</label>
							 <custom-search-select v-model="api_data.maintainerId" :type="'maintainers'"
														  value-field="id" label-field="name"></custom-search-select>


                        <label class="mt-3 mb-2">모델</label>
                        <input type="text" class="form-control" v-model="api_data.model"/>

                        <label class="mt-3 mb-2">설비 제어 방식</label>
                        <input type="text" class="form-control" v-model="api_data.protocol"/>


<!--                        <label class="mt-3 mb-2">마지막 상태 체크 일시 *</label>-->
<!--                        <input type="text" class="form-control" v-model="api_data.statusChecked"/>-->

                        <label class="mt-3 mb-2">위도(lat)</label>
                        <input type="text" class="form-control" v-model="api_data.lat"/>

                        <label class="mt-3 mb-2">경도(lon)</label>
                        <input type="text" class="form-control" v-model="api_data.lon"/>

                        <label class="mt-3 mb-2">설비에 장착된 장치</label>
                        <input type="text" class="form-control" v-model="api_data.devices"/>

                        <label class="mt-3 mb-2">부가 사항</label>
                        <input type="text" class="form-control" v-model="api_data.details"/>

                        <label class="mt-3 mb-2">긴급차량</label>
                        <input type="text" class="form-control" v-model="api_data.emgcyCar"/>

                        <label class="mt-3 mb-2">영업차량</label>
                        <input type="text" class="form-control" v-model="api_data.commrCar"/>

                        <label class="mt-3 mb-2">대형차량</label>
                        <input type="text" class="form-control" v-model="api_data.largeCar"/>
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
