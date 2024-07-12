<template>
  <!-- url 복사 안쓴다고 해서 가리기 -->
	 <div>
		  <ul class="list">
				<li v-for="(item, index) in list" :key="index">
					 {{item.name}}<span v-if="item.site">(사업장 : {{item.site.name}})</span>
					 <button class="btn btn-outline-danger btn-sm" @click="onClickDelete(item.id)">삭제</button>
				</li>
		  </ul>
		  <button class="btn btn-outline-success btn-sm" @click="onClickAdd">추가</button>
	 </div>

</template>

<script>
export default {
  data() {
    return {
		  useAdd :false,
		  useDel :false
	 }
  },
	 created() {
		  if (this.addFunc) this.useAdd = true;
		  if (this.delFunc) this.useDel = true;
	 },
	 props: ['list','delFunc','addFunc'],
  mounted() {
  },
  methods: {
		onClickDelete(id){
			 if(this.delFunc) this.delFunc(id);
		},
		onClickAdd() {
			 if (this.addFunc) this.addFunc();
		}
  }
}
</script>
<style scoped>
.list {
  list-style-type: none;
  padding: 0;
}
/* */
</style>