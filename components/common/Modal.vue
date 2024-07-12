<template>
  <b-modal ref="detail_modal" id="deatilModal" :size="setSize" hide-footer hide-header>
    <button type="button" aria-label="Close" class="close custom_modal_close" @click="hide_modal">×</button>
    <slot>

    </slot>

    <div class="w-100 text-right">
      <b-button variant="primary" @click="hide_modal">
        확인
      </b-button>
    </div>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      setSize: 'xl',
    }
  },
  props: ['size'],
  mounted() {
    //size [sm, lg, xl]
    this.setSize = this.size ?? 'xl';
  },
  methods: {
    show_modal() {
      this.$refs['detail_modal'].show();
    },
    hide_modal() {
      this.$refs['detail_modal'].hide();
    },
  }
}
</script>

<style scoped>
.custom_modal_close{
  position:absolute;top:10px;right:10px;background: #fff;border: 0;font-size:18px;cursor: pointer;z-index: 10;
}
</style>
