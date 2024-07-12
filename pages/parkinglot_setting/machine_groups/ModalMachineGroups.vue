<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";
let origin_format = {
   "name": "",
   "machineIds": ""
}

export default {
    mixins : [modal_default],
	 data() {
		  return {
				api_submitted: false,
				api_flag: false,
				api_data: {
					 ...origin_format
				}
		  };
	 },
    created() {
        if (this.mode !== 'edit') {
            this.setSelectBoxOptions([
                {path: 'machines', payload: {}}
            ])
        }
    },
    computed: mapState({
        option_machines: state => state.selectBoxOptions.machines
    }),
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


        let payLoad = tool_app.getApiData(this.api_data);
        payLoad.machineIds = tool_app.emptyArrayNull(payLoad.machineIds);

        if (this.mode === 'edit') {
            delete payLoad.machineIds;
            let fields = [];
            for (let prop in payLoad) {
                fields.push(prop);
            }
            payLoad.fields = fields;
        }

        let msg = this.mode === 'edit' ? '수정' : '등록';
				try{
           let url = this.mode === 'edit' ? '/api/v1/machine-groups/' + this.pageData.id : '/api/v1/machine-groups';
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
           tool_app.dialog_success(`설비 그룹 ${msg}이 완료되었습니다.`);
				}catch (e) {
					 tool_app.log(e)
           tool_app.dialog_alert(`설비 그룹 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
				}finally {
					 this.api_flag = false;
				}

		  }
	 }
};
</script>

<template>
	 <div class="d-inline">
		  <b-modal ref="modal" id="modal-standard" title="설비 그룹 등록" title-class="font-18">
				<b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
				<b-container>
					 <label class="mb-2">설비 그룹 이름 *</label>
					 <input type="text" class="form-control" v-model="api_data.name"/>

          <div v-if="mode !== 'edit'">
					  <label class="mt-3 mb-2">설비 아이디 *</label>
                <custom-multi-select v-model="api_data.machineIds" :options="option_machines"
                                     label="name" value-field="id" :multiple="true"
                                     placeholder="설비를 선택해주세요."/>
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
