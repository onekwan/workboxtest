<script>
import CryptoJS from 'crypto-js';
import format from 'date-format';
import {mapState} from "vuex";

//나이스 페이먼츠 테스트 정보
const merchantKey = "EYzu8jGGMfqaDEp76gSckuvnaHHu+bC4opsSN6lHv3b2lurNYkVXrZ7Z1AoqQnXI3eLuaUFyoRNC6FkrzVjceg==";
const merchantID = "nicepay00m";


//rs에서 준 테스트 정보
// const merchantKey = "kycaSzY5z+nxjlh/KUc/tUMBVWoAXl9yU+IuTZKW2ZN1CAZpzL5g1KngKtNt18qY3Nk//HCcBuZOpAlzIWecng==";
// const merchantID = "DDkmpark002m";


//rs 실서버 정보
// const merchantKey = "UydgQbOGnwkNJzpHKJqhWP6sQdGPaHMQBCUAuTEscZRRfpLNv6jk54fAR1Nk3iWx8nhCrfj/le2HamgqMyGr1w==";
// const merchantID = "kmpark001m";


function getSignData(str) {
    var encrypted = CryptoJS.SHA256(str);
    return encrypted;
}

window.paymentData = null;

//[PC Only]When pc payment window is closed, nicepay-pgweb.js call back nicepaySubmit() function <<'nicepaySubmit()' DO NOT CHANGE>>
window.nicepaySubmit = async function () {
      tool_app.log('111111111111111111111')
    //document.payForm.submit();
      let approvalData = null;

    try {
          let payload = {
                AuthResultCode: '',
                AuthResultMsg: '',
                NextAppURL: '',
                TxTid: '',
                AuthToken: '',
                PayMethod: '',
                MID: '',
                Moid: '',
                Amt: '',
                ReqReserved: '',
                NetCancelURL: ''
          }

          tool_app.log('22222222222222222222222222')
          let formElements = document.payForm.elements;
          tool_app.log(formElements)
          for(let prop in payload){
                tool_app.log(prop);
                tool_app.log(formElements[prop].value);
                payload[prop] = formElements[prop].value;
          }


          let authToken = payload.AuthToken;
          let mid = payload.MID;
          let amt = payload.Amt;
          payload.ediDate = format.asString('yyyyMMddhhmmss', new Date());
          payload.signData = getSignData(authToken + mid + amt + payload.ediDate + merchantKey).toString();
          tool_app.log('33333333333333333333333333333333')


        let res = await mainapi.invokeAPI_PG_TEST('/api/v1/nicepayments', payload);

        // if (res.data.code !== $const.ApiSuccessCode.POST) {
        //     tool_app.dialog_alert(res.data.code + '<br/>' + res.data.msg)
        // }

        approvalData = JSON.parse(res.data.data.result);
    } catch (e) {
        tool_app.dialog_alert(e);
    }

      try {
            if(window.paymentData===null) return false;
            let temp = (""+approvalData.AuthDate);
            const tArr = [];
            for (let i = 0; i < temp.length; i += 2) {
                  tArr.push(temp.slice(i, i + 2));
            }
            let dateTxt = `20${tArr[0]}-${tArr[1]}-${tArr[2]} ${tArr[3]}:${tArr[4]}:${tArr[5]}`;
            let payed = moment(dateTxt).format('YYYY-MM-DD HH:mm:ss');
            let authDate = moment(dateTxt).format('YYYYMMDD');
            let authTime = moment(dateTxt).format('HHmmss');
            let payRawData = JSON.stringify(approvalData);
            let created = moment().format('YYYY-MM-DD HH:mm:ss');
            let payLoad = {
                  name: window.paymentData.name,
                  orderIds: window.paymentData.orderIds,
                  // clientId: '',
                  mainZoneId: window.paymentData.mainZoneId,
                  billedAmt: window.paymentData.billedAmt,
                  payedAmt: approvalData.Amt,
                  payMethod: window.paymentData.payMethod,
                  payMethodNo: window.paymentData.payMethod === 'CARD' ? approvalData.CardNo : '',
                  authCode: approvalData.AuthCode,
                  authDate: authDate,
                  authTime: authTime,
                  payed: payed,
                  payMachineId: null,
                  payRawData: payRawData,
                  created: created
            };

            payLoad.billedAmt = parseInt(payLoad.billedAmt);
            payLoad.payedAmt = parseInt(payLoad.payedAmt);

            let res = await mainapi.invokeAPI('/api/v1/product-payments', payLoad, 'POST');

            if (res.data.code !== $const.ApiSuccessCode.POST) {
                  throw res.data.msg;
                  return false;
            }

            //tool_app.dialog_success(`결제가 완료되었습니다.`);
            //this.$store.commit('product/SET_PAYMENT_ID', res.data.data.id);
            window.$nuxt.$router.push('/ut/shop/complete/'+res.data.data.id);
      } catch (e) {
            tool_app.log(e)
            tool_app.dialog_alert(`결제에 실패하였습니다.` + "<br/>" + e.msg ? e.msg : e);
      } finally {

      }

      try{
            document.getElementById('nice_layer').remove();
      }catch (e) {

      }

      try{
            document.getElementById('bg_layer').remove();
      }catch (e) {

      }
}

//[PC Only]payment window close function <<'nicepayClose()' DO NOT CHANGE>>
window.nicepayClose = function () {
    alert("결제가 취소 되었습니다");
}
export default {
    head: {
        script: [
            {src: 'https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js', body: true}
        ]
    },
    components: {},
    props: ['data', 'mainZoneId', 'PayMethod'],
    data() {
        return {
            amt: '0',
            returnURL: 'http://localhost:3000/authReq',
            goodsName: "",
            moid: '',
            buyerName: '',
            buyerEmail: '',
            buyerTel: '',
            ediDate: '',
            signData: '',
            merchantID: merchantID,

            //rs용 데이타
            rs: {
                name: '',
                orderIds: '',
                mainZoneId: '',
                billedAmt: 0,
                payedAmt: 0,
                payMethod: '',
            }

        };
    },
    created() {

    },
    middleware: "authentication",
    mounted() {

    },
    computed: {
        ...mapState('product', {
            orderData: state => state.orderData,
            mainZoneID: state => state.mainZoneID,
            payMethod: state => state.payMethod
        })
    },
    methods: {
        async connectPG() {
            this.amt = this.orderData.price;
            this.goodsName = this.orderData.product.name;
            this.moid = this.orderData.id;
            this.buyerName = this.orderData.orderer === null ? this.orderData.creatorName : this.orderData.orderer.name;
            this.ediDate = format.asString('yyyyMMddhhmmss', new Date());
            this.signData = getSignData(this.ediDate + merchantID + this.amt + merchantKey).toString();


            window.paymentData = {
                  name : $const.productType[this.orderData.type] + ' 결제',
                  orderIds : [this.orderData.id],
                  mainZoneId : this.mainZoneID,
                  billedAmt : this.orderData.price,
                  payMethod : this.payMethod,
            }



            setTimeout(function () {
                goPay(document.payForm);
            }, 100)

        }
    }
};
</script>

<template>
      <form name="payForm" method="post" accept-charset="euc-kr" style="display: none">
            <table>
                  <!--                  <tr>-->
                  <!--                        <th>rs data</th>-->
                  <!--                        <td>-->
                  <!--                              <input type="text" name="payName" v-model="rs.name">-->
                  <!--                              <input type="text" name="orderIds" v-model="rs.orderIds">-->
                  <!--                              <input type="text" name="mainZoneId" v-model="rs.mainZoneId">-->
                  <!--                              <input type="text" name="payMethod" v-model="rs.payMethod">-->
                  <!--                        </td>-->
                  <!--                  </tr>-->
                  <tr>
                        <th>PayMethod</th>
                        <td><input type="text" name="PayMethod" v-model="payMethod"></td>
                  </tr>
                  <tr>
                        <th>GoodsName</th>
                        <td><input type="text" name="GoodsName" v-model="goodsName"></td>
                  </tr>
                  <tr>
                        <th>Amt</th>
                        <td><input type="text" name="Amt" v-model="amt"></td>
                  </tr>
                  <tr>
                        <th>MID</th>
                        <td><input type="text" name="MID" v-model="merchantID"></td>
                  </tr>
                  <tr>
                        <th>Moid</th>
                        <td><input type="text" name="Moid" v-model="moid"></td>
                  </tr>
                  <tr>
                        <th>BuyerName</th>
                        <td><input type="text" name="BuyerName" v-model="buyerName"></td>
                  </tr>
                  <tr>
                        <th>BuyerEmail</th>
                        <td><input type="text" name="BuyerEmail" v-model="buyerEmail"></td>
                  </tr>
                  <tr>
                        <th>BuyerTel</th>
                        <td><input type="text" name="BuyerTel" v-model="buyerTel"></td>
                  </tr>
                  <tr>
                        <th>ReturnURL [Mobile only]</th>
                        <td><input type="text" name="ReturnURL" :value="returnURL">
                        </td>
                  </tr>
                  <tr>
                        <th>Virtual Account Expiration Date(YYYYMMDD)</th>
                        <td><input type="text" name="VbankExpDate" value=""></td>
                  </tr>

                  <input type="hidden" name="NpLang" value="KO"/> <!-- EN:English, CN:Chinese, KO:Korean -->
                  <input type="hidden" name="GoodsCl" value="1"/> <!-- products(1), contents(0)) -->
                  <input type="hidden" name="TransType" value="0"/>   <!-- USE escrow false(0)/true(1) -->
                  <input type="hidden" name="CharSet" value="utf-8"/>   <!-- Return CharSet -->
                  <input type="hidden" name="ReqReserved" value=""/>   <!-- mall custom field -->

                  <!-- DO NOT CHANGE -->
                  <input type="hidden" name="EdiDate" v-model="ediDate"/>         <!-- YYYYMMDDHHMISS -->
                  <input type="hidden" name="SignData" v-model="signData"/>
                  <!-- EncryptData -->
            </table>
            <!--            <a href="#" class="btn_blue" onClick="nicepayStart();">REQUEST</a>-->
      </form>
</template>

<style>
</style>
