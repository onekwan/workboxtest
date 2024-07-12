<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "name": "",
    // "clientId": "",
	 // "siteId": "",
    "zoneIds": []
};

export default {
    mixins : [modal_default],
	 data() {
		  return {
				api_data: {
					 ...origin_format
				},
            option_zones: [],
            api_load_zones : false
		  };
	 },
    created() {

    },
	 mounted() {

	 },
	 methods: {
        reset() {
            this.api_data = {...origin_format};
        },
        setPageData() {
            for (let prop in this.api_data) {
                let flag =  tool_app.covertDetailToEdit(prop, this.api_data ,this.pageData);
                if(flag) continue;
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


				let payLoad = tool_app.getApiData(this.api_data);
            payLoad.zoneIds = tool_app.emptyArrayNull(payLoad.zoneIds);

            if (this.mode === 'edit') {
                payLoad = {
                    name : payLoad.name
					 }
                let fields = [];
                for (let prop in payLoad) {
                    fields.push(prop);
                }
                payLoad.fields = fields;
            }

            let msg = this.mode === 'edit' ? '수정' : '등록';
				try{
                let url = this.mode === 'edit' ? '/api/v1/zone-groups/' + this.pageData.id : '/api/v1/zone-groups';
					 let res = await mainapi.invokeAPI(url, payLoad,this.mode === 'edit' ? 'PATCH' : 'POST');

                let successCode = this.mode === 'edit' ? $const.ApiSuccessCode.PATCH : $const.ApiSuccessCode.POST;
					 if(res.data.code !== successCode){
						  throw res.data.msg;
						  return false;
					 }

					 this.hide();
					 this.api_submitted = false;
					 this.api_flag = false;
					 if (this.callback) this.callback();
                tool_app.dialog_success(`주차장 그룹 ${msg}이 완료되었습니다.`);
				}catch (e) {
					 tool_app.log(e)
                tool_app.dialog_alert(`주차장 그룹 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
				}finally {
					 this.api_flag = false;
				}
		  }
	 }
};
</script>

<template>
	 <div class="d-inline">
		  <b-modal ref="modal" id="modal-standard" :title="'주차장 그룹 ' + (mode === 'edit' ? '수정' : '등록')" title-class="font-18">
				<b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
				<b-container>
					 <label class="mb-2">그룹 이름 *</label>
					 <input type="text" class="form-control" v-model="api_data.name"/>

<!--					 <label class="mt-3 mb-2">고객사 *</label>-->
<!--                  <custom-multi-select v-model="api_data.clientId" :options="option_clients"-->
<!--                                       label="name" value-field="id"-->
<!--                                       placeholder="고객사를 선택해주세요."/>-->

<!--                  <div v-if="mode!=='edit'">-->
<!--                        <label class="mt-3 mb-2">사업장 *</label>-->
<!--                        <custom-search-select v-model="api_data.siteId" :type="'sites'" :disabled="mode==='edit'"-->
<!--                                              @input="loadZones"-->
<!--                                              :init-data="pageData && pageData.site ? pageData.site : null"-->
<!--                                              value-field="id" label-field="name"></custom-search-select>-->
<!--						</div>-->


						<div v-if="mode!=='edit'">
                      <label class="mt-3 mb-2">주차장 *</label>
							 <custom-search-select v-model="api_data.zoneIds" :type="'zones'" :multiple="true" :isSiteName="true"
														  value-field="id" label-field="name"></custom-search-select>
						</div>




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
