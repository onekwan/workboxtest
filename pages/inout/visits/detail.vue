<script>
import PageLayout from "~/components/common/PageLayout";
import ModalVisits from "./ModalVisits.vue";
import CopyUrl from "~/components/common/CopyUrl";
import ModalDiscount from "@/pages/discounts/list/ModalDiscount.vue";
import {mapState} from "vuex";
import detail_default from "@/mixin/detail_default";
import detail_lprImgArea from "./detail_lprImgArea.vue";


export default {
      mixins: [detail_default],
    components: {
        PageLayout,
        ModalVisits,
        CopyUrl,
          ModalDiscount,
		  detail_lprImgArea
    },
    data() {
        return {
            title: "방문차량 상세정보",
            imageLoading: false,
              imageList : null,
              imageType : $const.imageType,
              api_domain : mainapi.API_DOMAIN,
              cu_modalName: 'ModalVisits',
              apiPath: '/api/v1/visits/',
               deleteMsgTitle : '방문차량'

        };
    },
    middleware: "authentication",
      computed : {
            ...mapState('fee', {
                  feeInfo: state => state.fee
            })
      },
    mounted() {

    },

	 beforeDestroy(){
		  this.$store.dispatch('fee/clearFeeCheck');
	 },

    methods: {
        async getDetail() {
            this.pageLoading = true;

            try {
                const res = await mainapi.invokeAPI_GET(this.apiPath + this.page_id, {}, 'GET')

                if (res.data.code !== $const.ApiSuccessCode.GET) {
                    tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
                }
                const data = res.data.data
                this.detailData = this.manipulate_Data(data);
					 if(!this.detailData.exited){
						  this.$store.dispatch('fee/polingFeeCheck',this.page_id);
					 }
            } catch (e) {
                tool_app.dialog_alert(e);
            } finally {
                this.pageLoading = false;
            }
        },

        manipulate_Data(data) {
            data.type_local = $const.visitType[data.type];
            data.status_local = $const.visitStatus[data.status];
            data.enterType_local = $const.visitEnterType[data.enterType];
            data.exitType_local = $const.visitExitType[data.exitType];
            data.payMethod_local = $const.payMethods[data.payMethod];
            return data;
        },

          show_discount_modal(){
                this.$refs.ref_ModalDiscount.show(this.detailData.id,this.detailData.carNumber);
          }
    }
};
</script>

<template>
      <PageLayout :title="title" :page-loading="pageLoading">
            <b-row>
                  <b-col cols="8">
                        <button class="btn btn-warning" @click="show_CU_Modal">수정</button>
                        <SpinnerButton :loading="api_delete_flag" @click="deleteDetail" variant="danger">삭제
                        </SpinnerButton>
							 <button v-if="!detailData.exited" class="btn btn-dark" @click="show_discount_modal">할인 등록</button>
                        <ModalVisits ref="ref_ModalVisits" :page-data="detailData" mode="edit"
                                     :callback="refreshAfterChange"/>
                        <ModalDiscount ref="ref_ModalDiscount" :callback="refreshAfterChange"/>
                  </b-col>
                  <b-col cols="4" class="text-right">
                        <CopyUrl :detail_id="page_id"/>
                  </b-col>
            </b-row>
            <b-row class="mt-4">
                  <b-col cols="8">
                        <div class="card-body">
                              <dl class="row detail_page_striped">
                                    <dt class="col-sm-3">UID</dt>
                                    <dd class="col-9">{{ detailData.id | emptyCheck }}</dd>

                                    <dt class="col-sm-3">차량 번호</dt>
                                    <dd class="col-9">{{ detailData.carNumber | emptyCheck }}</dd>

                                    <dt class="col-sm-3">방문 유형</dt>
                                    <dd class="col-9">{{ detailData.type_local | emptyCheck }}</dd>

                                    <dt class="col-sm-3">상태</dt>
                                    <dd class="col-9">{{ detailData.status_local | emptyCheck }}</dd>

                                    <dt class="col-sm-3">카테고리</dt>
                                    <dd class="col-9">{{ detailData.category | emptyCheck }}</dd>

                                    <dt class="col-sm-3">주차 사업장</dt>
                                    <dd class="col-9">
                                          <link-page :type="'siteDetail'" :linked="detailData.site"/>
                                    </dd>

                                    <dt class="col-sm-3">주차장</dt>
                                    <dd class="col-9">
                                          <link-page :type="'zoneDetail'" :linked="detailData.zone"/>
                                    </dd>

                                    <dt class="col-sm-3">입차 유형</dt>
                                    <dd class="col-9">{{ detailData.enterType_local | emptyCheck }}</dd>

                                    <dt class="col-sm-3">입차 일시</dt>
                                    <dd class="col-9">{{ detailData.entered | emptyCheck }}</dd>

                                    <dt class="col-sm-3">입차 설비</dt>
                                    <dd class="col-9">
                                          <link-page :type="'machineDetail'" :linked="detailData.enterMachine"/>
                                    </dd>

                                    <dt class="col-sm-3">수동 입차 여부</dt>
                                    <dd class="col-9">{{ detailData.manualEnter }}</dd>

                                    <dt class="col-sm-3">외부 서비스 입차 여부</dt>
                                    <dd class="col-9">{{ detailData.externalEnter }}</dd>

                                    <dt class="col-sm-3">출차 유형</dt>
                                    <dd class="col-9">{{ detailData.exitType_local | emptyCheck }}</dd>

                                    <dt class="col-sm-3">출차 일시</dt>
                                    <dd class="col-9">{{ detailData.exited | emptyCheck }}</dd>


                                    <dt class="col-sm-3">출차 설비</dt>
                                    <dd class="col-9">
                                          {{ detailData.exitMachine | emptyCheck }}
                                          <link-page :type="'machineDetail'" :linked="detailData.exitMachine"/>
                                    </dd>

                                    <dt class="col-sm-3">수동 출차 여부</dt>
                                    <dd class="col-9">{{ detailData.manualExit | emptyCheck }}</dd>

                                    <dt class="col-sm-3">외부 서비스 출차 여부</dt>
                                    <dd class="col-9">{{ detailData.externalExit | emptyCheck }}</dd>


                                    <dt class="col-sm-3">발생한 주차 요금</dt>
                                    <dd class="col-9" >{{ isNaN(feeInfo.standardFee) ? 0 : feeInfo.standardFee | three_comma }} 원</dd>
                                    <dt class="col-sm-3">할인 금액</dt>
                                    <dd class="col-9">{{ isNaN(feeInfo.standardFee-feeInfo.discountedFee) ? 0 : (feeInfo.standardFee-feeInfo.discountedFee) | three_comma }} 원</dd>
                                    <dt class="col-sm-3">정기권 할인 금액</dt>
                                    <dd class="col-9">{{ isNaN(feeInfo.standardFee-feeInfo.passedFee) ? 0 : (feeInfo.standardFee-feeInfo.passedFee) | three_comma }} 원</dd>
                                    <dt class="col-sm-3">조정 금액</dt>
                                    <dd class="col-9">{{ isNaN(feeInfo.adjustFee) ? 0 : feeInfo.adjustFee | three_comma }} 원</dd>
                                    <dt class="col-sm-3">실제 결제 금액</dt>
                                    <dd class="col-9">{{ isNaN(feeInfo.finalFee) ? 0 : feeInfo.finalFee | three_comma }} 원</dd>



                                    <dt class="col-sm-3">정산 일시</dt>
                                    <dd class="col-9">{{ detailData.settled | emptyCheck }}</dd>

                                    <dt class="col-sm-3">정산 설비</dt>
                                    <dd class="col-9">{{ detailData.settleMachine | emptyCheck }}</dd>

                                    <dt class="col-sm-3">정산 혜택</dt>
                                    <dd class="col-9">{{ detailData.benefits | emptyCheck }}</dd>

                                    <dt class="col-sm-3">결제 일시</dt>
                                    <dd class="col-9">{{ detailData.payed | emptyCheck }}</dd>

                                    <dt class="col-sm-3">결제 설비</dt>
                                    <dd class="col-9">{{ detailData.payMachine | emptyCheck }}</dd>

                                    <dt class="col-sm-3">결제 방법</dt>
                                    <dd class="col-9">{{ detailData.payMethod_local | emptyCheck }}</dd>

                                    <dt class="col-sm-3">결제액</dt>
                                    <dd class="col-9">{{ detailData.payedFee | emptyCheck }}</dd>

                                    <dt class="col-sm-3">특이 사항</dt>
                                    <dd class="col-9">{{ detailData.memo | emptyCheck }}</dd>

                                    <dt class="col-sm-3">부가 사항</dt>
                                    <dd class="col-9">{{ detailData.details | emptyCheck }}</dd>

											 <dt class="col-sm-3">등록자</dt>
											 <dd class="col-9">
												  <link-page :type="'userDetail'" :linked="{id:detailData.creatorId,name:detailData.creatorName}"/>
											 </dd>

                                    <dt class="col-sm-3">등록 일시</dt>
                                    <dd class="col-9">{{ detailData.created | emptyCheck }}</dd>

											 <dt class="col-sm-3">변경자</dt>
											 <dd class="col-9">
												  <link-page :type="'userDetail'" :linked="{id:detailData.modifierId,name:detailData.modifierName}"/>
											 </dd>

                                    <dt class="col-sm-3">변경 일시</dt>
                                    <dd class="col-9">{{ detailData.modified | emptyCheck }}</dd>
                              </dl>
                        </div>
                  </b-col>
                  <b-col cols="4">
							 <detail_lprImgArea :page_id="page_id" />
<!--                        <div class="card" v-for="(data, prop) in imageList"  :key="prop">-->
<!--                              <div class="img_box" v-if="data !== null">-->
<!--                                    <img-->
<!--                                          :src="data ? data : require('~/assets/images/custom/noimage.png')"-->
<!--                                          :style="{width:'100%'}"-->
<!--                                    />-->
<!--                                    <span>{{imageType[prop]}}</span>-->
<!--                              </div>-->
<!--                              <hr class="my-0"/>-->
<!--                              <b-container class="mt-3">-->
<!--                                    <p>{{imageType[prop]}}</p>-->
<!--                              </b-container>-->
<!--                        </div>-->

                  </b-col>
            </b-row>
      </PageLayout>
</template>

<style></style>
