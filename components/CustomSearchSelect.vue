<template>
      <div class="custom-select-container" :class="[isInvalid ? 'is-invalid' : '']">
			   <div>
					 <div class="selectedItem" v-for="item in multiple_value">
						  {{item.label}}
						  <button>
								<i class="fas fa-times" @click="deleteInMultiple(item.value)"></i>
						  </button>
					 </div>
				</div>
            <div class="input-group">
                  <input type="text" v-model="search_value" class="form-control"
                         :class="[isInvalid ? 'is-invalid' : '']"
                         @keydown.enter="handleSearchChange" @blur="handleFocus('out')" :disabled="disabled"
                         placeholder="엔터키를 눌러 검색 해주세요">
                  <div class="input-group-append">
                        <button style="position: absolute; right: 44px; top: 7px;background: transparent;border: 0;"
                                @click="clearValue" v-if="!disabled">
                              <i class="fas fa-times" aria-hidden="true" style="color: #ccc;"></i>
                        </button>
                        <button class="btn btn-success" type="button" :disabled="isLoading || disabled"
                                @click="handleSearchChange">
                              <i class="fas fa-search"></i>
                              <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status"
                                    aria-hidden="true"></span>
                        </button>
                  </div>
            </div>

            <ul class="custom-options" v-show="options.length > 0 && visible_options">
                  <li v-for="option in options" :value="option.value" :key="option.value"
                      @mousedown="selectOption(option)" class="custom-option">{{ option.label }}
                  </li>
                  <li v-if="options.length >= searchSize" class="custom-option">최대 {{ searchSize }}개 까지만 검색됩니다. 키워드를
                        변경해주세요.
                  </li>
            </ul>
            <div v-if="options.length === 0 && visible_options" class="no-options-box">
                  <p style="margin-bottom: 0;">검색된 데이터가 없습니다.</p>
            </div>

      </div>
</template>

<script>
import {tooltip} from "leaflet";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
    data() {
        return {
            search_value: '',
            origin_search_value: '',
            visible_options: false,
            isLoading: false,
            options: [],
            originOptionsData : [],
            initFlag: false,
            searchSize: 100,
            typeList: {
					 'login' : {
						  path : '/api/v1/anonymous/sites',
						  payload: {}
					 },
                'passform': {
                    path: '/api/v1/pass-forms',
                    payload: {}
                },
					 'passGroups': {
						  path: '/api/v1/pass-groups',
						  payload: {}
					 },
                'discountform': {
                    path: '/api/v1/discount-forms',
                    payload: {}
                },
                'users': {
                    path: '/api/v1/users',
                    payload: {}
                },
                'zones': {
                    path: '/api/v1/zones',
                    payload: {}
                },
					 'zoneGroups': {
						  path: '/api/v1/zone-groups',
						  payload: {}
					 },
                'sites': {
                    path: '/api/v1/sites',
                    payload: {}
                },
                'clients': {
                    path: '/api/v1/clients',
                    payload: {}
                },
                'tenants': {
                    path: '/api/v1/tenants',
                    payload: {}
                },
					 'managers': {
						  path : '/api/v1/managers',
						  payload: {}
					 },
					 'tenantgroups': {
						  path : '/api/v1/tenant-groups',
						  payload: {}
					 },
                'developers': {
                    path: '/api/v1/managers',
                    payload: {
                        type: 'DEVELOPER',
                        suspended: false
                    }
                },
                'operators': {
                    path: '/api/v1/managers',
                    payload: {
                        type: 'OPERATOR',
                        suspended: false
                    }
                },
                'maintainers': {
                    path: '/api/v1/managers',
                    payload: {
                        type: 'MAINTAINER',
                        suspended: false
                    }
                },
                'parkinglots': {
                    path: '/api/v1/parkinglots',
                    payload: {}
                },
                'vehicles': {
                    path: '/api/v1/vehicles',
                    payload: {}
                },
                'tickets': {
                    path: '/api/v1/tickets',
                    payload: {}
                },
                'payments': {
                    path: '/api/v1/payments',
                    payload: {}
                },
                'reservations': {
                    path: '/api/v1/reservations',
                    payload: {}
                },
                'events': {
                    path: '/api/v1/events',
                    payload: {}
                },
                'reports': {
                    path: '/api/v1/reports',
                    payload: {}
                },
                'statistics': {
                    path: '/api/v1/statistics',
                    payload: {}
                },
					 'machineGroups': {
						  path: '/api/v1/machine-groups',
						  payload: {}
					 },
            },
				multiple_value : [],
        }
    },
    watch: {
        initData() {
            this.setInitData();
        },
        value() {
            if (this.value === '' || (Array.isArray(this.value) && this.value.length === 0)) {
                this.search_value = '';
                this.origin_search_value = '';
					 this.multiple_value = [];
            }
        }
    },
    props: ['valueField', 'labelField', 'type', 'disabled', 'value', 'multiple', 'placeholder', 'initData', 'isInvalid','isSiteName',
			 'beforeSearch', 'payload'
	 ],
    created() {
        this.valueField = this.valueField ?? 'id';
        this.labelField = this.labelField ?? 'name';
        this.setInitData();
    },
    methods: {
        selectOption(item) {
            this.setData(item);

        },
        handleFocus(type) {
            let vm = this;
            if (type === 'out') {
                this.visible_options = false;

                setTimeout(function () {
                    vm.search_value = vm.origin_search_value;
                }, 110)


            } else {

            }
        },
        handleSearchChange(event) {
				if(typeof this.beforeSearch === 'function'){
					 if(this.beforeSearch() === false) return;
				}

            this.getList();

        },
        async getList(query) {

            if (this.isLoading) {
                return;
            }
            this.isLoading = true;


            this.options = [];

            let payLoad = {
                name: this.search_value,
                page: 0,
                size: this.searchSize,
                sort: 'created,DESC'
            }

				// 만약 this.payload가 있으면 payLoad 에 추가
				if(this.payload){
					 payLoad = Object.assign(payLoad, this.payload);
				}


            if (this.typeList[this.type] && this.typeList[this.type].payload) {
                Object.assign(payLoad, this.typeList[this.type].payload);
            }

            try {
                let res = await mainapi.invokeAPI_GET(this.typeList[this.type].path, payLoad)

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }

                let data = res.data.data;
                this.originOptionsData = data.items;

                this.visible_options = true;
                if (this.originOptionsData.length > 0) {

                    this.setOptions();
                }

            } catch (error) {
                console.error('데이터를 불러오는 데 실패했습니다:', error);
            } finally {
                this.isLoading = false;
            }
        },
        setOptions() {
            let vm = this;
            this.originOptionsData.forEach(item => {
					 let label = '';
					 if(vm.type==='zones' || vm.isSiteName){
						  let siteName = item.site ? (item.site.name || item.site.siteName || '') : '';
						  label = item[vm.labelField]+'('+siteName + ')';
					 }else{
						  label = item[vm.labelField];
					 }
                vm.options.push({
                    label: label,
                    value: item[vm.valueField]
                })
            })
        },
        clearValue() {
				if(this.multiple){
					 this.search_value = '';
				}else{
					 this.$emit('input', '',null);
					 this.search_value = '';
				}

        },
        setInitData() {
            if (this.initFlag || !this.initData) return false;

				if(this.multiple){
					 if(Array.isArray(this.initData)){
						  for(let i=0;i<this.initData.length;i++){
								let item = {
									 value : this.initData[i][this.valueField],
									 label : this.initData[i][this.labelField]
								}
								this.multiple_value.push(item);
						  }
						  this.$emit('input', this.inputMultipleValue(),null,true);
					 }
				}else{
					 let value = this.initData[this.valueField] ? this.initData[this.valueField] : '';
					 let label = this.initData[this.labelField] ? this.initData[this.labelField] : '';

					 this.setData({
						  value: value,
						  label: label
					 },true);
				}

        },
		  setChangeData(changeItem){
				if(this.multiple){
					 if(Array.isArray(changeItem)){
						  for(let i=0;i<changeItem.length;i++){
								let item = {
									 value : changeItem[i][this.valueField],
									 label : changeItem[i][this.labelField]
								}
								this.multiple_value.push(item);
						  }
						  this.$emit('input', this.inputMultipleValue(),null,false);
					 }
				}else{
					 let value = changeItem[this.valueField] ? changeItem[this.valueField] : '';
					 let label = changeItem[this.labelField] ? changeItem[this.labelField] : '';

					 this.setData({
						  value: value,
						  label: label
					 },false);
				}
		  },
        setData(item,init) {
            let vm = this;
            //팝업 display delay 묹제
            setTimeout(function () {
					 if(vm.multiple){
						  let checkDupl =false;
						  vm.multiple_value.forEach(function(i){
								if(i.value === item.value){
									 checkDupl = true;
								}
						  })
						  vm.origin_search_value = vm.search_value = '';
						  if(checkDupl) return;
						  vm.multiple_value.push(item);
						  vm.$emit('input', vm.inputMultipleValue(),null,init);
					 }else{
						  vm.$emit('input', item.value, vm.getOriginOptionData(item),init);
						  vm.origin_search_value = vm.search_value = item.label;
					 }
            }, 100)
        },
          getOriginOptionData(item){
            let vm = this;
            if(Array.isArray(this.originOptionsData) && this.originOptionsData.length===0) return null;
            return this.originOptionsData.find(function (element) {
                return element[vm.valueField] === item.value;
            });

          },
		  inputMultipleValue(){
				let result = [];
				this.multiple_value.forEach(function(item){
					 result.push(item.value);
				});
				return result;
		  },
		  deleteInMultiple(id){
				// this.multiple_value 에서 id 를 찾아서 삭제
				let index = this.multiple_value.findIndex(function(item){
					 return item.value === id;
				});
				this.multiple_value.splice(index,1);
				this.$emit('input', this.inputMultipleValue());
		  }
    },
    mounted() {


    }
};
</script>
<style lang="scss">
.multiselect--disabled {
    background: #f5f6f8;

    .multiselect__select {
        display: none
    }

    .multiselect__tags {
        background: #f5f6f8 !important;
    }

    .multiselect__single {
        background: #f5f6f8 !important;
    }
}

.multiselect__option--selected {
    background: #f3f3f3;
    color: #999 !important;
    font-weight: 700;
}

.multiselect__spinner:after, .multiselect__spinner:before {
    z-index: 10;

}

.custom-options {
    list-style: none;
    padding: 0;
    margin: 0;
    background: #fff;
    border: 1px solid #ccc;
    max-height: 200px;
    overflow-y: auto;
}

.custom-option {
    padding: 10px 15px;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
}

.no-options-box {
    text-align: center;
    padding: 10px;
    color: #999;
    list-style: none;
    margin: 0;
    background: #fff;
    border: 1px solid #ccc;
}

.selectedItem{
	 display:inline-block;
	 background-color:#89a9f5;
	 padding:2px 10px;
	 padding-right:22px;
	 border-radius:2px;
	 position:relative;
	 margin-right: 5px;
	 margin-bottom:5px;
	 color:#fff;
	 button{
		  background-color:#89a9f5;
		  position:absolute;top:3px;right:0;color:#fff;font-size:12px;border:0;
	 }
}
</style>
