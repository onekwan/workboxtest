import mixin_const from "@/mixin/mixin_const";

export default {
    mixins: [mixin_const],
    data(){
        return {
            pageLoading : false,
            current_id: '',

            filters: {
                page: 1
            },
            tableProperty: {
                perPage: 50,
                currentPage: 1,
                fields: [

                ],
                excelName: ''
            }

            // discountType: $const.discountType,
            // discountSector: $const.discountSector,
            // discountMethod: $const.discountMethod,
        }
    },
    created() {
        tool_app.log('list page : ' + this.$route.path)
    },
    methods: {
        show_CU_Modal() {
            this.$refs['ref_'+this.cu_modalName].show();
        },
        TableRefreshAfterChange(deleteFlag) {
            if (deleteFlag) {
                this.$refs.c_modal.hide_modal();
            }
            this.$refs.ref_talble.refresh();
        },
        openDetail(userId) {
            this.current_id = userId;
            this.$refs.c_modal.show_modal();
        }
    }
}
