<script>
import PageLayout_noWhiteBg from "~/components/common/PageLayout_noWhiteBg";
import {mapState} from "vuex";
import mixin_const from "@/mixin/mixin_const";

export default {
      mixins: [mixin_const],
    computed: {
        ...mapState('product', {
            currentProduct: state => state.currentProduct,
            availableQuota: state => state.availableQuota
        }),
        getTotalPrice() {
            return this.$options.filters.three_comma(this.orderCount * this.currentProduct.unitPrice);
        }
    },
    components: {
        PageLayout_noWhiteBg
    },
    data() {
        return {
            title: "상품 주문",
            pageLoading: true,
            api_flag: false,
            orderCount: 1,
            provisionAccepted: false,
            carNumber: ''
        };
    },
    middleware: "authentication",
      created(){

      },
    mounted() {

    },
    methods: {
        show_modal_terms() {
            this.$refs.modal_terms.show();
        },
        async onPurchase($event) {
            let orderCnt = tool_app.enableNaN(this.orderCount);

            if (this.api_flag) {
                tool_app.dialog_alert('처리중입니다. 잠시만 기다려주세요.');
                return false;
            }

            this.api_flag = true;


            if (!this.provisionAccepted) {
                tool_app.dialog_alert('약관에 동의를 하셔야 합니다.');
                this.api_flag = false;
                return;
            }

            if (orderCnt <= 0 || orderCnt > this.availableQuota) {
                tool_app.dialog_alert('구매량이 잘못 입력되었습니다.');
                this.api_flag = false;
                return;
            }


            let payload = {
                type: this.currentProduct.type,
                productId: this.currentProduct.id,
                qty: orderCnt,
            }

            if(payload.type==='PASS'){
                payload.carNumber = this.carNumber;
            }

              this.$store.commit('product/SET_ORDER_CNT', this.orderCount);



              try {
                    let res = await mainapi.invokeAPI('/api/v1/orders', payload, 'POST');

                    if (res.data.code !== $const.ApiSuccessCode.POST) {
                          throw res.data.msg;
                          return false;
                    }

                    this.api_submitted = false;
                    this.api_flag = false;
                    if (this.callback) this.callback();
                    this.$store.commit('product/SET_ORDER_ID', res.data.data.id);
                    this.$router.push({
                          path: "/ut/shop/payment"
                    })

              } catch (e) {
                    tool_app.log(e)
                    tool_app.dialog_alert(`정기권 상품 주문에 실패하였습니다.` + "<br/>" + tool_app.ErrorMsg(e));
              } finally {
                    this.api_flag = false;
              }
        },
        click_qty(num) {
            if (this.orderCount <= 1 && num < 0) return false;
            if (this.orderCount >= this.availableQuota && num > 0) return false;
            this.orderCount = parseInt(this.orderCount) + num;
        }
        ,
    }

}
;
</script>

<template>
      <PageLayout_noWhiteBg :title="title" :page-loading="false">

            <b-row class="mt-2">
                  <b-col cols="12">
                        <h5>상품명</h5>
                        <b-card>
                              {{ currentProduct.name }}
                        </b-card>
                        <h5>상품구성</h5>
                        <b-card>
                              <dl class="row mb-0">
                                    <dt class="col-sm-3">상품 UID</dt>
                                    <dd class="col-sm-9">{{ currentProduct.id | emptyCheck}}</dd>
                                    <dt class="col-sm-3">상품명</dt>
                                    <dd class="col-sm-9">{{ currentProduct.name  | emptyCheck}}</dd>
                                    <dt class="col-sm-3">상품 유형</dt>
                                    <dd class="col-sm-9">{{ productType[currentProduct.type] | emptyCheck }}</dd>
                                    <dt class="col-sm-3">시작일</dt>
                                    <dd class="col-sm-9">{{ currentProduct.passStart  | emptyCheck}}</dd>
                                    <dt class="col-sm-3">종료일</dt>
                                    <dd class="col-sm-9">{{ currentProduct.passEnd  | emptyCheck}}</dd>
                                    <dt class="col-sm-3">관리 코드</dt>
                                    <dd class="col-sm-9">{{ currentProduct.code  | emptyCheck}}</dd>
<!--                                    <dt class="col-sm-3">정기권 유형</dt>-->
<!--                                    <dd class="col-sm-9">{{-->
<!--														  currentProduct.passForm ? `${currentProduct.passForm.name}(${currentProduct.passForm.id})` : '-'-->
<!--                                          }}-->
<!--                                    </dd>-->
<!--                                    <dt class="col-sm-3">정기권 속성 그룹</dt>-->
<!--                                    <dd class="col-sm-9">{{-->
<!--														  currentProduct.passGroup ? `${currentProduct.passGroup.name}(${currentProduct.passGroup.id})` : '-'-->
<!--                                          }}-->
<!--                                    </dd>-->
                                    <dt class="col-sm-3">구매시작일</dt>
                                    <dd class="col-sm-9">{{ currentProduct.orderStart  | emptyCheck}}</dd>
                                    <dt class="col-sm-3">구매종료일</dt>
                                    <dd class="col-sm-9">{{ currentProduct.orderEnd  | emptyCheck}}</dd>
                              </dl>
                        </b-card>
                        <h5 class="clearfix" v-if="this.currentProduct.type==='PASS'">
                              <span class="float-start">등록 할 차량번호</span>
                        </h5>
                        <div class="card" v-if="this.currentProduct.type==='PASS'">
                              <div class="card-body">
                                    <b-row>
                                          <b-col cols="12">
                                                <b-input-group prepend="차량번호">
                                                      <input type="text" class="form-control" v-model="carNumber" style="max-width:250px"/>
                                                </b-input-group>
                                                <p class="mt-1 mb-0">* 한글 지역명이 있는  경우 제외하고 입력해주세요. 예) 11가1111 </p>
                                          </b-col>
                                    </b-row>
                              </div>
                        </div>

                        <h5 class="clearfix">
                              <span class="float-start">구매수량</span>
                              <span class="float-end"></span>
                        </h5>
                        <div class="card">
                              <div class="card-body">
                                    <b-row>
                                          <b-col cols="6">
                                                <div style="width:150px">
                                                      <b-input-group>
                                                            <b-input-group-prepend>
                                                                  <b-button variant="light" :disabled="this.currentProduct.type==='PASS'"
                                                                            style="font-size: 24px;padding: 2px 14px 4px;"
                                                                            @click="click_qty(-1)">-
                                                                  </b-button>
                                                            </b-input-group-prepend>
                                                            <b-form-input v-model="orderCount" :disabled="this.currentProduct.type==='PASS'"
                                                                          v-mask="'######'"
                                                                          style="text-align: center"></b-form-input>
                                                            <b-input-group-append>
                                                                  <b-button variant="light" :disabled="this.currentProduct.type==='PASS'"
                                                                            style="font-size: 24px;padding: 2px 14px 4px;"
                                                                            @click="click_qty(1)">+
                                                                  </b-button>
                                                            </b-input-group-append>
                                                      </b-input-group>

                                                </div>
                                          </b-col>
                                          <b-col cols="6" class="text-right">
                                                가격 {{ currentProduct.unitPrice | three_comma }} 원<br/>
                                                <p class="mb-0">최대 구매 가능 수량 {{
                                                      availableQuota | three_comma
                                                }}장</p>

                                          </b-col>
                                    </b-row>
                              </div>
                              <hr class="my-0"/>
                              <div class="card-body">
                                    <b-row>
                                          <b-col cols="6">
                                                구매 수량 {{ orderCount }}개
                                          </b-col>
                                          <b-col cols="6" class="text-right">
                                                총 금액 {{ getTotalPrice }}원
                                          </b-col>
                                    </b-row>
                              </div>
                        </div>

                        <div class="link_checkbox">
                              <b-form-checkbox
                                      v-model="provisionAccepted"
                                      :value="true"
                                      :unchecked-value="false"
                                      plain
                                      class="d-inline-block"
                              ></b-form-checkbox>
                              <a href="#" class="link" @click.prevent="show_modal_terms">상품 구매 약관 동의(필수)</a>
                              <b-modal ref="modal_terms" id="modal-standard" title="상품구매 약관" title-class="font-18"
                                       size="xl" hide-footer>
                                    <b-container>
                                          상품 구매 약관
                                    </b-container>
                              </b-modal>
                        </div>
                        <div class="text-right">
                              <SpinnerButton :loading="api_flag" @click="onPurchase" variant="info">주문하기</SpinnerButton>
                        </div>
                        <div>
                              <h5 class="mt-5">구매안내</h5>
                              <p>
                                    사용기간 시작 전 정기권은 전체 결제취소가 가능합니다.<br/>
                                    차량등록 여부와 관계없이 사용기간 중 환불은 주차장 일 최대 요금으로 일할 계산하여 차액이 환불됩니다.<br/>
                                    카드 결제의 부분 환불은 사용금액 만큼 재 결제 후 원 결제금액이 취소됩니다.<br/>
                                    자세한 환불 관련 문의는 주차장 관리인에게 요청 주세요.<br/>
                              </p>
                        </div>
                  </b-col>
            </b-row>
      </PageLayout_noWhiteBg>

</template>

<style></style>
