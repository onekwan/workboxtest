import mixin_const from "@/mixin/mixin_const";

export default {
    mixins: [mixin_const],
    data(){
        return {
            pageLoading: false,
            page_id: '',
            detailData: {},
            openType: 'popup',
            pageType : '',
            api_delete_flag : false,
            apiPath : '',
            deleteMsgTitle : ''
        }
    },
    props: ['currentId', 'afterDelete'],
    mounted() {
        this.page_id = this.currentId || this.$route.params.id;
        this.openType = this.currentId ? 'popup' : 'page';
        if (!this.page_id) return false;
        this.getDetail();
    },
    methods: {
        show_CU_Modal() {
            this.$refs['ref_'+this.cu_modalName].show();
        },
        refreshAfterChange() {
            this.getDetail();
        },
        async deleteDetail() {
            try {

                if (this.api_delete_flag) {
                    tool_app.dialog_alert("데이터 전송중입니다.");
                    return;
                }

                let cf = await tool_app.confirm(`${this.deleteMsgTitle}을(를) 삭제하시겠습니까?`);
                if (!cf.isConfirmed) return false;


                this.api_delete_flag = true;

                const res = await mainapi.invokeAPI(this.apiPath + this.detailData.id, {}, 'DELETE')

                if (res.data.code !== $const.ApiSuccessCode.DELETE) {
                    throw res.data.msg;
                    return false;
                }

                tool_app.dialog_success(`${this.deleteMsgTitle} 삭제가 완료되었습니다.`);

                if (typeof this.afterDelete === "function") this.afterDelete(true);
                if(this.openType === 'page' && this.listUrl) this.$router.push(this.listUrl);
            } catch (e) {
                tool_app.log(e)
                tool_app.dialog_alert(`${this.deleteMsgTitle} 삭제에 실패하였습니다.<br/>` + tool_app.ErrorMsg(e));
            } finally {
                this.api_delete_flag = false;
            }
        }
    }
}
