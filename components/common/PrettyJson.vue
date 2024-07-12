<template>
<!--  <a :href="'/#'+currentPath + id" target="_blank">-->
<!--    {{name}}-->
<!--  </a>-->
  <pre style="margin-bottom: 0">{{text|prettyJSON}}</pre>


</template>

<script>
export default {
  data() {
    return {
		  jsonText : ''
    }
  },
  props: ['text'],
  watch : {
		text(){
			 this.setData();
    }
  },
  created() {
    this.setData();
  },
  methods: {
    setData(){
      if(this.text === null || this.text === undefined || this.text === ''){
		  this.jsonText = '';
		}else{
		  this.jsonText = this.text;
		}
    }
  }
}
</script>
