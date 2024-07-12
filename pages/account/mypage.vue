<script>
import PageLayout from "~/components/common/PageLayout";
import ModalPassword from "./ModalPassword.vue";

export default {
    components: {
        PageLayout,
        ModalPassword
    },
    data() {
        return {
            title: "마이 페이지",
            pageLoading: false,
            detailData: {}
        };
    },
    middleware: "authentication",
    mounted() {

    },
    methods: {
        show_passwordChange_Modal() {
            this.$refs.ref_ModalPassword.show();
        },
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <button class="btn btn-dark" @click="show_passwordChange_Modal">비밀번호 변경하기</button>
                        <ModalPassword ref="ref_ModalPassword"/>
                  </b-col>
            </b-row>

            <b-col cols="12">
                  <h5>개인정보가 들어갈 공간</h5>
            </b-col>
      </PageLayout>
</template>

<style></style>
