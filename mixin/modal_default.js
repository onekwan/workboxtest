import mixin_const from "@/mixin/mixin_const";


export default {
    mixins: [mixin_const],
    data(){
        return {
            api_submitted: false,
            api_flag: false,
            dynamicValidators: {}
        }
    },
    props: ["callback", "pageData", "mode","pageType"],
    mounted() {

    },
    methods: {
        show() {
            this.reset();
            if(typeof this.show_after_reset === 'function'){
                this.show_after_reset();
            }
            this.api_submitted = false;
            this.api_flag = false;
            this.$refs['modal'].show();
            if (this.mode === 'edit') {
                let vm = this;
                setTimeout(function () {
                    vm.setPageData();
                }, 100)
            }
        },
        hide() {
            this.$refs['modal'].hide();
        },
        checkInValidation(obj) {
            let arr= [];
            let vm = this;
            if(this.mode==='edit'){
                arr = obj.edit;
            }else{
                arr = obj.create;
            }

            let flag = false;
            arr.forEach(function(item){
                vm.$v.api_data[item].$touch();
                if(vm.$v.api_data[item].$invalid){
                    flag = true;
                }
            })

            if(flag){
                return true;
            }
        }
    }
}
