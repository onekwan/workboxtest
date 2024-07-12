<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
    "zoneIdList": []
};

export default {
    mixins : [modal_default],
	 data() {
		  return {
				api_data: {
					 ...origin_format
				}
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
        },
		  async api_request() {
				if (this.api_flag) {
					 tool_app.dialog_alert("데이터 전송중입니다.");
					 return;
				}


				this.api_flag = true;
				this.api_submitted = true;

				if(this.api_data.zoneIdList.length === 0){
					 this.api_flag = false;
					 return;
				}


				let payLoad = tool_app.getApiData(this.api_data);
            payLoad.zoneIdList = tool_app.emptyArrayNull(payLoad.zoneIdList);

            let msg = '등록';
				try{
                let url = `/api/v1/zone-groups/${this.pageData.id}/attach`;
					 let res = await mainapi.invokeAPI(url, payLoad,'POST');

                let successCode = $const.ApiSuccessCode.PUT;
					 if(res.data.code !== successCode){
						  throw res.data.msg;
						  return false;
					 }

					 this.hide();
					 this.api_submitted = false;
					 this.api_flag = false;
					 if (this.callback) this.callback();
                tool_app.dialog_success(`주차장 ${msg}이 완료되었습니다.`);
				}catch (e) {
					 tool_app.log(e)
                tool_app.dialog_alert(`주차장 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
				}finally {
					 this.api_flag = false;
				}
		  }
	 }
};
</script>

<template>
	 <div class="d-inline">
		  <b-modal ref="modal" id="modal-standard" :title="'주차장 추가'" title-class="font-18">
				<b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
				<b-container>

						<div>
                      <label class="mt-3 mb-2">주차장 *</label>
							 <custom-search-select v-model="api_data.zoneIdList" :type="'zones'" :multiple="true" :isSiteName="true"
														  :class="{ 'is-invalid': api_submitted && api_data.zoneIdList.length===0 }"
														  value-field="id" label-field="name"></custom-search-select>
							 <div v-if="api_submitted && api_data.zoneIdList.length===0" class="invalid-feedback">
								  <span>추가 할 주차장이 없습니다.</span>
							 </div>
						</div>




				</b-container>
				<template #modal-footer>
					 <div class="w-100" style="text-align:right">
						  <button class="btn btn-secondary" @click="hide">취소</button>
                      <button class="btn" :class="'btn-info'"
                              @click="api_request">추가
                      </button>
					 </div>
				</template>
		  </b-modal>

	 </div>
</template>
