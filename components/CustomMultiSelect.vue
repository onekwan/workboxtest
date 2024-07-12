<template>
      <multiselect v-model="m_value" :options="options" :label="label" :disabled="disabled" select-label=""
                   selectedLabel="" deselectLabel="" :multiple="multiple" :track-by="valueField"
                   :placeholder="placeholder">
            <template slot="option" slot-scope="props">
                  <div :title="textTitle(props.option)">
                        {{ props.option.name }}
                  </div>
            </template>
            <template slot="noResult">
                  데이터가 없습니다.
            </template>
      </multiselect>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";

export default {
    data() {
        return {
            m_value: null,
              cnt : 0,
              multiple_value_changed : false
        }
    },
    components: {
        Multiselect
    },
    watch: {
        m_value() {
              let vm = this;
              if(this.multiple){
                    this.multiple_value_changed = true;
                    let result = [];
                    if(this.m_value === null){
                          this.$emit('input', [])
                          return;
                    }
                    this.m_value.forEach(function (val) {
                          result.push(val[vm.valueField]);
                    });
                    // tool_app.log('result',result);
                    this.$emit('input',result)
              }else{
                    if(this.m_value){
                          this.$emit('input', this.m_value[this.valueField])
                    }else{
                          this.$emit('input', '')
                    }
              }

        },
        value() {
            this.initSelect();
        }
    },
    props: ['options', 'label', 'valueField', 'disabled', 'value','multiple','placeholder','isSiteName'],
    created() {

    },
    methods: {
        textTitle(text) {
            return JSON.stringify(text)
        },
        initSelect() {
              if(this.multiple){

                    if(this.multiple_value_changed){
                          this.multiple_value_changed = false;
                          return;
                    }
                    if(Array.isArray(this.value) && this.value.length > 0){
                          let result = [];
								  tool_app.log(this.value)
                          for(let i=0; i<this.value.length; i++){
                                for(let j=0; j<this.options.length; j++){
												tool_app.log(this.options[j][this.valueField])
												tool_app.log(this.value[i][this.valueField])
                                      if(this.options[j][this.valueField] === this.value[i][this.valueField]){

                                            result.push(this.options[j]);
                                            break;
                                      }
                                }
                          }
								  tool_app.log(result)
                          this.m_value = result;
                    }else if(Array.isArray(this.value) && this.value.length===0){
                          this.m_value = null;
                    }
              }else{
                    if(this.m_value && this.value === this.m_value[this.valueField]){
                          return;
                    }
                    if(this.value === '' || this.value === null){
                          this.m_value = this.value;
                          return;
                    }
                    for(let i=0; i<this.options.length; i++){
                          if(this.options[i][this.valueField] === this.value){

                                this.m_value = this.options[i];
                                tool_app.log(this.m_value)
                                break;
                          }
                    }
              }
        }
    },
    mounted() {

    }
};
</script>
<style lang="scss">
.multiselect--disabled{
      background: #f5f6f8;
      .multiselect__select{display: none}
      .multiselect__tags{background: #f5f6f8 !important;}
      .multiselect__single{background: #f5f6f8 !important;}
}
.multiselect__option--selected {
      background: #f3f3f3;
      color: #999 !important;
      font-weight: 700;
}
</style>
