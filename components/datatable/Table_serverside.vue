<template>
	 <div>
		  <SearchForm size="lg" gutter="no" :hide-filter-box="hideFilterBox">

				<template #filter>
					 <slot name="filter">

					 </slot>
				</template>
				<template #button>
					 				 <div class="text-center mt-2">
<!--					 					  <Button label="Secondary" class="p-button-info mr-1" @click="btn_filter_reset">-->
<!--					 							<i class="pi pi-refresh mr-1"></i> 초기화-->
<!--					 					  </Button>-->
                                  <button class="btn btn-secondary" @click="resetFilter">초기화</button>
					 					  <button class="btn btn-dark" @click="btn_search">검색</button>
					 				 </div>
				</template>
		  </SearchForm>

		  <!--	 <div class="table_wrapper" :style="{overflowX:minWidth ? 'auto' : 'hidden'}">-->
		  <div class="table_wrapper mt-2">




				<b-table ref="dataTable" :items="showRows"
							:fields="tableProperty.fields" :per-page="perPage"
							:table-class="'table-bordered custom_table01'"
							responsive="xl"
							show-empty

				>

					 				<template v-for="item in tableProperty.fields" v-slot:[`cell(${item.key})`]="data">
										 <template v-if="hasSlot(item.key)">
											  <slot :name="item.key" :data="{value:data.item[item.key],item:data.item}"></slot>
										 </template>
                               <template v-else-if="item.key==='IDX'">
                                       {{((startIdx-1)*perPage)+data.index+1}}
                               </template>
										 <template v-else-if="!hasSlot(item.key)">
												 <!-- moment 날짜인지 확인 -->
												 <template v-if="item.type==='date'">
														{{ formatDate(data.item[item.key]) }}
											    </template>
												 <template v-else>
                                           {{data.item[item.key]}}
												 </template>


										 </template>
					 				</template>
					 <template #empty="scope">
						  <div class="empty_data">
								조회된 데이터가 없습니다.
						  </div>
					 </template>
				</b-table>




				<div v-show="loadingFlag===true" class="loading_wrapper">
					 <b-spinner></b-spinner>
				</div>

				<!--		  <table class="table table-bordered custom_table01 mt-2" :style="{minWidth:minWidth ? minWidth+'px' : 'auto'}">-->
				<!--				<thead>-->
				<!--				<tr>-->
				<!--					 &lt;!&ndash;				<slot name="table_header"></slot>&ndash;&gt;-->
				<!--					 <th v-for="item in tableProperty.fields" v-html="item.label"></th>-->
				<!--				</tr>-->
				<!--				</thead>-->
				<!--				<tbody v-show="loadingFlag===false">-->
				<!--				<tr class="cursor-pointer" v-for="row in showRows">-->
				<!--					 &lt;!&ndash;				<slot name="table_body" :item="item"></slot>&ndash;&gt;-->
				<!--					 <td v-for="item in tableProperty.fields">-->
				<!--						  <template v-if="$slots[item.key]">-->
				<!--								<slot :name="item.key" :item="row"></slot>-->
				<!--						  </template>-->
				<!--						  <template v-if="!$slots[item.key]">-->
				<!--								<template v-if="item.type==='date'">{{ $local_time(row[item.key]) }}</template>-->
				<!--								<template v-if="item.type!=='date'">{{ row[item.key] }}</template>-->
				<!--						  </template>-->
				<!--					 </td>-->
				<!--				</tr>-->
				<!--				</tbody>-->
				<!--		  </table>-->
		  </div>

		  <div class="mt-3"  v-show="initFlag===true">
				<Pagenation v-model="currentPage" :total-rows="totalRows"
								:per-page="perPage" type="serverside" :callback="wrappingGetList"></Pagenation>
		  </div>
		  <div class="mt-3 text-right">
<!--				<button type="button" class="btn btn-dark" @click="btn_xlsx_down">-->
<!--					 다운로드-->
<!--				</button>-->
		  </div>
	 </div>

</template>
<script>
import Pagenation from './Pagenation';
import SearchForm from "./Search-form";



export default {
	 setup(props, { slots }) {
		  const hasSlot = name => !!slots[name]
		  return { hasSlot }
	 },
	 created() {
		  let vm = this;

		  this.startIdx = this.currentPage = this.tableProperty.currentPage;

		  if (!this.tableProperty.noUrlQuery) {
				let query = tool_app.deepCopy(this.$route.query);
				if (query.page && !isNaN(query.page)) {
					 this.startIdx = this.currentPage = parseInt(query.page);
				}
		  }

		  if(typeof this.filterReset ==='function') this.visible_filter_reset = true;

        this.tableProperty.fields.unshift({key: "IDX", label: "No."})

		  this.selectedColumns = tool_app.deepCopy(this.tableProperty.fields);

		  this.scrollHeight = this.wHeight-370+'px';

		  this.setFilter(this.filters);

		  this.setReqQuery();
	 },
	 components: {
		  Pagenation, SearchForm
	 },
	 data: () => ({
		  initFlag : false,
		  totalPage: 0,
		  totalRows: 0,
		  currentPage: 1,
		  startIdx : 1, //페이지를 누르면 데이터를 불러오기 전에 currentPage페이지가 변경되어, IDX 값이 미리 변경되는 이슈를 해결하기 위해
		  showRows: [],
		  tableData: [],
		  loadingFlag: true,
		  perPage: 50,
		  visible_filter_reset : false,
		  selectedColumns : [],
		  scrollHeight : '400px',
		  selectedRowCheckbox : [],
		  refreshMode :false,
		  refreshIntervalTime : 60000,
		  intervalRefresh : null,
		  flag_toggleTableSize : false,
		  req_filter : false,
		  cnt : 0
	 }),
	 props: ['tableProperty', 'initBlock','filters','filterReset','minWidth','hideFilterBox','getList'],
	 mounted() {
		  //this.init();
		  this.perPage = this.tableProperty.perPage ? this.tableProperty.perPage : this.perPage;
		  this.wrappingGetList();
	 },
	 methods: {
		  setFilter(target){
				let route = this.$route;
				for(let prop in route.query){
					 // tool_app.log('setFilter')
					 // tool_app.log(vue.$route.query[prop]);
					 if(isNaN(route.query[prop])){
						  if(route.query[prop] === 'true'){
								target[prop] = true;
						  }else if(route.query[prop] === 'false'){
								target[prop] = false;
						  }else{
								target[prop] = route.query[prop];
						  }
					 }else{
						  if(prop.indexOf('startDate') > -1){
								//target[prop] = moment(route.query[prop]);
								target.daterange[prop] = moment(parseInt(route.query[prop])).format();
						  }else if(prop.indexOf('endDate') > -1){
								target.daterange[prop] = moment(parseInt(route.query[prop])).format();
						  }else{
								if(route.query[prop].length > 1 && route.query[prop][0] ==='0'){
									 target[prop] = route.query[prop];
								}else{
									 target[prop] = parseInt(route.query[prop]);
								}
						  }
					 }
				}
		  },
        resetFilter(){
            for(let prop in this.filters){
                this.filters[prop] = ''
				}
            this.btn_search(true);
		  },
		  setRefreshInterval(){
				let vm = this;
				this.intervalRefresh = setInterval(function(){
					 if(vm.refreshMode === true){
						  vm.wrappingGetList();
					 }
				}, this.refreshIntervalTime)
		  },
		  clearRefreshInterval(){
				if(this.intervalRefresh) clearInterval(this.intervalRefresh);
		  },
		  toggleRefresh(){
				if(this.refreshMode === true){
					 this.wrappingGetList();
					 this.setRefreshInterval();
				}else{
					 this.clearRefreshInterval();
				}
		  },
		  async wrappingGetList() {
				let vm = this;

				vm.loadingFlag = true;

				let opt = {
					 page: this.currentPage,
					 perPage: this.perPage,
					 filters : this.req_filter
				};

				try {
					 let res = await this.getList(opt);
					 this.showRows = res.data;
					 this.totalRows = res.totalCount;
					 this.currentPage = res.page;
					 this.startIdx = this.currentPage;
				} catch (e) {
					tool_app.log(e)
				} finally {
					 if(!this.initFlag) this.initFlag = true;
					 this.loadingFlag = false;
				}
		  },
		  refresh(){
				this.currentPage = 1;
				this.wrappingGetList();
		  },
		  btn_filter_reset(){
				this.filterReset();
				this.setReqQuery()
				this.pagingQueryMaker(this.$route, this.req_filter);
				this.wrappingGetList();
		  },
		  btn_search(reset) {
				this.setReqQuery();
				this.insertInputQuery(reset);
				this.wrappingGetList();
		  },
		  insertInputQuery(reset) {
              let filtered = Object.keys(this.req_filter).reduce((acc, key) => {
						if (this.req_filter[key] !== '') {
							 acc[key] = this.req_filter[key];
						}
						return acc;
				  }, {});
				this.pagingQueryMaker(this.$route, filtered, reset);
		  },
		  setReqQuery(){
				this.req_filter = tool_app.deepCopy(this.filters);
		  },
		  queryToCode(val) {
				if (val === 'true') {
					 return true;
				} else if (val === 'false') {
					 return false;
				}
		  },
		  async btn_xlsx_down() {
				let vm = this;
				let opt = {
					 page: this.currentPage,
					 perPage: this.perPage,
					 filters : this.req_filter
				}
				let getData = await tool_app.MakeExcelList(vm.tableProperty.getList, opt)

				//let getData = await vm.wrappingGetList(true);

				const items = getData
						.map((item) => {
							 let row = [];
							 vm.tableProperty.fields.forEach(function (opt) {
								  if (opt.type === 'date') {
										let value = item[opt.key] === null ? '' : vm.$local_time(item[opt.key]);
										row.push(value);
								  } else {
										let value = item[opt.key] === null ? '' : item[opt.key]+'';
										if(opt.excelValueKey){
											 value = GlobalValue[opt.excelValueKey][value];
										}
										row.push(value);
								  }
							 })
							 return row;
						});
				const data = {
					 cols: this.tableProperty.fields.map(({label}) => label),
					 items,
					 filename: this.tableProperty.excelName + ` ${moment().format('yyyy-MM-DD')}`,
					 sheetname: [this.tableProperty.excelName],
				}
				tool_app.downloadExcel(data);
		  }
	 }
};
</script>
<style lang="scss">
.empty_data{
	text-align: center;
	 padding:50px 0;
}
.table_wrapper{position: relative}
.header_wrapper{
	 display: flex;
}
.p-frozen-column{z-index:10}
.p-datatable-scrollable-table > .p-datatable-thead {
	 position: sticky;
	 top: 0;
	 z-index: 35;
}

.p-datatable-thead{
	 tr{
		  .last{
				border-right:2px solid #ddd !important;
		  }
	 }

}
.p-datatable-tbody{
	 tr{
		  td.last{
				border-right:2px solid #ddd !important;
		  }
	 }
}
.p-column-header-content{
	 position:relative;
	 justify-content: center;
	 .wrap_btn_frozen_row{
		  position:absolute;
		  top:0;right:0;bottom:0;left:0;
		  display: flex;
		  justify-content: center;
		  .btn_frozen_row{
				opacity: 0;
		  }
		  &:hover{
				.btn_frozen_row{
					 opacity: 1;
				}
		  }
	 }
}
.loading_wrapper{
	 position: absolute;
	 display: flex;justify-content: center;align-items: center;
	 top:0;left:0;right:0;bottom:0;z-index: 100;background-color: rgba(0,0,0,0.05);
}
</style>
