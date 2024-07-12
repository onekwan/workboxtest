<template>
      <div class="row">
            <div class="col-6">
                  <date-picker
                        v-model="date_value"
                        type="date"
                        lang="ko"
                        value-type="format" format="YYYY-MM-DD"
                        :disabled = "disabled"
                        :class="{ 'is-invalid' : invalid}"
                  ></date-picker>
            </div>
            <div class="col-6">
                  <date-picker v-model="time_value" type="time"
                               :disabled = "disabled"
                               value-type="format" format="HH:mm:ss" :class="{ 'is-invalid' : invalid}"></date-picker>
            </div>
      </div>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
    name: "date_startend",
    components: {},
    props: ['initType','value','invalid','disabled'],
      created() {
          if(this.initType === 'end'){
                this.time_value = '23:59:59';
          }

          this.initValue();
      },
      mounted() {
            this.initValue();
      },
    methods: {
          initValue(){
                let m = moment(this.value)
                if(m.isValid()){
                      this.date_value = m.format('YYYY-MM-DD');
                      this.time_value = m.format('HH:mm:ss');
                }else{

                }
          },
          changeValue(){
                if(this.date_value && this.time_value){
                      this.$emit('input', this.date_value + ' ' + this.time_value);
                }else{
                      this.$emit('input', '');
                }

          }
    },
    watch: {
      date_value() {
            this.changeValue();
      },
      time_value() {
            this.changeValue();
      },
      value() {
            this.initValue()
      }
    },
    data() {
          return {

                date_value : '',
                time_value : '00:00:00'
          }
    },
};
</script>

