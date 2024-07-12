<template>
<!--  <a :href="'/#'+currentPath + id" target="_blank">-->
<!--    {{name}}-->
<!--  </a>-->
  <div>
    <div v-if="linkList.length > 0">
      <nuxt-link v-for="(item, index) in linkList" :to="currentPath + item.id">
        {{item.name }}<span v-if="index<linkList.length-1">, </span>
      </nuxt-link>

    </div>
    <div v-if="linkList.length === 0">
      -
    </div>
  </div>


</template>

<script>
export default {
  data() {
    return {
      currentPath : '',
      linkList : [],
      pathList : {
        clientDetail : '/parkinglot_setting/clients/',
        zoneDetail : '/parkinglot_setting/zones/',
        zoneGroupDetail : '/parkinglot_setting/zones_groups/',
        siteDetail : '/parkinglot_setting/sites/',
        machineDetail : '/parkinglot_setting/machines/',
        passGroupDetail : '/passes/groups/',
        passDetail : '/passes/list/',
        machineGroupDetail : '/parkinglot_setting/machine_groups/',
        passFormDetail : '/passes/form/',
        discountFormDetail : '/discounts/form/',
			 discountAccountDetail : '/discounts/account/',
        tenantDetail : '/tenants/list/',
        tenantGroupDetail : '/parkinglot_setting/tenant_groups/',
        visitDetail : '/inout/visits/',
        productDetail : '',
        discountProductDetail : '/discounts/products/',
        passProductDetail : '/passes/products/',
        paymentDetail : '/statics/payments/',
        userDetail : '/parkinglot_setting/users/',
        maintainerDetail : '/managers/list/',
      }
    }
  },
  props: ['type', 'linked','nameProperty'],
  created() {
    this.setData();
    this.currentPath = this.pathList[this.type];
  },
  watch : {
    linked : {
         handler : function(){
            this.setData()
         },
         deep : true
      },
    type : {
      handler : function(){
        this.currentPath = this.pathList[this.type];
      }
    }
  },
  mounted() {
    this.setData();
  },
  methods: {
    setData(){
      let tempList = [];
      let vm = this;
      if(Array.isArray(this.linked)){
        tempList = this.linked;
      }else{
        tempList.push(this.linked);
      }
      vm.linkList = [];
      tempList.forEach(function(value){
        if(value && value.id){
				let nameProperty = vm.nameProperty ? vm.nameProperty : 'name';
          vm.linkList.push({
            id : value.id,
            name : value[nameProperty] ? value[nameProperty] : value.id
          });
        }else{
          if(typeof value === 'string'){
            vm.linkList.push({
              id : value,
              name : value
            });
          }
        }
      });
    }
  }
}
</script>
