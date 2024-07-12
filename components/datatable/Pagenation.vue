<template>
      <div class="pagenation_wrapper">
            <div class="pagenation">
                  <button @click="gotoStartPage()" :disabled="startBlock===0">«</button>
                  <button @click="changeBlock()" :disabled="startBlock===0">‹</button>
                  <span class="elli" v-show="startBlock!==0">…</span>
                  <ol>
                        <li v-for="item in repeatTime">
                              <button :class="{active:(startBlock+item)===value}" @click="changePage(startBlock+item)">{{startBlock+item}}</button>
                        </li>
                  </ol>
                  <span class="elli" v-show="(startBlock+perBlock)<totalPage">…</span>
                  <button @click="changeBlock('next')" :disabled="(startBlock+perBlock)>=totalPage">›</button>
                  <button  @click="gotoLastPage()" :disabled="(startBlock+perBlock)>=totalPage">»</button>
            </div>
      </div>
</template>
<script>
export default {
    data: () => ({
        totalPage : 0,
        perBlock : 10,
        startBlock : 0
    }),
    props : ['value','totalRows','perPage','noUrlQuery','initBlock','callback'],
    computed:{
        repeatTime(){
            this.totalPage = this.getTotalPage();

            let limit = this.totalPage-(this.startBlock+this.perBlock);
            if(limit<0){
                limit = Math.abs(this.perBlock + limit);
            }else{
                limit = this.perBlock;
            }
            return limit;
        }
    },
    mounted() {
        //this.init();
        if(this.$isMobile()){
            this.perBlock =3;
        }
        if(this.initBlock){
            this.perBlock = this.initBlock;
        }
    },
    watch : {
        totalRows(){
            this.init();
        }
    },
    methods: {
        changePage(item){
            let vm = this;
            this.$emit('input', item);
            this.callback();
            if(vm.noUrlQuery !== true){
                this.pagingQueryMaker(this.$route,{page:item});
            }
            // if(type==='init' || vm.noUrlQuery === true){
            //
            // }else if(type==='delay'){
            // 	 this.callback(item);
            // 	 setTimeout(function(){
            // 		  // tool_app.log('changePage1')
            // 		  // tool_app.log('item : ', item);
            // 		  vm.pagingQueryMaker(vm.$route,{page:item});
            // 	 },1000)
            // } else{
            // 	 this.callback(item);
            //
            // 	 this.pagingQueryMaker(this.$route,{page:item});
            // }
        },
        init(){
            this.totalPage = this.getTotalPage();

            let current = this.value;
            if(this.value > this.totalPage){
                current = this.totalPage;
                // tool_app.log('this.value : ', this.value);
                // tool_app.log('this.totalPage : ', this.totalPage);
                // tool_app.log('init in total')
                this.changePage(this.totalPage);
            }

            this.startBlock = this.perBlock * parseInt(current/this.perBlock);
        },
        changeBlock(type){
            if(type==='next'){
                this.startBlock+= this.perBlock;
                this.changePage(this.startBlock+1);
            }else{
                this.startBlock-= this.perBlock;
                this.changePage(this.startBlock+1);
            }
        },
        gotoStartPage(){
            this.startBlock = 0;
            this.changePage(this.startBlock+1);
        },
        gotoLastPage(){
            let num = parseInt((this.totalPage-1)/this.perBlock);
            this.startBlock = num*this.perBlock;
            this.changePage(this.startBlock+1);
        },
        getTotalPage(){
            return parseInt((this.totalRows-1)/this.perPage) + 1;
        }
    }
};
</script>
