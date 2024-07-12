<template>
  <!-- url 복사 안쓴다고 해서 가리기 -->
  <b-button v-if="false" v-b-tooltip.bottom.click="'URL이 복사되었습니다'"  @click="copy_URL">URL 복사</b-button>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ['detail_id'],
  mounted() {
  },
  methods: {
    copy_URL() {
      let vm = this;
      let url = '';
      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea);
      url = window.location.host + '/#' + this.$route.path;
      if (this.$route.name.indexOf('detail') < 0) {
        url += '/' + this.detail_id
      }
      textarea.value = url;
      textarea.select();
      navigator.clipboard.writeText(url)
        .then(function () {
          document.body.removeChild(textarea);
          setTimeout(() => {
            vm.$root.$emit('bv::hide::tooltip');
          }, 1000)
          // tool_app.dialog_info('URL이 복사되었습니다 : ' + url);
        })
    },
  }
}
</script>
