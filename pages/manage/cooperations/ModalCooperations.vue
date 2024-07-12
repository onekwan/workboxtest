<script>
import {required} from "vuelidate/lib/validators";
import {mapState} from "vuex";
import modal_default from "@/mixin/modal_default";

let origin_format = {
      name : '',
      type : '',
      data : '',
      zoneId : ''
}

export default {
      mixins : [modal_default],
    components: {

    },
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
                      {path: 'zones', payload: {}}
                ])
          }
    },
    computed: {
          ...mapState({
                option_zones: state => state.selectBoxOptions.zones
          })
    },
    mounted() {

    },
    methods: {
        reset() {
            this.api_data = {...origin_format};
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

              let _data = tool_app.makeJSONStringData(payLoad.data);
              if (_data === null) {
                    tool_app.dialog_alert("부가 사항이 JSON 형식이 아닙니다.");
                    this.api_flag = false;
                    return;
              }
              payLoad.data = _data;


              if (this.mode === 'edit') {
                    let fields = [];
                    for (let prop in payLoad) {
                          fields.push(prop);
                    }
                    payLoad.fields = fields;
              }


            let msg = this.mode === 'edit' ? '수정' : '등록';
            try {

                let url = this.mode === 'edit' ? '/api/v1/cooperations/' + this.pageData.id : '/api/v1/cooperations';
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
                tool_app.dialog_success(`외부 서비스 ${msg}이 완료되었습니다.`);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`외부 서비스 ${msg}에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
            } finally {
                this.api_flag = false;
            }

        }
    }
};
</script>

<template>
      <div class="d-inline">
            <b-modal ref="modal" id="modal-standard" :title="'외부 서비스' + (mode === 'edit' ? '수정' : '등록')" title-class="font-18" size="md">
                  <b-spinner v-show="api_flag" variant="secondary" role="status" class="modal_spinner"></b-spinner>
                  <b-container>
                        <b-row>
                              <b-col cols="12">
                                    <label class="mt-3 mb-2">외부 서비스 이름 *</label>
                                    <input type="text" class="form-control" v-model="api_data.name"/>

                                    <label class="mt-3 mb-2">유형 *</label>
                                    <select class="form-select" v-model="api_data.type">
                                          <option v-for="(value, key) in cooperationsType" :value="key" :key="key">{{ value }}
                                          </option>
                                    </select>

                                    <label class="mt-3 mb-2">연동정보 *</label>
                                    <input type="text" class="form-control" v-model="api_data.data"/>

                                    <label class="mt-3 mb-2">주차장 *</label>
                                    <custom-multi-select v-model="api_data.zoneId" :options="option_zones"
                                                         label="name" value-field="id"
                                                         placeholder="주차장을 선택해주세요."/>
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
