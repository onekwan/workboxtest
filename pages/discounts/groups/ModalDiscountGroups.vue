<script>
import {required} from "vuelidate/lib/validators";
import modal_default from "@/mixin/modal_default";

let origin_format = {
  discountFormIds : [],
  "maxCntPerVisit": 0,
  "maxValPerVisit": 0,
  "maxCntInDay": 0,
  "maxValInDay": 0
}

// let origin_format = {
//   "maxCntPerVisit": 1,
//   "maxValPerVisit": 2,
//   "maxCntInDay": 10,
//   "maxValInDay": 20
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
		  option_discountForms : []
    };
  },
  created() {

  },
  computed: {},
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

		  if(prop==='discountFormIds'){
				this.option_discountForms = this.pageData['discountForms'].map((item) => {
					 return {id: item.id, name : item.name}
				})
				this.api_data[prop] = this.pageData['discountForms'].map((item) => {
					 return {id: item.id, name : item.name}
				})
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

      let payLoad = tool_app.getApiData(this.api_data);
      payLoad.discountFormIds = tool_app.makeArrayForCreateApi(payLoad.discountFormIds);
      payLoad.maxCntPerVisit = parseInt(payLoad.maxCntPerVisit);
      payLoad.maxValPerVisit = parseInt(payLoad.maxValPerVisit);
      payLoad.maxCntInDay = parseInt(payLoad.maxCntInDay);
      payLoad.maxValInDay = parseInt(payLoad.maxValInDay);

      if (this.mode === 'edit') {
        let fields = [];
        for (let prop in payLoad) {
          fields.push(prop);
        }
        payLoad.fields = fields;
      }


      let msg = this.mode === 'edit' ? '수정' : '등록';
      try {
        let url = this.mode === 'edit' ? '/api/v1/discount-groups/' + this.pageData.id : '/api/v1/discount-groups';
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
        tool_app.dialog_success(`할인 속성 그룹 ${msg}이 완료되었습니다.`);
      } catch (e) {
        tool_app.log(e)
        tool_app.dialog_alert(`할인 속성 그룹 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
      } finally {
        this.api_flag = false;
      }
    },
		changeClient(value,item,init){
			 if(init) return;
			 if(value == ''){
				  this.option_discountForms = [];
				  this.api_data.discountFormIds = [];
				  return;
			 }

			 this.loadDiscountForms();
		},
		async loadDiscountForms() {
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

				  let res = await mainapi.invokeAPI_GET('/api/v1/discount-forms', payload)

				  if (res.data.code !== $const.ApiSuccessCode.GET) {
						tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
				  }

				  let data = res.data.data;

				  this.option_discountForms = data.items;
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

			 <label class="mb-2">고객사를 우선 선택해주세요.</label>
			 <custom-search-select v-model="api_data.clientId" :type="'clients'"
										  @input="changeClient"
										  :init-data="this.pageData && this.pageData.client ? this.pageData.client : null"
										  :class="{ 'is-invalid': api_submitted && $v.api_data.clientId.$error }"
										  value-field="id" label-field="name"></custom-search-select>


			 <label class="mt-3 mb-2">대상 할인 유형들</label>
			 <custom-multi-select v-model="api_data.discountFormIds" :options="option_discountForms"  :class="{ 'is-invalid': api_submitted && $v.api_data.mainZoneId.$error }"
										 label="name" value-field="id" :multiple="true"
										 placeholder="할인 유형을 선택해주세요."/>



        <label class="mt-3 mb-2">방문당 대상 할인 유형들의 최대 발급 개수</label>
        <input type="text" class="form-control" v-model="api_data.maxCntPerVisit"/>

        <label class="mt-3 mb-2">방문당 대상 할인 유형들의 최대값(할인의 `type`이 같아야 하고, 그에 따라 단위가 결정된다.)</label>
        <input type="text" class="form-control" v-model="api_data.maxValPerVisit"/>

        <label class="mt-3 mb-2">차량당 1일 대상 할인 유형들의 최대 발급 개수</label>
        <input type="text" class="form-control" v-model="api_data.maxCntInDay"/>

        <label class="mt-3 mb-2">차량당 1일 대상 할인 유형들의 최대값(할인의 `type`이 같아야 하고, 그에 따라 단위가 결정된다.)</label>
        <input type="text" class="form-control" v-model="api_data.maxValInDay"/>
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
