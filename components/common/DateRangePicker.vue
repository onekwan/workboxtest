<template>
      <date-range-picker
              v-model="dateRange"
              :locale-data="locale"
              :ranges="ranges"
              @update="dateChange(false)"
              opens="left"
              @click.native="setNow"

      >
            <!--		  <div slot="footer" slot-scope="data" class="slot">-->
            <!--				<div class="text-right pb-3">-->
            <!--					 {{ data.rangeText }}-->
            <!--					 <a @click="data.clickApply" v-if="!data.in_selection" class="btn btn-secondary btn-sm">취소</a>-->
            <!--					 <a @click="data.clickCancel" v-if="!data.in_selection" class="btn btn-success btn-sm">확인</a>-->
            <!--				</div>-->
            <!--		  </div>-->
      </date-range-picker>
</template>

<script>
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";

export default {
    name: "disabled_dates",
    components: {DateRangePicker},
    props: ['startDate', 'endDate', 'emptyInit'],
    methods: {
        dateChange(init) {
            let {startDate, endDate} = this.dateRange;
            startDate = moment(startDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            endDate = moment(endDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
            this.$emit('date-picker-change', startDate, endDate, init);
        },
        setNow() {
            /**
             * ranges
             * '오늘': [today_start, today],
             * '어제': [yesterday_start, yesterday_end],
             * '일주일': [aweek, today],
             * '이번달': [thisMonth, today],
             * '저번달': [beforeMonth_start, beforeMonth_end],
             * '최근1달' : [lastMonth, today],
             * '최근3달': [last3Month, today],
             */
            this.ranges['오늘'][0] = new Date(moment().startOf('day').format()); // today_start
            this.ranges['오늘'][1] = new Date(moment().endOf('day').format()); // today

            this.ranges['어제'][0] = new Date(moment().subtract('days', 1).startOf('day').format()); // yesterday_start
            this.ranges['어제'][1] = new Date(moment().subtract('days', 1).endOf('day').format()); // yesterday_end

            this.ranges['일주일'][0] = new Date(moment().subtract('days', 6).startOf('day').format()); // aweek
            this.ranges['일주일'][1] = new Date(moment().endOf('day').format()); // today

            this.ranges['이번달'][0] = new Date(moment().startOf('month').startOf('day').format()); // thisMonth
            this.ranges['이번달'][1] = new Date(moment().endOf('day').format()); // today

            this.ranges['저번달'][0] = new Date(moment().subtract('months', 1).startOf('month').startOf('day').format()); // beforeMonth_start
            this.ranges['저번달'][1] = new Date(moment().subtract('months', 1).endOf('month').endOf('day').format()); // beforeMonth_end

            this.ranges['최근1달'][0] = new Date(moment().subtract('months', 1).add('days', 1).startOf('day').format()); // lastMonth
            this.ranges['최근1달'][1] = new Date(moment().endOf('day').format()); // today

            this.ranges['최근3달'][0] = new Date(moment().subtract('months', 3).add('days', 1).startOf('day').format()); // last3Month
            this.ranges['최근3달'][1] = new Date(moment().endOf('day').format()); // today
        },
    },
    mounted() {
        if (!this.emptyInit) {
            this.dateChange(true);
        }
    },
    data() {

        const today = new Date(moment().endOf('day').format());
        const today_start = new Date(moment().startOf('day').format());

        let yesterday_start = new Date(moment().subtract('days', 1).startOf('day').format());
        let yesterday_end = new Date(moment().subtract('days', 1).endOf('day').format());


        let aweek = new Date(moment().subtract('days', 6).startOf('day').format());


        let thisMonth = new Date(moment().startOf('month').startOf('day').format());

        let beforeMonth_start = new Date(moment().subtract('months', 1).startOf('month').startOf('day').format());
        let beforeMonth_end = new Date(moment().subtract('months', 1).endOf('month').endOf('day').format());


        let lastMonth = new Date(moment().subtract('months', 1).add('days', 1).startOf('day').format());


        let last3Month = new Date(moment().subtract('months', 3).add('days', 1).startOf('day').format());

        let startDate = "";
        let endDate = "";

        if (!this.emptyInit) {
            startDate = this.startDate ? this.startDate : lastMonth;
            endDate = this.endDate ? this.endDate : today;
        }


        // this.emptyInit가 true 이어도 url 쿼리에 값이 있거나 기본적으로 값이 잇을 경우는 넣어주는 것으로
        if (this.startDate) {
            startDate = this.startDate
        }
        if (this.endDate) {
            endDate = this.endDate
        }


        return {
            dateRange: {
                startDate: startDate,
                endDate: endDate,
            },
            ranges: {
                '오늘': [today_start, today],
                '어제': [yesterday_start, yesterday_end],
                '일주일': [aweek, today],
                '이번달': [thisMonth, today],
                '저번달': [beforeMonth_start, beforeMonth_end],
                '최근1달': [lastMonth, today],
                '최근3달': [last3Month, today],
            },
            locale: {
                direction: "ltr",
                firstDay: 0,
                format: "yyyy/mm/dd",
                separator: " ~ ",
                applyLabel: "적용",
                cancelLabel: "취소",
                weekLabel: "주",
                customRangeLabel: "기간",
                daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
                monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월",],
            },
        };
    },
};
</script>
